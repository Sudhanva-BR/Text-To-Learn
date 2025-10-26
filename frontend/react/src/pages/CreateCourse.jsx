import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Radio,
  RadioGroup,
  Stack,
  Spinner,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { FiZap, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../utils/api';

const CreateCourse = () => {
  const [topic, setTopic] = useState('');
  const [generationType, setGenerationType] = useState('outline'); // 'outline' or 'full'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;
      
      if (generationType === 'outline') {
        // Generate course outline only (faster)
        response = await courseAPI.generateCourse(topic);
        toast({
          title: 'Course Generated!',
          description: 'Course outline created. Lesson content will be generated on-demand.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Generate full course with all lessons (slower)
        toast({
          title: 'Generating Full Course...',
          description: 'This may take 2-3 minutes. Please wait...',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
        
        response = await courseAPI.generateFullCourse(topic);
        
        toast({
          title: 'Full Course Generated!',
          description: 'All lessons have been created with content.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }

      // Navigate to the generated course
      const courseId = response.data.course.id;
      navigate(`/course/${courseId}`);
      
    } catch (err) {
      console.error('Error generating course:', err);
      setError(
        err.response?.data?.error || 
        'Failed to generate course. Please try again.'
      );
      
      toast({
        title: 'Generation Failed',
        description: 'There was an error generating your course.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="800px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="2xl" mb={2}>Create New Course</Heading>
          <Text fontSize="lg" color="gray.600">
            Enter a topic and let AI generate a comprehensive course for you
          </Text>
        </Box>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        )}

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    Course Topic
                  </FormLabel>
                  <Input
                    placeholder="e.g., Introduction to Machine Learning"
                    size="lg"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={loading}
                  />
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Be specific! Good examples: "Python for Beginners", "Web Development with React", "Digital Marketing Basics"
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="lg" fontWeight="semibold">
                    Generation Type
                  </FormLabel>
                  <RadioGroup 
                    value={generationType} 
                    onChange={setGenerationType}
                    isDisabled={loading}
                  >
                    <Stack spacing={4}>
                      <Card
                        variant="outline"
                        cursor="pointer"
                        onClick={() => setGenerationType('outline')}
                        bg={generationType === 'outline' ? 'blue.50' : 'white'}
                        borderColor={generationType === 'outline' ? 'blue.500' : 'gray.200'}
                        borderWidth={2}
                      >
                        <CardBody>
                          <Radio value="outline" size="lg" colorScheme="blue">
                            <VStack align="start" spacing={1} ml={2}>
                              <Text fontWeight="semibold" display="flex" alignItems="center">
                                <FiZap style={{ marginRight: '8px' }} />
                                Quick Outline (Recommended)
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                Generates course structure instantly. Lesson content created when you click on each lesson.
                              </Text>
                              <Text fontSize="xs" color="green.600" fontWeight="semibold">
                                ⚡ Fast (~30 seconds)
                              </Text>
                            </VStack>
                          </Radio>
                        </CardBody>
                      </Card>

                      <Card
                        variant="outline"
                        cursor="pointer"
                        onClick={() => setGenerationType('full')}
                        bg={generationType === 'full' ? 'blue.50' : 'white'}
                        borderColor={generationType === 'full' ? 'blue.500' : 'gray.200'}
                        borderWidth={2}
                      >
                        <CardBody>
                          <Radio value="full" size="lg" colorScheme="blue">
                            <VStack align="start" spacing={1} ml={2}>
                              <Text fontWeight="semibold" display="flex" alignItems="center">
                                <FiClock style={{ marginRight: '8px' }} />
                                Full Course
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                Generates complete course with all lesson content upfront. Ready to use immediately.
                              </Text>
                              <Text fontSize="xs" color="orange.600" fontWeight="semibold">
                                🕐 Slower (~2-3 minutes)
                              </Text>
                            </VStack>
                          </Radio>
                        </CardBody>
                      </Card>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  isLoading={loading}
                  loadingText={
                    generationType === 'full' 
                      ? 'Generating Full Course...' 
                      : 'Generating Outline...'
                  }
                  leftIcon={loading ? <Spinner size="sm" /> : <FiZap />}
                >
                  Generate Course
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>

        <Box bg="blue.50" p={4} borderRadius="md">
          <Text fontSize="sm" color="blue.800">
            <strong>💡 Tip:</strong> Start with "Quick Outline" for faster results. 
            You can generate individual lesson content as you need it!
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default CreateCourse;