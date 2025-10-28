from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from courses.views import (
    CourseViewSet, 
    ModuleViewSet, 
    LessonViewSet,
    generate_course,
    generate_lesson_content,
    generate_full_course,
    register_user,
    login_user,
    logout_user,
    youtube_search,
    generate_hinglish_audio
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
    
    # Authentication endpoints
    path('api/register/', register_user, name='register'),
    path('api/login/', login_user, name='login'),
    path('api/logout/', logout_user, name='logout'),
    
    # YouTube and TTS endpoints
    path('api/youtube/', youtube_search, name='youtube-search'),
    path('api/lessons/<int:lesson_id>/hinglish-audio/', generate_hinglish_audio, name='hinglish-audio'),
]