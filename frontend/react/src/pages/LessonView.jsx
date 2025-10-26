import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  Badge,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { FiArrowLeft, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { courseAPI } from '../utils/api';

const LessonView = () => {
  const { courseId, moduleIndex, lessonIndex } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourse();
  }, [courseId, moduleIndex, lessonIndex]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getCourse(courseId);
      setCourse(response.data);
      
      const module = response.data.modules[parseInt(moduleIndex)];
      const currentLesson = module.lessons[parseInt(lessonIndex)];
      setLesson(currentLesson);
      
      // If lesson doesn't have content, generate it
      if (!currentLesson.is_enriched) {
        generateLessonContent(currentLesson.id);
      }
    } catch (err) {
      console.error('Error fetching course:', err);
      setError('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const generateLessonContent = async (lessonId) => {
    try {
      setGenerating(true);
      const response = await courseAPI.generateLessonContent(lessonId);
      setLesson(response.data.lesson);
      
      toast({
        title: 'Content Generated!',
        description: 'Lesson content has been generated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error generating lesson content:', err);
      setError('Failed to generate lesson content');
      toast({
        title: 'Generation Failed',
        description: err.response?.data?.error || 'Failed to generate lesson content.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (lesson) {
      generateLessonContent(lesson.id);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (error || !course || !lesson) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error || 'Lesson not found'}
      </Alert>
    );
  }

  const module = course.modules[parseInt(moduleIndex)];

  const renderContent = (contentBlock) => {
    switch (contentBlock.type) {
      case 'heading':
        return (
          <Heading as="h3" size="md" mt={6} mb={3} color="gray.900">
            {contentBlock.text}
          </Heading>
        );
      case 'paragraph':
        return (
          <Text fontSize="md" color="gray.700" mb={4} lineHeight="1.8">
            {contentBlock.text}
          </Text>
        );
      case 'list':
        return (
          <Box as="ul" mb={4} ml={6}>
            {contentBlock.items?.map((item, index) => (
              <Text key={index} as="li" fontSize="md" color="gray.700" mb={2}>
                {item}
              </Text>
            ))}
          </Box>
        );
      case 'code':
        return (
          <Box
            as="pre"
            p={4}
            bg="gray.900"
            color="green.400"
            borderRadius="md"
            mb={4}
            overflowX="auto"
            fontFamily="mono"
          >
            <code>{contentBlock.code}</code>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box maxW="900px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Back Button */}
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          onClick={() => navigate(`/course/${courseId}`)}
          alignSelf="flex-start"
        >
          Back to Course
        </Button>

        {/* Lesson Header */}
        <Box>
          <Flex justify="space-between" align="start" mb={4}>
            <Box flex="1">
              <Text fontSize="sm" color="gray.600" mb={2}>
                {course.title} • {module.title}
              </Text>
              <Heading size="2xl" color="gray.900" mb={3}>
                {lesson.title}
              </Heading>
              {lesson.is_enriched && (
                <Badge colorScheme="green" fontSize="sm">
                  <FiCheckCircle style={{ display: 'inline', marginRight: '4px' }} />
                  Content Available
                </Badge>
              )}
            </Box>
            {lesson.is_enriched && (
              <Button
                leftIcon={<FiRefreshCw />}
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                isLoading={generating}
              >
                Regenerate
              </Button>
            )}
          </Flex>
        </Box>

        <Divider />

        {/* Objectives */}
        {lesson.objectives && lesson.objectives.length > 0 && (
          <Box>
            <Heading as="h3" size="md" mb={3} color="gray.900">
              Learning Objectives
            </Heading>
            <VStack align="stretch" spacing={2}>
              {lesson.objectives.map((objective, index) => (
                <Flex key={index} align="start">
                  <Text fontSize="lg" mr={2} color="blue.500">
                    ✓
                  </Text>
                  <Text fontSize="md" color="gray.700">
                    {objective}
                  </Text>
                </Flex>
              ))}
            </VStack>
          </Box>
        )}

        {/* Loading State for Generation */}
        {generating && (
          <Flex justify="center" align="center" py={8}>
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text color="gray.600">Generating lesson content...</Text>
            </VStack>
          </Flex>
        )}

        {/* Lesson Content */}
        {lesson.is_enriched && lesson.content && lesson.content.length > 0 ? (
          <Box>
            {lesson.content.map((block, index) => (
              <Box key={index}>{renderContent(block)}</Box>
            ))}
          </Box>
        ) : lesson.is_enriched ? (
          <Alert status="info">
            <AlertIcon />
            No content available for this lesson.
          </Alert>
        ) : null}
      </VStack>
    </Box>
  );
};

export default LessonView;
