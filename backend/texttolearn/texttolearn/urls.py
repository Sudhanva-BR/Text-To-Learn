from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from courses.views import (
    CourseViewSet, 
    ModuleViewSet, 
    LessonViewSet,
    generate_course,
    generate_lesson_content,
    generate_full_course
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'modules', ModuleViewSet, basename='module')
router.register(r'lessons', LessonViewSet, basename='lesson')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # AI generation endpoints
    path('api/generate-course/', generate_course, name='generate-course'),
    path('api/generate-full-course/', generate_full_course, name='generate-full-course'),
    path('api/lessons/<int:lesson_id>/generate-content/', generate_lesson_content, name='generate-lesson-content'),
]