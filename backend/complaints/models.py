from django.db import models
from django.conf import settings

class Complaint(models.Model):

    citizen = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        )
    duplicate_of = models.ForeignKey(
        'self',
        blank=True,
        null=True,
        on_delete=models.SET_NULL
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    language = models.CharField(
        max_length=2,
        default='en'
    )
    location_name = models.CharField(blank=True, max_length=255)
    location_lat = models.FloatField(
        null=True,
        blank=True
    )

    location_lng = models.FloatField(null=True, blank=True)

    class Category(models.TextChoices):
        WATER = 'water', 'Water'
        ROAD = 'road', 'Road'
        ELECTRICITY = 'electricity', 'Electricity'
        SANITATION = 'sanitation', 'Sanitation'
        PARK = 'park', 'Park'
        SAFETY = 'safety', 'Safety'
    
        OTHER = 'other', 'Other'

    class Priority(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'
        CRITICAL = 'critical', 'Critical'

    class Status(models.TextChoices):
        REPORTED = 'reported', 'Reported'
        PENDING = 'pending', 'Pending'
        VERIFIED = 'verified', 'Verified'
        IN_PROGRESS = 'in_progress', 'In Progress'
        RESOLVED = 'resolved', 'Resolved'
        REJECTED = 'rejected', 'Rejected'

    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.OTHER,
        db_index=True
    )

    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.LOW
    )

    status = models.CharField(
        max_length=12,
        choices=Status.choices,
        default=Status.REPORTED,
        db_index=True
    )

    ai_category = models.CharField(blank=True, max_length=20)
    ai_priority = models.CharField(blank=True, max_length=20)
    ai_confidence = models.FloatField(default=0.0)
    is_duplicate = models.BooleanField(default=False)
    similarity_score = models.FloatField(default=0.0)
    upvote_count = models.PositiveIntegerField(default=0)
    image = models.ImageField(
        upload_to = 'complaints/',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(
        null=True,
        blank=True
    )
     
    def __str__(self):
        return f"[{self.status}] {self.title}"



class ComplaintUpvote(models.Model):
    citizen = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
     
    class Meta:
        unique_together = ("citizen", "complaint")

    def __str__(self):
        return f"{self.citizen.email} upvoted Complaint #{self.complaint.id}"


class ComplaintAssignment(models.Model):

    complaint = models.OneToOneField(
        "Complaint",
        on_delete=models.CASCADE,
        related_name="assignment"
    )

    staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="assigned_complaints"
    )

    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="assignments"
    )

    assigned_at = models.DateTimeField(auto_now_add=True)

    remarks = models.TextField(blank=True)

    def __str__(self):
        return f"Complaint #{self.complaint.id} assigned to {self.staff}"


class StatusHistory(models.Model):

    complaint = models.ForeignKey(
        "Complaint",
        on_delete=models.CASCADE,
        related_name="status_history"
    )

    previous_status = models.CharField(
        max_length=15,
        blank=True
    )

    new_status = models.CharField(
        max_length=15
    )

    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="status_changes"
    )

    remark = models.TextField(blank=True)

    changed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Complaint #{self.complaint.id}: {self.previous_status} → {self.new_status}"