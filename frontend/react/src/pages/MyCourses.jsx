import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  HStack,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { FiBook, FiPlus, FiEye, FiTrash2 } from 'react-icons/fi';
import { courseAPI } from '../utils/api';

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAllCourses();
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId, e) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await courseAPI.deleteCourse(courseId);
      setCourses(courses.filter(course => course.id !== courseId));
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('Failed to delete course');
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="2xl">My Courses</Heading>
            <Text fontSize="lg" color="gray.600" mt={2}>
              {courses.length} {courses.length === 1 ? 'course' : 'courses'} available
            </Text>
          </Box>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            size="lg"
            onClick={() => navigate('/create')}
          >
            Create New Course
          </Button>
        </Flex>

        {courses.length === 0 ? (
          <Card>
            <CardBody textAlign="center" py={12}>
              <FiBook size={64} style={{ margin: '0 auto', color: '#CBD5E0' }} />
              <Heading size="md" mt={4} mb={2}>No courses yet</Heading>
              <Text color="gray.600" mb={4}>
                Create your first AI-generated course to get started
              </Text>
              <Button
                leftIcon={<FiPlus />}
                colorScheme="blue"
                onClick={() => navigate('/create')}
              >
                Create Your First Course
              </Button>
            </CardBody>
          </Card>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {courses.map((course) => (
              <Card
                key={course.id}
                cursor="pointer"
                _hover={{ shadow: 'lg', transform: 'translateY(-4px)' }}
                transition="all 0.3s"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <Heading size="md" noOfLines={2}>
                      {course.title}
                    </Heading>
                    <Text color="gray.600" noOfLines={3} fontSize="sm">
                      {course.description}
                    </Text>
                    
                    {/* Tags */}
                    <HStack spacing={2} flexWrap="wrap">
                      {course.tags?.slice(0, 3).map((tag, index) => (
                        <Badge key={index} colorScheme="blue" fontSize="xs">
                          {tag}
                        </Badge>
                      ))}
                      {course.tags?.length > 3 && (
                        <Badge colorScheme="gray" fontSize="xs">
                          +{course.tags.length - 3}
                        </Badge>
                      )}
                    </HStack>

                    {/* Stats */}
                    <HStack spacing={4} fontSize="sm" color="gray.600">
                      <HStack>
                        <FiBook />
                        <Text>{course.module_count} modules</Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </CardBody>
                
                <CardFooter pt={0}>
                  <HStack spacing={2} w="full">
                    <Button
                      leftIcon={<FiEye />}
                      colorScheme="blue"
                      variant="solid"
                      size="sm"
                      flex={1}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course/${course.id}`);
                      }}
                    >
                      View Course
                    </Button>
                    <Button
                      leftIcon={<FiTrash2 />}
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteCourse(course.id, e)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

export default MyCourses;