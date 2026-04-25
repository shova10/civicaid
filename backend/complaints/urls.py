from django.urls import path
from .views import ComplaintListCreateView, ComplaintDetailView, UpvoteToggleView, AdminComplaintListView, StatusUpdateView, StaffIssueListView, StaffStatusUpdateView, HeatmapView, AdminSummaryView, BulkStatusUpdateView, AdminTrendsView

urlpatterns = [
    path('complaints/', ComplaintListCreateView.as_view(), name ='complaint-list'),
    path('complaints/<int:pk>/', ComplaintDetailView.as_view(), name='complaint-detail'),
    path('complaints/<int:pk>/upvote/', UpvoteToggleView.as_view(), name='upvote-toggle'),
    path('admin/complaints/', AdminComplaintListView.as_view(), name='admin-complaint-list'),
    path('admin/complaints/<int:pk>/status/', StatusUpdateView.as_view(), name='status-update'),
    path('staff/issues/', StaffIssueListView.as_view(), name='staff-issues'),
    path('staff/issues/<int:pk>/status/', StaffStatusUpdateView.as_view(), name='staff-status-update'),
    path('issues/heatmap/', HeatmapView.as_view(), name='heatmap'),
    path('admin/summary/', AdminSummaryView.as_view(), name='admin-summary'),
    path('admin/summary', AdminSummaryView.as_view(), name='admin-summary'),
    path('admin/trends/', AdminTrendsView.as_view(), name='admin-trends'),
    path('admin/issues/bulk-update/', BulkStatusUpdateView.as_view(), name='bulk-update'),
]
