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
  useColorModeValue,
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

  // Stronger contrast colors for dark mode
  const bgColor = useColorModeValue('gray.50', '#1A202C');
  const cardBg = useColorModeValue('white', '#2D3748');
  const textColor = useColorModeValue('gray.900', 'white');
  const subTextColor = useColorModeValue('gray.700', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('blue.50', '#2B6CB0');
  const activeBg = useColorModeValue('blue.100', '#2C5282');

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
        <Spinner size="xl" color="blue.400" />
      </Flex>
    );
  }

  if (error || !course) {
    return (
      <Alert status="error" bg={useColorModeValue('red.50', '#742A2A')} color={textColor}>
        <AlertIcon />
        {error || 'Course not found'}
      </Alert>
    );
  }

  return (
    <Box maxW="1000px" mx="auto" bg={bgColor} p={4} borderRadius="md">
      <VStack spacing={6} align="stretch">
        {/* Back Button */}
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          onClick={() => navigate('/my-courses')}
          alignSelf="flex-start"
          color={textColor}
          _hover={{ bg: hoverBg }}
        >
          Back to Courses
        </Button>

        {/* Course Header */}
        <Box bg={cardBg} p={5} borderRadius="md" boxShadow="md">
          <Heading size="2xl" mb={3} color={textColor} fontWeight="bold">
            {course.title}
          </Heading>
          <Text fontSize="lg" color={subTextColor} mb={4} fontWeight="500">
            {course.description}
          </Text>
          
          {/* Tags */}
          <HStack spacing={2} flexWrap="wrap">
            {course.tags?.map((tag, index) => (
              <Badge
                key={index}
                colorScheme="blue"
                fontSize="sm"
                px={3}
                py={1}
                bg={useColorModeValue('blue.100', '#2A4365')}
                color={useColorModeValue('blue.800', 'white')}
              >
                {tag}
              </Badge>
            ))}
          </HStack>
        </Box>

        {/* Course Stats */}
        <HStack spacing={8} p={4} bg={cardBg} borderRadius="md" boxShadow="sm">
          <HStack>
            <FiBook color={useColorModeValue('black', 'white')} />
            <Text fontWeight="semibold" color={textColor}>
              {course.modules?.length || 0} Modules
            </Text>
          </HStack>
          <HStack>
            <FiCheckCircle color={useColorModeValue('black', 'white')} />
            <Text fontWeight="semibold" color={textColor}>
              {course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0} Lessons
            </Text>
          </HStack>
        </HStack>

        {/* Modules & Lessons */}
        <Box bg={cardBg} p={4} borderRadius="md" boxShadow="md">
          <Heading size="lg" mb={4} color={textColor} fontWeight="bold">
            Course Content
          </Heading>
          
          <Accordion allowMultiple defaultIndex={[0]}>
            {course.modules?.map((module, moduleIndex) => (
              <AccordionItem
                key={module.id}
                border="1px"
                borderColor={borderColor}
                borderRadius="md"
                mb={3}
              >
                <h2>
                  <AccordionButton _expanded={{ bg: hoverBg, borderBottomWidth: '1px' }}>
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="bold" fontSize="lg" color={textColor}>
                        Module {moduleIndex + 1}: {module.title}
                      </Text>
                      <Text fontSize="sm" color={subTextColor} fontWeight="500">
                        {module.lessons?.length || 0} lessons
                      </Text>
                    </Box>
                    <AccordionIcon color={subTextColor} />
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
                        rightIcon={
                          lesson.is_enriched ? <FiCheckCircle color="green" /> : null
                        }
                        _hover={{ bg: hoverBg }}
                        _active={{ bg: activeBg }}
                        color={textColor}
                        fontWeight="500"
                      >
                        <Text
                          textAlign="left"
                          color={textColor}
                          fontSize="md"
                          fontWeight="500"
                        >
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
