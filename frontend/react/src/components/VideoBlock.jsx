import { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack, HStack, Button, Spinner, Alert, AlertIcon, Image, Flex } from '@chakra-ui/react';
import { FiPlay, FiExternalLink } from 'react-icons/fi';
import api from '../utils/api';

const VideoBlock = ({ query }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (query) {
      fetchVideos();
    }
  }, [query]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get(`/youtube/?query=${encodeURIComponent(query)}`);
      const data = response.data;
      
      setVideos(data.videos || []);
      // Auto-select first video
      if (data.videos && data.videos.length > 0) {
        setSelectedVideo(data.videos[0]);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" py={8}>
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

  if (videos.length === 0) {
    return (
      <Box p={4} bg="gray.50" borderRadius="md">
        <Text color="gray.600">No videos found for "{query}"</Text>
      </Box>
    );
  }

  return (
    <Box my={6}>
      <Heading size="md" mb={4} color="gray.900">
        Related Videos
      </Heading>
      
      {selectedVideo && (
        <Box mb={4}>
          <Box
            position="relative"
            pb="56.25%" // 16:9 aspect ratio
            height="0"
            overflow="hidden"
            borderRadius="md"
            bg="gray.100"
          >
            <iframe
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              src={selectedVideo.embed_url}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
          
          <VStack align="start" mt={3} spacing={2}>
            <Text fontWeight="bold" fontSize="lg" color="gray.900">
              {selectedVideo.title}
            </Text>
            <Button
              as="a"
              href={selectedVideo.url}
              target="_blank"
              rel="noopener noreferrer"
              leftIcon={<FiExternalLink />}
              colorScheme="blue"
              variant="outline"
              size="sm"
            >
              Watch on YouTube
            </Button>
          </VStack>
        </Box>
      )}
      
      {videos.length > 1 && (
        <VStack spacing={3} align="stretch">
          <Text fontWeight="semibold" color="gray.700">
            More Videos:
          </Text>
          {videos.slice(1, 4).map((video) => (
            <Box
              key={video.id}
              p={3}
              borderWidth="1px"
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: 'gray.50' }}
              onClick={() => setSelectedVideo(video)}
              borderColor="gray.200"
            >
              <HStack spacing={3}>
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  boxSize="120px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <VStack align="start" spacing={1} flex="1">
                  <Text fontWeight="medium" fontSize="sm" noOfLines={2}>
                    {video.title}
                  </Text>
                  <Button
                    size="xs"
                    leftIcon={<FiPlay />}
                    colorScheme="blue"
                    variant="ghost"
                  >
                    Select Video
                  </Button>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default VideoBlock;


