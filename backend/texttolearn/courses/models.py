from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.db.models import JSONField
from django.contrib.auth.models import User

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='courses', null=True, blank=True)
    tags = models.JSONField(default=list, blank=True)  # Store as JSON array
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class Module(models.Model):
    title = models.CharField(max_length=255)
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE, 
        related_name='modules'
    )
    order = models.PositiveIntegerField(default=0)  # For ordering modules
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Lesson(models.Model):
    title = models.CharField(max_length=255)
    module = models.ForeignKey(
        Module, 
        on_delete=models.CASCADE, 
        related_name='lessons'
    )
    content = models.JSONField(default=list)  # Store structured content blocks
    objectives = models.JSONField(default=list, blank=True)  # Learning objectives
    is_enriched = models.BooleanField(default=False)  # Track if AI-enhanced
    order = models.PositiveIntegerField(default=0)  # For ordering lessons
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.module.title} - {self.title}"