from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
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
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        return CourseSerializer
    
    def list(self, request):
        """Get all courses"""
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
            serializer.save(creator='anonymous')  # We'll update this with Auth0 later
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
                creator='anonymous',  # Will be updated with Auth0 later
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
                creator='anonymous',
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