from rest_framework import generics, status
from .models import Complaint, StatusHistory, ComplaintUpvote, ComplaintAssignment
from .serializers import ComplaintCreateSerializer, ComplaintListSerializer, ComplaintDetailSerializer, ComplaintHeatmapSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from django.db.models import Count


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
        return Response({
            "message": f"Complaint status updated to {new_status}",
            "complaint_id": complaint.id,
            "previous_status": previous_status,
            "new_status": new_status
        }, status=status.HTTP_200_OK)


class IsStaff(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'staff'

class StaffIssueListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsStaff]
    serializer_class = ComplaintListSerializer

    def get_queryset(self):
    return Complaint.objects.filter(assignment__staff=self.request.user)

class StaffStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsStaff]

    def patch(self, request, pk):
        complaint = get_object_or_404(Complaint, id=pk)
        
        if not hasattr(complaint, 'assignment') or complaint.assignment.staff != request.user:
            raise PermissionDenied("This complaint is not assigned to you.")
        
        previous_status = complaint.status
        new_status = request.data.get("new_status")

        complaint.status = new_status
        complaint.save()

        StatusHistory.objects.create(
            complaint=complaint,
            previous_status=previous_status,
            new_status=new_status,
            changed_by=request.user,
            remark=""
        )
        return Response({
            "message": f"Status updated to {new_status}",
            "complaint_id": complaint.id,
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
        complaints = Complaint.objects.all()
        summary = {
            "total": complaints.count(),
            "by_status": dict(
                complaints.values_list('status')
                .annotate(count=Count('id'))
                .values_list('status', 'count')
            ),
            "by_category": dict(
                complaints.values_list('category')
                .annotate(count=Count('id'))
                .values_list('category', 'count')
            ),
            "duplicates": complaints.filter(is_duplicate=True).count(),
        }
        return Response(summary)

class BulkUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

    def post(self, request):
        ids = request.data.get('ids', [])
        new_status = request.data.get('status')

        if not ids or not new_status:
            return Response(
                {"error": "ids and status are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        complaints = Complaint.objects.filter(id__in=ids)
        for complaint in complaints:
            previous_status = complaint.status
            complaint.status = new_status
            complaint.save()
            StatusHistory.objects.create(
                complaint=complaint,
                previous_status=previous_status,
                new_status=new_status,
                changed_by=request.user,
                remark="Bulk update"
            )

        return Response({"updated": complaints.count()})