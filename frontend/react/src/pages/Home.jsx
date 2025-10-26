import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <Box>
      <VStack spacing={6} align="start">
        <Heading size="2xl">Welcome to Text to Learn</Heading>
        
        <Text fontSize="lg" color="gray.600">
          Transform any topic into a structured, comprehensive course with AI-powered content generation.
        </Text>
        
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          size="lg"
          onClick={() => navigate('/create')}
        >
          Create Your First Course
        </Button>
      </VStack>
    </Box>
  );
};

export default Home;