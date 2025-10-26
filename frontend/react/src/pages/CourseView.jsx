import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { FiArrowLeft, FiBook, FiCheckCircle } from 'react-icons/fi';
import { courseAPI } from '../utils/api';

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getCourse(courseId);
      setCourse(response.data);
    } catch (err) {
      console.error('Error fetching course:', err);
      setError('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (moduleIndex, lessonIndex) => {
    navigate(`/course/${courseId}/module/${moduleIndex}/lesson/${lessonIndex}`);
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (error || !course) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error || 'Course not found'}
      </Alert>
    );
  }

  return (
    <Box maxW="1000px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Back Button */}
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          onClick={() => navigate('/my-courses')}
          alignSelf="flex-start"
        >
          Back to Courses
        </Button>

        {/* Course Header */}
        <Box>
          <Heading size="2xl" mb={3} color="gray.900" fontWeight="bold">{course.title}</Heading>
          <Text fontSize="lg" color="gray.700" mb={4} fontWeight="500">
            {course.description}
          </Text>
          
          {/* Tags */}
          <HStack spacing={2} flexWrap="wrap">
            {course.tags?.map((tag, index) => (
              <Badge key={index} colorScheme="blue" fontSize="sm" px={3} py={1}>
                {tag}
              </Badge>
            ))}
          </HStack>
        </Box>

        {/* Course Stats */}
        <HStack spacing={8} p={4} bg="gray.50" borderRadius="md">
          <HStack>
            <FiBook color="gray.900" />
            <Text fontWeight="semibold" color="gray.900">
              {course.modules?.length || 0} Modules
            </Text>
          </HStack>
          <HStack>
            <FiCheckCircle color="gray.900" />
            <Text fontWeight="semibold" color="gray.900">
              {course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0} Lessons
            </Text>
          </HStack>
        </HStack>

        {/* Modules & Lessons */}
        <Box>
          <Heading size="lg" mb={4} color="gray.800" fontWeight="bold">Course Content</Heading>
          
          <Accordion allowMultiple defaultIndex={[0]}>
            {course.modules?.map((module, moduleIndex) => (
              <AccordionItem key={module.id} border="1px" borderColor="gray.200" borderRadius="md" mb={3}>
                <h2>
                  <AccordionButton _expanded={{ bg: 'blue.50', borderBottomWidth: '1px' }}>
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="bold" fontSize="lg" color="gray.900">
                        Module {moduleIndex + 1}: {module.title}
                      </Text>
                      <Text fontSize="sm" color="gray.700" fontWeight="500">
                        {module.lessons?.length || 0} lessons
                      </Text>
                    </Box>
                    <AccordionIcon color="gray.700" />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <VStack spacing={2} align="stretch">
                    {module.lessons?.map((lesson, lessonIndex) => (
                      <Button
                        key={lesson.id}
                        variant="ghost"
                        justifyContent="flex-start"
                        onClick={() => handleLessonClick(moduleIndex, lessonIndex)}
                        rightIcon={lesson.is_enriched ? <FiCheckCircle color="green" /> : null}
                        _hover={{ bg: 'blue.50' }}
                        color="black"
                        fontWeight="500"
                        textColor="black"
                        _active={{ bg: 'blue.100' }}
                      >
                        <Text textAlign="left" color="black" fontSize="md" fontWeight="500">
                          {lessonIndex + 1}. {lesson.title}
                        </Text>
                      </Button>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </VStack>
    </Box>
  );
};

export default CourseView;