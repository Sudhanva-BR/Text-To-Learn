from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import transaction
from .models import Course, Module, Lesson
from .serializers import (
    CourseSerializer, 
    CourseListSerializer,
    ModuleSerializer, 
    LessonSerializer
)
from .services import ai_service


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    
    def get_queryset(self):
        """Filter courses to show only those created by the authenticated user"""
        user = self.request.user
        if user.is_authenticated:
            # If user is staff/admin, show all courses
            if user.is_staff:
                return Course.objects.all()
            # Otherwise, show only courses created by the user
            return Course.objects.filter(creator=user)
        # For unauthenticated users, return empty queryset
        return Course.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        return CourseSerializer
    
    def list(self, request):
        """Get all courses for the current user"""
        courses = self.get_queryset()
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Get single course with all modules and lessons"""
        try:
            course = Course.objects.prefetch_related(
                'modules__lessons'
            ).get(pk=pk)
            serializer = CourseSerializer(course)
            return Response(serializer.data)
        except Course.DoesNotExist:
            return Response(
                {'error': 'Course not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    def create(self, request):
        """Create a new course (will be used for saving generated courses)"""
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            if request.user.is_authenticated:
                serializer.save(creator=request.user)
            else:
                # For backwards compatibility, allow anonymous creation (not recommended)
                serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        """Delete a course"""
        try:
            course = Course.objects.get(pk=pk)
            course.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Course.DoesNotExist:
            return Response(
                {'error': 'Course not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class ModuleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer


class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer


@api_view(['POST'])
def generate_course(request):
    """
    Generate a complete course from a topic prompt
    POST /api/generate-course/
    Body: { "topic": "Introduction to Python" }
    """
    print(f"generate_course called with data: {request.data}")
    topic = request.data.get('topic', '').strip()
    
    if not topic:
        print("ERROR: Topic is empty")
        return Response(
            {'error': 'Topic is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    print(f"Processing topic: {topic}")
    
    try:
        # Generate course outline using AI
        print(f"Generating course for topic: {topic}")
        course_data = ai_service.generate_course_outline(topic)
        print(f"Course data generated: {course_data}")
        
        # Save to database
        with transaction.atomic():
            # Create course
            course = Course.objects.create(
                title=course_data['title'],
                description=course_data['description'],
                creator=request.user if request.user.is_authenticated else None,
                tags=course_data.get('tags', [])
            )
            
            # Create modules and lessons
            for module_index, module_data in enumerate(course_data['modules']):
                module = Module.objects.create(
                    title=module_data['title'],
                    course=course,
                    order=module_index
                )
                
                # Create lesson placeholders (content will be generated on-demand)
                for lesson_index, lesson_title in enumerate(module_data['lessons']):
                    Lesson.objects.create(
                        title=lesson_title,
                        module=module,
                        content=[],  # Empty for now
                        order=lesson_index,
                        is_enriched=False
                    )
        
        # Return the created course
        serializer = CourseSerializer(course)
        
        print("Course generated successfully")
        return Response({
            'message': 'Course generated successfully',
            'course': serializer.data
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"Error generating course: {str(e)}")
        import traceback
        print(traceback.format_exc())
        
        # Provide user-friendly error messages
        error_message = str(e)
        if 'insufficient_quota' in error_message or '429' in error_message:
            user_error = 'API quota exceeded. Please check your billing and add credits to your account.'
        elif 'API key' in error_message or 'not configured' in error_message:
            user_error = 'AI API key not configured. Please add your Gemini API key to the .env file.'
        elif 'quota' in error_message.lower():
            user_error = 'API quota exceeded. Please try again later or add more credits to your account.'
        else:
            user_error = 'Failed to generate course. Please try again later.'
        
        return Response(
            {'error': user_error}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def generate_lesson_content(request, lesson_id):
    """
    Generate detailed content for a specific lesson
    POST /api/lessons/<id>/generate-content/
    """
    try:
        lesson = Lesson.objects.select_related('module__course').get(pk=lesson_id)
        
        # Check if already enriched
        if lesson.is_enriched:
            return Response({
                'message': 'Lesson already has content',
                'lesson': LessonSerializer(lesson).data
            })
        
        # Generate lesson content using AI
        print(f"Generating content for lesson: {lesson.title}")
        lesson_data = ai_service.generate_lesson_content(
            course_title=lesson.module.course.title,
            module_title=lesson.module.title,
            lesson_title=lesson.title
        )
        
        # Update lesson with generated content
        lesson.content = lesson_data['content']
        lesson.objectives = lesson_data.get('objectives', [])
        lesson.is_enriched = True
        lesson.save()
        
        serializer = LessonSerializer(lesson)
        return Response({
            'message': 'Lesson content generated successfully',
            'lesson': serializer.data
        })
        
    except Lesson.DoesNotExist:
        return Response(
            {'error': 'Lesson not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Error generating lesson content: {str(e)}")
        import traceback
        print(traceback.format_exc())
        
        # Provide user-friendly error messages
        error_message = str(e)
        if 'insufficient_quota' in error_message or '429' in error_message:
            user_error = 'API quota exceeded. Please check your billing and add credits to your account.'
        elif 'API key' in error_message or 'not configured' in error_message:
            user_error = 'AI API key not configured. Please add your Gemini API key to the .env file.'
        elif 'quota' in error_message.lower():
            user_error = 'API quota exceeded. Please try again later or add more credits to your account.'
        else:
            user_error = 'Failed to generate lesson content. Please try again later.'
        
        return Response(
            {'error': user_error}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def generate_full_course(request):
    """
    Generate a complete course with ALL lesson content
    POST /api/generate-full-course/
    Body: { "topic": "Introduction to Python" }
    
    WARNING: This takes longer as it generates all lessons upfront
    """
    topic = request.data.get('topic', '').strip()
    
    if not topic:
        return Response(
            {'error': 'Topic is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Generate course outline
        print(f"Generating full course for topic: {topic}")
        course_data = ai_service.generate_course_outline(topic)
        
        with transaction.atomic():
            # Create course
            course = Course.objects.create(
                title=course_data['title'],
                description=course_data['description'],
                creator=request.user if request.user.is_authenticated else None,
                tags=course_data.get('tags', [])
            )
            
            # Create modules and generate all lesson content
            for module_index, module_data in enumerate(course_data['modules']):
                module = Module.objects.create(
                    title=module_data['title'],
                    course=course,
                    order=module_index
                )
                
                # Generate content for each lesson
                for lesson_index, lesson_title in enumerate(module_data['lessons']):
                    print(f"  Generating lesson: {lesson_title}")
                    
                    # Generate lesson content
                    lesson_data = ai_service.generate_lesson_content(
                        course_title=course.title,
                        module_title=module.title,
                        lesson_title=lesson_title
                    )
                    
                    # Create lesson with content
                    Lesson.objects.create(
                        title=lesson_title,
                        module=module,
                        content=lesson_data['content'],
                        objectives=lesson_data.get('objectives', []),
                        order=lesson_index,
                        is_enriched=True
                    )
        
        # Return the complete course
        serializer = CourseSerializer(course)
        
        return Response({
            'message': 'Full course generated successfully',
            'course': serializer.data
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"Error generating full course: {str(e)}")
        import traceback
        print(traceback.format_exc())
        
        # Provide user-friendly error messages
        error_message = str(e)
        if 'insufficient_quota' in error_message or '429' in error_message:
            user_error = 'API quota exceeded. Please check your billing and add credits to your account.'
        elif 'API key' in error_message or 'not configured' in error_message:
            user_error = 'AI API key not configured. Please add your Gemini API key to the .env file.'
        elif 'quota' in error_message.lower():
            user_error = 'API quota exceeded. Please try again later or add more credits to your account.'
        else:
            user_error = 'Failed to generate course. Please try again later.'
        
        return Response(
            {'error': user_error}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def register_user(request):
    """
    Register a new user
    POST /api/register/
    Body: { "username": "user", "password": "pass", "email": "email@example.com" }
    """
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '').strip()
    email = request.data.get('email', '').strip()
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email if email else ''
        )
        token = Token.objects.create(user=user)
        
        return Response({
            'message': 'User created successfully',
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to create user: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def login_user(request):
    """
    Login a user
    POST /api/login/
    Body: { "username": "user", "password": "pass" }
    """
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '').strip()
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'message': 'Login successful',
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response(
            {'error': 'Invalid username or password'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
def logout_user(request):
    """
    Logout a user
    POST /api/logout/
    """
    if request.user.is_authenticated:
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except:
            pass
    
    return Response({'message': 'Logged out'}, status=status.HTTP_200_OK)


@api_view(['GET'])
def youtube_search(request):
    """
    Search YouTube videos
    GET /api/youtube/?query=<search_query>
    """
    from django.conf import settings
    import requests
    
    query = request.GET.get('query', '')
    if not query:
        return Response(
            {'error': 'Query parameter is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    youtube_api_key = getattr(settings, 'YOUTUBE_API_KEY', '')
    if not youtube_api_key:
        return Response(
            {'error': 'YouTube API key not configured'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    try:
        # Search YouTube
        url = 'https://www.googleapis.com/youtube/v3/search'
        params = {
            'key': youtube_api_key,
            'q': query,
            'part': 'snippet',
            'type': 'video',
            'maxResults': 5
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        # Format results
        videos = []
        for item in data.get('items', []):
            video_id = item['id']['videoId']
            videos.append({
                'id': video_id,
                'title': item['snippet']['title'],
                'description': item['snippet']['description'],
                'thumbnail': item['snippet']['thumbnails']['medium']['url'],
                'url': f'https://www.youtube.com/watch?v={video_id}',
                'embed_url': f'https://www.youtube.com/embed/{video_id}'
            })
        
        return Response({
            'query': query,
            'videos': videos
        }, status=status.HTTP_200_OK)
        
    except requests.exceptions.RequestException as e:
        return Response(
            {'error': f'YouTube API error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return Response(
            {'error': f'Error searching YouTube: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def generate_hinglish_audio(request, lesson_id):
    """
    Generate Hinglish audio for a lesson
    GET /api/lessons/<lesson_id>/hinglish-audio/
    """
    from django.conf import settings
    import google.generativeai as genai
    import json
    
    try:
        lesson = Lesson.objects.select_related('module__course').get(pk=lesson_id)
    except Lesson.DoesNotExist:
        return Response(
            {'error': 'Lesson not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    gemini_api_key = getattr(settings, 'GEMINI_API_KEY', '')
    if not gemini_api_key:
        return Response(
            {'error': 'Gemini API key not configured'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    try:
        # Configure Gemini
        genai.configure(api_key=gemini_api_key)
        
        # Prepare lesson text
        lesson_text = ""
        for block in lesson.content:
            if block.get('type') == 'heading':
                lesson_text += f"\n{block.get('text', '')}\n"
            elif block.get('type') == 'paragraph':
                lesson_text += block.get('text', '') + "\n"
            elif block.get('type') == 'list':
                for item in block.get('items', []):
                    lesson_text += f"- {item}\n"
        
        # Translate to Hinglish using Gemini
        prompt = f"""Translate this educational content to Hinglish (a mix of Hindi and English). 
Keep technical terms in English, but make the explanations more natural in Hinglish.
Content:
{lesson_text}

Provide only the translated Hinglish text, no explanation."""
        
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        response = model.generate_content(prompt)
        hinglish_text = response.text
        
        # Use Gemini's text-to-speech capability
        # Note: Gemini doesn't have direct TTS, so we'll return the Hinglish text
        # Frontend can use browser TTS API or third-party service
        
        return Response({
            'lesson_id': lesson.id,
            'original_text': lesson_text[:500],  # First 500 chars
            'hinglish_text': hinglish_text,
            'audio_url': None  # Will be generated client-side
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Error generating audio: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

