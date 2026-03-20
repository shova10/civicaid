from rest_framework import generics, status
from .models import Complaint, StatusHistory, ComplaintUpvote
from .serializers import ComplaintCreateSerializer, ComplaintListSerializer, ComplaintDetailSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied


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