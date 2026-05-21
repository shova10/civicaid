from .views import NotificationListView, MarkAsReadView, MarkAllAsReadView

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/read/', MarkAsReadView.as_view(), name='mark-as-read'),
    path('notifications/read-all/', MarkAllAsReadView.as_view(), name='mark-all-as-read'), 
]