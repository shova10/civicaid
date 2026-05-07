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
from django.conf import settings
from django.core.mail import send_mail
from accounts.serializers import UserProfileSerializer
from accounts.models import CustomUser


class IsAdminOrStaff(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['admin', 'staff']

class ComplaintListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ComplaintCreateSerializer
        return ComplaintListSerializer

    def get_queryset(self):
        return Complaint.objects.filter(citizen=self.request.user)

    def create(self, request, *args, **kwargs):       
        print("DATA:", request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("ERRORS:", serializer.errors)
            return Response(serializer.errors, status=400)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)

    def perform_create(self, serializer):
        complaint = serializer.save(citizen=self.request.user)
        try:
            from ai_engine.pipeline import analyze
            analyze(complaint)
        except Exception as e:
            print(f"AI pipeline error: {e}")

class ComplaintDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ComplaintDetailSerializer

    def get_object(self):
        complaint_id = self.kwargs['pk']
        complaint = get_object_or_404(Complaint, id=complaint_id)

        if complaint.citizen != self.request.user:
            raise PermissionDenied("You cannot access this complaint.")

        return complaint

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
    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    serializer_class = ComplaintListSerializer
    queryset = Complaint.objects.all()

class StatusUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

    def patch(self, request, pk):
        complaint = get_object_or_404(Complaint, id=pk)
        previous_status = complaint.status
        new_status = request.data.get("new_status")
        remark = request.data.get("remark", "")

        complaint.status = new_status
        complaint.save()


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
            event='status_changed',
            message=f"Your complaint '{complaint.title}' has been {new_status.replace('_', ' ')}.",
            message_ne=f"तपाईंको उजुरी '{complaint.title}' को स्थिति {new_status} मा परिवर्तन भयो।"
        )

        if new_status in ['in_progress', 'resolved', 'rejected']:
            send_mail(
                subject="CivicAid - Your Complaint Status Updated",
                message=f"Dear {complaint.citizen.full_name}, your complaint '{complaint.title}' has been updated to {new_status}.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[complaint.citizen.email]
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
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

    def get(self, request):
        total = Complaint.objects.count()

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
            "total_complaints": total,
            "by_status": by_status,
            "by_priority": by_priority,
            "by_category": by_category,
        })


class AdminTrendsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

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
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

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
                event='status_changed',
                message=f"Your complaint '{complaint.title}' has been {new_status.replace('_', ' ')}.",
                message_ne=f"तपाईंको उजुरी '{complaint.title}' को स्थिति {new_status} मा परिवर्तन भयो।"
            )

            

            if new_status in ['in_progress', 'resolved', 'rejected']:
                send_mail(
                    subject="CivicAid - Your Complaint Status Updated",
                    message=f"Dear {complaint.citizen.full_name}, your complaint '{complaint.title}' has been updated to {new_status}.",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[complaint.citizen.email]
                )
            updated.append(complaint.id)


        return Response({
            "updated_ids": updated,
            "count": len(updated),
            "new_status": new_status
        })


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'admin'

class AdminUserListView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    queryset = CustomUser.objects.all().order_by('-date_joined')

class AdminUserUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

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
