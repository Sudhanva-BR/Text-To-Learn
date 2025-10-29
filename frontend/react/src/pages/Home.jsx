import { Box, Heading, Text, Button, VStack, Flex, Icon, HStack, Container, Grid, GridItem, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiBook, FiUsers, FiStar, FiArrowRight, FiClock, FiAward, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // Light mode colors - Soft, professional gradient
  const bgGradient = useColorModeValue(
    "linear(to-br, #f8fafc, #e2e8f0, #cbd5e0)",
    "linear(to-br, #0f0c29, #302b63, #24243e)"
  );
  
  const primaryGradient = useColorModeValue(
    "linear(to-r, #4f46e5, #7c3aed, #9333ea)",
    "linear(to-r, #ff0080, #7928ca, #0072ff)"
  );
  
  const secondaryGradient = useColorModeValue(
    "linear(to-r, #06b6d4, #3b82f6)",
    "linear(to-r, #00c6ff, #0072ff)"
  );

  const cardBg = useColorModeValue(
    "rgba(255, 255, 255, 0.9)",
    "rgba(255, 255, 255, 0.05)"
  );

  const cardBorder = useColorModeValue(
    "rgba(255, 255, 255, 0.8)",
    "rgba(255,255,255,0.15)"
  );

  const textColor = useColorModeValue("gray.700", "gray.200");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: FiBook, text: "AI-Powered Content", color: "blue.500", desc: "Generate courses with advanced AI algorithms" },
    { icon: FiUsers, text: "Personalized Learning", color: "green.500", desc: "Tailored content for your learning style" },
    { icon: FiStar, text: "Expert Quality", color: "yellow.500", desc: "Professional-grade course material" },
    { icon: FiClock, text: "Save Time", color: "purple.500", desc: "Create courses in minutes, not hours" }
  ];

  const stats = [
    { icon: FiBook, value: "10K+", label: "Courses Generated" },
    { icon: FiUsers, value: "50K+", label: "Active Learners" },
    { icon: FiAward, value: "98%", label: "Success Rate" },
    { icon: FiTrendingUp, value: "4.9/5", label: "User Rating" }
  ];

  return (
    <Flex
      justify="center"
      align="center"
      minH="100vh"
      bgGradient={bgGradient}
      className="relative overflow-hidden"
      position="relative"
    >
      {/* Enhanced Background Elements */}
      <Box className="absolute inset-0 overflow-hidden">
        {/* Light mode background elements */}
        <Box
          display={useColorModeValue("block", "none")}
          position="absolute"
          top="10%"
          left="10%"
          w="400px"
          h="400px"
          bg="blue.100"
          borderRadius="full"
          filter="blur(80px)"
          opacity={0.4}
        />
        <Box
          display={useColorModeValue("block", "none")}
          position="absolute"
          bottom="10%"
          right="10%"
          w="500px"
          h="500px"
          bg="purple.100"
          borderRadius="full"
          filter="blur(100px)"
          opacity={0.3}
        />
        
        {/* Dark mode background elements */}
        <Box
          display={useColorModeValue("none", "block")}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
        />
        <Box
          display={useColorModeValue("none", "block")}
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
        />
        <Box
          display={useColorModeValue("none", "block")}
          className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
        />
      </Box>

      <Container maxW="container.xl" centerContent>
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          justify="space-between"
          w="full"
          gap={12}
        >
          {/* Left Content */}
          <MotionBox
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            flex={1}
            maxW="lg"
          >
            <VStack spacing={8} align="start">
              {/* Main Heading */}
              <VStack spacing={6} align="start">
                <MotionBox
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <Heading
                    size="3xl"
                    bgGradient={primaryGradient}
                    bgClip="text"
                    fontWeight="black"
                    lineHeight="1.1"
                  >
                    Transform Any Topic Into A
                    <Text as="span" display="block" bgGradient={secondaryGradient} bgClip="text">
                      Master Course
                    </Text>
                  </Heading>
                </MotionBox>

                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Text fontSize="xl" color={textColor} lineHeight="1.6" fontWeight="500">
                    Turn your ideas into comprehensive, structured learning experiences with our advanced AI course generator. Perfect for educators, creators, and lifelong learners.
                  </Text>
                </MotionBox>
              </VStack>

              {/* Features Grid */}
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} w="full">
                {features.map((feature, index) => (
                  <MotionBox
                    key={feature.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  >
                    <HStack
                      spacing={4}
                      bg={useColorModeValue("white", "whiteAlpha.100")}
                      backdropFilter="blur(20px)"
                      p={5}
                      borderRadius="2xl"
                      border="1px solid"
                      borderColor={useColorModeValue("gray.100", "rgba(255,255,255,0.1)")}
                      boxShadow={useColorModeValue(
                        "0 4px 20px rgba(0, 0, 0, 0.08)",
                        "none"
                      )}
                      _hover={{
                        transform: "translateY(-4px)",
                        boxShadow: useColorModeValue(
                          "0 12px 40px rgba(0, 0, 0, 0.12)",
                          "0 12px 40px rgba(0, 0, 0, 0.3)"
                        ),
                        borderColor: useColorModeValue("gray.200", "rgba(255,255,255,0.2)")
                      }}
                      transition="all 0.3s ease"
                      h="100%"
                    >
                      <Icon as={feature.icon} color={feature.color} boxSize={6} />
                      <VStack spacing={1} align="start">
                        <Text 
                          color={useColorModeValue("gray.800", "white")} 
                          fontWeight="bold" 
                          fontSize="lg"
                        >
                          {feature.text}
                        </Text>
                        <Text color={secondaryTextColor} fontSize="sm">
                          {feature.desc}
                        </Text>
                      </VStack>
                    </HStack>
                  </MotionBox>
                ))}
              </Grid>

              {/* CTA Buttons */}
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                w="full"
              >
                <HStack spacing={6} pt={4}>
                  <MotionButton
                    leftIcon={<FiPlus />}
                    bgGradient={secondaryGradient}
                    color="white"
                    size="lg"
                    onClick={() => navigate('/create')}
                    _hover={{
                      bgGradient: useColorModeValue(
                        "linear(to-r, #3b82f6, #06b6d4)",
                        "linear(to-r, #0072ff, #00c6ff)"
                      ),
                      transform: 'translateY(-3px)',
                      boxShadow: useColorModeValue(
                        '0 15px 30px rgba(59, 130, 246, 0.4)',
                        '0 15px 30px rgba(0, 114, 255, 0.4)'
                      )
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    fontWeight="bold"
                    px={10}
                    py={7}
                    fontSize="lg"
                  >
                    Create Your Course
                  </MotionButton>

                  <Button
                    variant="outline"
                    color={useColorModeValue("gray.700", "white")}
                    borderColor={useColorModeValue("gray.300", "whiteAlpha.400")}
                    size="lg"
                    _hover={{
                      bg: useColorModeValue("gray.50", "whiteAlpha.100"),
                      borderColor: useColorModeValue("gray.400", "whiteAlpha.600"),
                      transform: 'translateY(-3px)',
                      boxShadow: useColorModeValue(
                        '0 8px 20px rgba(0, 0, 0, 0.1)',
                        'none'
                      )
                    }}
                    rightIcon={<FiArrowRight />}
                    px={10}
                    py={7}
                    fontSize="lg"
                    fontWeight="600"
                  >
                    Learn More
                  </Button>
                </HStack>
              </MotionBox>

              {/* Stats */}
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                w="full"
              >
                <Grid templateColumns="repeat(4, 1fr)" gap={6} pt={8}>
                  {stats.map((stat, index) => (
                    <MotionBox
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                    >
                      <VStack spacing={2}>
                        <Icon as={stat.icon} color={useColorModeValue("blue.500", "cyan.400")} boxSize={6} />
                        <Text fontSize="2xl" fontWeight="black" color={useColorModeValue("gray.800", "white")}>
                          {stat.value}
                        </Text>
                        <Text fontSize="sm" color={secondaryTextColor} textAlign="center" fontWeight="medium">
                          {stat.label}
                        </Text>
                      </VStack>
                    </MotionBox>
                  ))}
                </Grid>
              </MotionBox>
            </VStack>
          </MotionBox>

          {/* Right Card */}
          <MotionBox
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            flex={1}
            display="flex"
            justify="center"
          >
            <MotionBox
              whileHover={{ 
                scale: 1.02,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Box
                bg={cardBg}
                backdropFilter="blur(20px)"
                borderRadius="3xl"
                p={10}
                maxW="md"
                boxShadow={useColorModeValue(
                  "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 40px rgba(79, 70, 229, 0.1)",
                  "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                )}
                border="1px solid"
                borderColor={cardBorder}
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
                  bgGradient={useColorModeValue(
                    "linear(to-br, #4f46e5, #7c3aed)",
                    "linear(to-br, #ff0080, #7928ca)"
                  )}
                  borderRadius="full"
                  opacity={useColorModeValue(0.1, 0.3)}
                  filter="blur(80px)"
                />
                
                <VStack spacing={8} align="start">
                  <Box
                    bg={useColorModeValue("blue.50", "whiteAlpha.200")}
                    px={5}
                    py={3}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={useColorModeValue("blue.100", "rgba(255,255,255,0.1)")}
                  >
                    <Text 
                      fontSize="lg" 
                      color={useColorModeValue("blue.700", "whiteAlpha.900")} 
                      fontWeight="bold"
                    >
                      🎯 Quick Start
                    </Text>
                  </Box>

                  <VStack spacing={6} align="start">
                    <Heading size="xl" color={useColorModeValue("gray.800", "white")} fontWeight="bold" lineHeight="1.2">
                      Ready to Create Your First AI Course?
                    </Heading>
                    <Text color={useColorModeValue("gray.600", "gray.300")} fontSize="lg" lineHeight="1.6">
                      Start generating your custom AI course in seconds. Just provide a topic and let our advanced AI handle the rest - from curriculum design to content creation.
                    </Text>
                  </VStack>

                  <Box w="full" pt={4}>
                    <Button
                      leftIcon={<FiPlus />}
                      bg={useColorModeValue("white", "whiteAlpha.200")}
                      color={useColorModeValue("gray.800", "white")}
                      size="lg"
                      w="full"
                      onClick={() => navigate('/create')}
                      _hover={{
                        bg: useColorModeValue("gray.50", "whiteAlpha.300"),
                        transform: 'translateY(-3px)',
                        boxShadow: useColorModeValue(
                          '0 10px 25px rgba(0, 0, 0, 0.1)',
                          '0 10px 25px rgba(255,255,255,0.2)'
                        )
                      }}
                      border="1px solid"
                      borderColor={useColorModeValue("gray.200", "rgba(255,255,255,0.2)")}
                      py={8}
                      fontSize="lg"
                      fontWeight="600"
                    >
                      Get Started Now
                    </Button>
                  </Box>
                </VStack>
              </Box>
            </MotionBox>
          </MotionBox>
        </Flex>
      </Container>

      {/* Floating particles - Only in dark mode */}
      {useColorModeValue(null, [...Array(5)].map((_, i) => (
        <MotionBox
          key={i}
          className={`absolute w-2 h-2 bg-white rounded-full opacity-60`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
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
      )))}
    </Flex>
  );
};

export default Home;