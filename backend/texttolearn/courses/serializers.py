from rest_framework import serializers
from .models import Course, Module, Lesson


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'objectives', 'is_enriched', 'order', 'created_at']


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    
    class Meta:
        model = Module
        fields = ['id', 'title', 'order', 'lessons', 'created_at']


class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'creator', 'tags', 'modules', 'created_at', 'updated_at']


class CourseListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for course listing without nested data"""
    module_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'tags', 'module_count', 'created_at']
    
    def get_module_count(self, obj):
        return obj.modules.count()