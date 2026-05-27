import os
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from rest_framework import generics, status
from .models import Complaint, StatusHistory, ComplaintUpvote, ComplaintAssignment
from .serializers import ComplaintCreateSerializer, ComplaintListSerializer, ComplaintDetailSerializer, ComplaintHeatmapSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from django.db.models import Count
from django.db.models.functions import TruncWeek
from datetime import timedelta
from django.utils import timezone
from notifications.models import Notification
from accounts.serializers import UserProfileSerializer
from accounts.models import CustomUser
from django.core.cache import cache


def send_status_email(to_email, citizen_name, complaint_title, new_status):
    try:
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = os.getenv('BREVO_API_KEY')

        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
            sib_api_v3_sdk.ApiClient(configuration)
        )

        email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": to_email}],
            sender={"email": os.getenv('DEFAULT_FROM_EMAIL'), "name": "CivicAid"},
            subject="CivicAid - Your Complaint Status Updated",
            text_content=f"Dear {citizen_name}, your complaint '{complaint_title}' has been updated to {new_status.replace('_', ' ')}."
        )
        api_instance.send_transac_email(email)
    except ApiException as e:
        print(f"Email sending failed: {e}")

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'admin'

class ComplaintListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ComplaintCreateSerializer
        return ComplaintListSerializer

    def get_queryset(self):
        return Complaint.objects.all().order_by('-created_at')  # changed

    def create(self, request, *args, **kwargs):
        user_id = request.user.id
        cache_key = f"complaint_ratelimit_{user_id}"
        request_count = cache.get(cache_key, 0)

        if request_count >= 5:
            return Response(
                {"detail": "You have submitted too many complaints. Please wait before trying again."},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        print("DATA:", request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("ERRORS:", serializer.errors)
            return Response(serializer.errors, status=400)
        
        self.perform_create(serializer)

        cache.set(cache_key, request_count + 1, timeout=3600)

        return Response(serializer.data, status=201)

    def perform_create(self, serializer):
        complaint = serializer.save(citizen=self.request.user)
        try:
            from ai_engine.pipeline import analyze
            analyze(complaint)
        except Exception as e:
            print(f"AI pipeline error: {e}")

        Notification.objects.create(
            recipient=complaint.citizen,
            complaint=complaint,
            event=Notification.Event.SUBMITTED,
            message=f"Your complaint '{complaint.title}' has been submitted successfully.",
            message_ne=f"तपाईंको उजुरी '{complaint.title}' सफलतापूर्वक दर्ता भयो।"
    )

class ComplaintDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ComplaintDetailSerializer

    def get_object(self):
        complaint_id = self.kwargs['pk']
        return get_object_or_404(Complaint, id=complaint_id)

class MyComplaintListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ComplaintListSerializer

    def get_queryset(self):
        return Complaint.objects.filter(citizen=self.request.user).order_by('-created_at')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class UpvoteToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        complaint = get_object_or_404(Complaint, id=pk)

        upvote = ComplaintUpvote.objects.filter(
            citizen=request.user, 
            complaint=complaint
            ).first()
        
        if upvote:
            upvote.delete()
            complaint.upvote_count -= 1
            complaint.save()
            return Response({ "message": "Upvote removed", "upvote_count": complaint.upvote_count }, status=status.HTTP_200_OK)

        ComplaintUpvote.objects.create(
            citizen=request.user,
            complaint=complaint
        ) 
        complaint.upvote_count += 1 
        complaint.save() 
        return Response({ "message": "Upvoted successfully", "upvote_count": complaint.upvote_count }, status=status.HTTP_201_CREATED)

class AdminComplaintListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = ComplaintListSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        qs = Complaint.objects.all().order_by('-created_at')

        status = self.request.query_params.get('status')
        category = self.request.query_params.get('category')
        duplicate = self.request.query_params.get('duplicate')

        if status:
            qs = qs.filter(status=status)
        if category:
            qs = qs.filter(category=category)
        if duplicate == 'true':
            qs = qs.filter(is_duplicate=True)

        return qs

class AdminComplaintDetailView(generics.RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = ComplaintDetailSerializer
    queryset = Complaint.objects.all()

class StatusUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    ALLOWED_TRANSITIONS = {
        'reported':    ['pending'],
        'pending':     ['verified'],
        'verified':    ['in_progress', 'rejected'],
        'in_progress': ['resolved', 'rejected'],
        'resolved':    [],
        'rejected':    [],
    }

    def patch(self, request, pk):
        complaint = get_object_or_404(Complaint, id=pk)
        previous_status = complaint.status
        new_status = request.data.get("new_status")
        remark = request.data.get("remark", "")

        if not new_status:
            return Response(
                {"error": "new_status is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        allowed = self.ALLOWED_TRANSITIONS.get(previous_status, [])
        if new_status not in allowed:
            return Response(
                {"error": f"Cannot transition from '{previous_status}' to '{new_status}'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        complaint.status = new_status
        complaint.save(update_fields=['status', 'updated_at'])

        StatusHistory.objects.create(
            complaint=complaint,
            previous_status=previous_status,
            new_status=new_status,
            changed_by=request.user,
            remark=remark
        )

        Notification.objects.create(
            recipient=complaint.citizen,
            complaint=complaint,
            event=Notification.Event.STATUS_UPDATED,
            message=f"Your complaint '{complaint.title}' has been {new_status.replace('_', ' ')}.",
            message_ne=f"तपाईंको उजुरी '{complaint.title}' को स्थिति {new_status} मा परिवर्तन भयो।"
        )

        if new_status in ['in_progress', 'resolved', 'rejected']:
            send_status_email(
                complaint.citizen.email,
                complaint.citizen.full_name,
                complaint.title,
                new_status
            )

        return Response({
            "message": f"Complaint status updated to {new_status}",
            "complaint_id": complaint.id,
            "previous_status": previous_status,
            "new_status": new_status
        }, status=status.HTTP_200_OK)

class HeatmapView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ComplaintHeatmapSerializer
    queryset = Complaint.objects.exclude(
        location_lat=None, 
        location_lng=None
    )

class AdminSummaryView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        total = Complaint.objects.count()
        duplicates = Complaint.objects.filter(is_duplicate=True).count()

        by_status = {
            item['status']: item['count']
            for item in Complaint.objects.values('status').annotate(count=Count('id'))
        }

        by_priority = {
            item['priority']: item['count']
            for item in Complaint.objects.values('priority').annotate(count=Count('id'))
        }

        by_category = {
            item['category']: item['count']
            for item in Complaint.objects.values('category').annotate(count=Count('id'))
        }

        return Response({
            "total": total,              
            "duplicates": duplicates,   
            "by_status": by_status,
            "by_priority": by_priority,
            "by_category": by_category,
        })

class AdminTrendsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        eight_weeks_ago = timezone.now() - timedelta(weeks=8)

        trends = (
            Complaint.objects.filter(created_at__gte=eight_weeks_ago)
            .annotate(week=TruncWeek('created_at'))
            .values('week')
            .annotate(count=Count('id'))
            .order_by('week')
        )

        data = [
            {
                "week": entry['week'].strftime('%Y-%m-%d'),
                "count": entry['count']
            }
            for entry in trends
        ]
        return Response(data)

class BulkStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        complaint_ids = request.data.get('complaint_ids', [])
        new_status = request.data.get('new_status')
        remark = request.data.get('remark', '')

        if not complaint_ids or not new_status:
            return Response(
                {"error": "complaint_ids and new_status are required"},
                status=400
            )

        complaints = Complaint.objects.filter(id__in=complaint_ids)
        updated = []

        for complaint in complaints:
            previous = complaint.status
            complaint.status = new_status
            complaint.save()

            StatusHistory.objects.create(
                complaint=complaint,
                previous_status=previous,
                new_status=new_status,
                changed_by=request.user,
                remark=remark
            )

            Notification.objects.create(
                recipient=complaint.citizen,
                complaint=complaint,
                event=Notification.Event.STATUS_UPDATED,
                message=f"Your complaint '{complaint.title}' has been {new_status.replace('_', ' ')}.",
                message_ne=f"तपाईंको उजुरी '{complaint.title}' को स्थिति {new_status} मा परिवर्तन भयो।"
            )


            if new_status in ['in_progress', 'resolved', 'rejected']:
                send_status_email(
                    complaint.citizen.email,
                    complaint.citizen.full_name,
                    complaint.title,
                    new_status
                )
            updated.append(complaint.id)

        return Response({
            "updated_ids": updated,
            "count": len(updated),
            "new_status": new_status
        })

class AdminUserListView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    queryset = CustomUser.objects.all().order_by('-date_joined')

class AdminUserUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, pk):
        user = get_object_or_404(CustomUser, pk=pk)
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

    def patch(self, request, pk):
        user = get_object_or_404(CustomUser, pk=pk)

        role = request.data.get("role")
        is_active = request.data.get("is_active")

        if role is None and is_active is None:
            return Response(
                {"detail": "Provide at least one field: role or is_active."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if role is not None:
            if role == 'admin' and not request.user.is_superuser:
                return Response(
                    {"detail": "Only superuser can promote users to admin."},
                    status=status.HTTP_403_FORBIDDEN
                )
            user.role = role

        if is_active is not None:
            user.is_active = is_active

        user.save()

        return Response(
            {
                "detail": "User updated successfully.",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "role": user.role,
                    "is_active": user.is_active,
                }
            },
            status=status.HTTP_200_OK
        )
    
    def delete(self, request, pk):
        user = get_object_or_404(CustomUser, pk=pk)
    
        if user.id == request.user.id:
            return Response(
                {"detail": "You cannot delete your own account."},
                status=status.HTTP_400_BAD_REQUEST
            )
    
        if user.role == 'admin':
            return Response(
                {"detail": "Cannot delete another admin."},
                status=status.HTTP_403_FORBIDDEN
            )
    
        user.delete()
        return Response({"detail": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class AdminUserComplaintsView(generics.ListAPIView):
    serializer_class = ComplaintListSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Complaint.objects.filter(citizen__id=user_id).order_by('-created_at')


