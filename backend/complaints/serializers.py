from rest_framework import serializers
from .models import Complaint, StatusHistory

class ComplaintCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['title', 'description', 'image', 'category', 'location_name', 'location_lat', 'location_lng', 'language']
        
class ComplaintListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['title', 'id', 'category', 'status', 'priority', 'created_at', 'upvote_count']

class StatusHistorySerializer(serializers.ModelSerializer):
    changed_by = serializers.StringRelatedField()
    class Meta:
        model = StatusHistory
        fields = ['previous_status', 'new_status', 'changed_by', 'changed_at', 'remark']

class ComplaintDetailSerializer(serializers.ModelSerializer):
    status_history = StatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Complaint
        fields = ['id', 'title', 'description', 'image', 'category', 'priority', 'status',  'location_name', 'location_lat', 'location_lng', 'language', 'ai_category', 'ai_priority', 'ai_confidence', 'is_duplicate', 'upvote_count', 'created_at', 'updated_at', 'resolved_at', 'status_history']


class ComplaintHeatmapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['id','title', 'category', 'priority', 'status', 'location_lat', 'location_lng', 'location_name']