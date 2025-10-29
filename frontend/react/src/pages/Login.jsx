import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text,
  Alert,
  AlertIcon,
  Flex,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FiLogIn, FiUser, FiLock, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <Box
      position="relative"
      minH="100vh"
      w="100vw"
      overflow="hidden"
      bgGradient="linear(to-br, #0f0c29, #302b63, #24243e)"
      p={0}
      m={0}
    >
      {/* Background Elements */}
      <Box
        position="absolute"
        top="10%"
        left="10%"
        w="400px"
        h="400px"
        bg="pink.500"
        borderRadius="full"
        filter="blur(120px)"
        opacity={0.3}
      />
      <Box
        position="absolute"
        bottom="10%"
        right="10%"
        w="500px"
        h="500px"
        bg="cyan.400"
        borderRadius="full"
        filter="blur(140px)"
        opacity={0.2}
      />
      <Box
        position="absolute"
        top="50%"
        left="30%"
        w="300px"
        h="300px"
        bg="purple.500"
        borderRadius="full"
        filter="blur(100px)"
        opacity={0.15}
      />

      {/* Grid Pattern Overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        backgroundImage="radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)"
        backgroundSize="50px 50px"
        opacity={0.1}
      />

      <Container maxW="md" centerContent minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          w="100%"
        >
          <Box
            bg="rgba(255, 255, 255, 0.05)"
            backdropFilter="blur(20px)"
            borderRadius="3xl"
            p={10}
            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            border="1px solid rgba(255,255,255,0.15)"
            position="relative"
            overflow="hidden"
          >
            {/* Card Background Effect */}
            <Box
              position="absolute"
              top={-100}
              right={-100}
              w="300px"
              h="300px"
              bgGradient="linear(to-br, #ff0080, #7928ca)"
              borderRadius="full"
              opacity={0.2}
              filter="blur(80px)"
            />
            
            <VStack spacing={8}>
              {/* Header */}
              <VStack spacing={4}>
                <Flex align="center" gap={3}>
                  <Box
                    p={3}
                    bgGradient="linear(to-r, #00c6ff, #0072ff)"
                    borderRadius="xl"
                    boxShadow="0 4px 15px rgba(0, 198, 255, 0.4)"
                  >
                    <Icon as={FiLogIn} color="white" boxSize={8} />
                  </Box>
                  <Heading size="xl" bgGradient="linear(to-r, #00c6ff, #0072ff)" bgClip="text" fontWeight="bold">
                    Welcome Back
                  </Heading>
                </Flex>

                <Text color="gray.300" fontSize="lg" textAlign="center">
                  Sign in to continue your learning journey
                </Text>
              </VStack>

              {/* Form */}
              <Box as="form" w="100%" onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  {error && (
                    <Alert status="error" borderRadius="xl" bg="red.500" color="white">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}

                  <FormControl isRequired>
                    <FormLabel color="gray.200" fontWeight="medium">Username</FormLabel>
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      bg="rgba(255,255,255,0.1)"
                      border="1px solid rgba(255,255,255,0.2)"
                      color="white"
                      _placeholder={{ color: 'gray.400' }}
                      _hover={{ borderColor: 'rgba(255,255,255,0.3)' }}
                      _focus={{ 
                        borderColor: '#00c6ff',
                        boxShadow: '0 0 0 1px #00c6ff',
                        bg: 'rgba(255,255,255,0.15)'
                      }}
                      size="lg"
                      py={6}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.200" fontWeight="medium">Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      bg="rgba(255,255,255,0.1)"
                      border="1px solid rgba(255,255,255,0.2)"
                      color="white"
                      _placeholder={{ color: 'gray.400' }}
                      _hover={{ borderColor: 'rgba(255,255,255,0.3)' }}
                      _focus={{ 
                        borderColor: '#00c6ff',
                        boxShadow: '0 0 0 1px #00c6ff',
                        bg: 'rgba(255,255,255,0.15)'
                      }}
                      size="lg"
                      py={6}
                    />
                  </FormControl>

                  <MotionButton
                    type="submit"
                    bgGradient="linear(to-r, #00c6ff, #0072ff)"
                    color="white"
                    width="full"
                    size="lg"
                    isLoading={loading}
                    loadingText="Signing in..."
                    _hover={{
                      bgGradient: "linear(to-r, #0072ff, #00c6ff)",
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 25px rgba(0, 114, 255, 0.4)'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    fontWeight="bold"
                    py={7}
                    fontSize="lg"
                  >
                    Sign In
                  </MotionButton>
                </VStack>
              </Box>

              {/* Footer */}
              <VStack spacing={4} w="100%">
                <HStack spacing={1} color="gray.400">
                  <Text fontSize="sm">New to Text to Learn?</Text>
                  <Link to="/register">
                    <Button
                      variant="link"
                      color="#00c6ff"
                      _hover={{ color: '#0072ff', textDecoration: 'none' }}
                      fontSize="sm"
                      fontWeight="bold"
                      rightIcon={<FiArrowRight />}
                    >
                      Create account
                    </Button>
                  </Link>
                </HStack>

                {/* Features */}
                <HStack spacing={6} pt={4} color="gray.400" fontSize="sm">
                  <HStack spacing={1}>
                    <Icon as={FiUser} />
                    <Text>Secure Login</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Icon as={FiLock} />
                    <Text>Data Protected</Text>
                  </HStack>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </MotionBox>
      </Container>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <MotionBox
          key={i}
          position="absolute"
          w="2px"
          h="2px"
          bg="white"
          borderRadius="full"
          opacity={0.6}
          left={`${Math.random() * 100}%`}
          top={`${Math.random() * 100}%`}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </Box>
  );
};

export default Login;