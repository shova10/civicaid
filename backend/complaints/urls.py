from django.urls import path
from .views import ComplaintListCreateView, ComplaintDetailView, UpvoteToggleView, AdminComplaintListView, AdminComplaintDetailView, StatusUpdateView, HeatmapView, AdminSummaryView, BulkStatusUpdateView, AdminTrendsView, AdminUserListView,      AdminUserUpdateView, AdminUserComplaintsView

urlpatterns = [
    path('complaints/', ComplaintListCreateView.as_view(), name='complaint-list'),
    path('complaints/heatmap/', HeatmapView.as_view(), name='heatmap'),
    path('complaints/<int:pk>/', ComplaintDetailView.as_view(), name='complaint-detail'),
    path('complaints/<int:pk>/upvote/', UpvoteToggleView.as_view(), name='upvote-toggle'),
    path('admin/complaints/', AdminComplaintListView.as_view(), name='admin-complaint-list'),
    path('admin/complaints/bulk-update/', BulkStatusUpdateView.as_view(), name='bulk-update'),
    path('admin/complaints/<int:pk>/', AdminComplaintDetailView.as_view(), name='admin-complaint-detail'),  
    path('admin/complaints/<int:pk>/status/', StatusUpdateView.as_view(), name='status-update'),
    path('admin/summary/', AdminSummaryView.as_view(), name='admin-summary'),
    path('admin/trends/', AdminTrendsView.as_view(), name='admin-trends'),
    path('admin/users/', AdminUserListView.as_view(), name='admin-users'),
    path('admin/users/<int:pk>/', AdminUserUpdateView.as_view(), name='admin-user-update'),
    path('admin/users/<int:pk>/complaints/', AdminUserComplaintsView.as_view(), name='admin-user-complaints'),
]