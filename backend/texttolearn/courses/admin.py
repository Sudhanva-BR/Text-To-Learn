from django.contrib import admin
from .models import Course, Module, Lesson


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'creator', 'created_at']
    search_fields = ['title', 'description']
    list_filter = ['created_at']


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'created_at']
    list_filter = ['course']
    ordering = ['course', 'order']


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'module', 'order', 'is_enriched', 'created_at']
    list_filter = ['module__course', 'is_enriched']
    ordering = ['module', 'order']