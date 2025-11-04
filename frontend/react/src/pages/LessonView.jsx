import { useState, useEffect, useRef } from 'react';
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
import { FiArrowLeft, FiRefreshCw, FiCheckCircle, FiDownload, FiVolume2 } from 'react-icons/fi';
import { courseAPI } from '../utils/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import VideoBlock from '../components/VideoBlock';
import Quiz from '../components/Quiz';

const LessonView = () => {
  const { courseId, moduleIndex, lessonIndex } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const contentRef = useRef(null);
  
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [hinglishAudio, setHinglishAudio] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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

const handleGenerateHinglishAudio = async () => {
  if (!lesson) return;

  try {
    setLoadingAudio(true);

    const token = localStorage.getItem('auth_token');

    // ✅ Use environment variable or fallback to Render backend
    const BASE_URL =
      import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
      'https://text-to-learn-klnl.onrender.com/api';

    const response = await fetch(
      `${BASE_URL}/lessons/${lesson.id}/hinglish-audio/`,
      {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setHinglishAudio(data);
      toast({
        title: 'Hinglish Audio Generated!',
        description: 'Hinglish translation is ready. Use browser TTS to listen.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Generation Failed',
        description: data.error || 'Failed to generate Hinglish audio.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  } catch (err) {
    console.error('Error generating Hinglish audio:', err);
    toast({
      title: 'Network Error',
      description: 'Failed to connect to server.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } finally {
    setLoadingAudio(false);
  }
};


  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN'; // Hindi English
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: 'TTS Not Available',
        description: 'Your browser does not support text-to-speech.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!lesson || !lesson.is_enriched) {
      toast({
        title: 'No Content Available',
        description: 'Please wait for the lesson content to be generated.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setDownloading(true);
      
      // Show success toast
      toast({
        title: 'Generating PDF...',
        description: 'Please wait while we prepare your download.',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });

      // Generate PDF content
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add title
      pdf.setFontSize(18);
      pdf.text(lesson.title, 15, 20);
      
      // Add course and module info
      pdf.setFontSize(12);
      pdf.text(`${course.title} - ${course.modules[parseInt(moduleIndex)].title}`, 15, 30);
      
      // Add objectives if available
      if (lesson.objectives && lesson.objectives.length > 0) {
        pdf.setFontSize(14);
        pdf.text('Learning Objectives:', 15, 45);
        pdf.setFontSize(11);
        let yPos = 50;
        lesson.objectives.forEach((objective, index) => {
          pdf.text(`• ${objective}`, 20, yPos);
          yPos += 8;
          if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
          }
        });
        yPos += 5;
      }

      // Add content
      pdf.setFontSize(12);
      let yPos = 60;
      
      if (lesson.objectives && lesson.objectives.length > 0) {
        yPos = 80 + (lesson.objectives.length * 8);
      }

      lesson.content.forEach((block, index) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }

        switch (block.type) {
          case 'heading':
            pdf.setFontSize(14);
            pdf.text(block.text, 15, yPos);
            yPos += 10;
            break;
          case 'paragraph':
            pdf.setFontSize(11);
            const lines = pdf.splitTextToSize(block.text, 180);
            pdf.text(lines, 15, yPos);
            yPos += lines.length * 6;
            break;
          case 'list':
            pdf.setFontSize(11);
            block.items?.forEach((item) => {
              pdf.text(`• ${item}`, 20, yPos);
              yPos += 8;
              if (yPos > 270) {
                pdf.addPage();
                yPos = 20;
              }
            });
            yPos += 3;
            break;
          case 'code':
            pdf.setFontSize(9);
            const codeLines = pdf.splitTextToSize(block.code, 180);
            pdf.text(codeLines, 15, yPos);
            yPos += codeLines.length * 5;
            break;
        }
        yPos += 5;
      });

      // Save the PDF
      const filename = `${lesson.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      pdf.save(filename);

      toast({
        title: 'PDF Downloaded!',
        description: 'Your lesson has been downloaded as PDF.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast({
        title: 'Download Failed',
        description: 'Failed to generate PDF. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDownloading(false);
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
      case 'video':
        return (
          <VideoBlock key={`video-${contentBlock.query}`} query={contentBlock.query || contentBlock.query} />
        );
      case 'quiz':
        return (
          <Quiz key={`quiz-${contentBlock.questions?.length || 0}`} questions={contentBlock.questions || []} />
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
              <Flex gap={2}>
                <Button
                  leftIcon={<FiVolume2 />}
                  variant="solid"
                  colorScheme="purple"
                  size="sm"
                  onClick={handleGenerateHinglishAudio}
                  isLoading={loadingAudio}
                >
                  Generate Hinglish Audio
                </Button>
                <Button
                  leftIcon={<FiDownload />}
                  variant="solid"
                  colorScheme="blue"
                  size="sm"
                  onClick={handleDownloadPDF}
                  isLoading={downloading}
                >
                  Download PDF
                </Button>
                <Button
                  leftIcon={<FiRefreshCw />}
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  isLoading={generating}
                >
                  Regenerate
                </Button>
              </Flex>
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

        {/* Hinglish Audio Display */}
        {hinglishAudio && (
          <Box p={4} bg="purple.50" borderRadius="md" border="1px" borderColor="purple.200">
            <Heading size="md" mb={3} color="purple.700">Hinglish Translation</Heading>
            <Text mb={4} color="gray.700">{hinglishAudio.hinglish_text}</Text>
            <Flex gap={2}>
              <Button
                leftIcon={<FiVolume2 />}
                colorScheme="purple"
                onClick={() => speakText(hinglishAudio.hinglish_text)}
                isDisabled={isPlaying}
              >
                {isPlaying ? 'Playing...' : 'Listen to Hinglish'}
              </Button>
              {isPlaying && (
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={stopAudio}
                >
                  Stop Audio
                </Button>
              )}
            </Flex>
          </Box>
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