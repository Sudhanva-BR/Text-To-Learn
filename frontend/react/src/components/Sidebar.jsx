import { Box, VStack, Link, Icon, Text, Flex, HStack, Badge, useColorModeValue, Progress } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiPlus, FiAward, FiTrendingUp, FiClock, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionLink = motion(Link);

const Sidebar = () => {
  const location = useLocation();

  // Color values for light/dark mode - Using home.jsx background in dark mode
  const bgColor = useColorModeValue(
    "rgba(255, 255, 255, 0.9)",
    "rgba(15, 12, 41, 0.9)" // Same as home.jsx dark mode background
  );
  
  const bgGradient = useColorModeValue(
    "none",
    "linear(to-br, #0f0c29, #302b63, #24243e)" // Same gradient as home.jsx
  );
  
  const borderColor = useColorModeValue(
    "rgba(0, 0, 0, 0.1)",
    "rgba(255, 255, 255, 0.1)"
  );
  const textColor = useColorModeValue("gray.800", "white");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.300");
  const hoverBg = useColorModeValue("gray.100", "rgba(255,255,255,0.1)");
  const activeBg = useColorModeValue("gray.200", "rgba(255,255,255,0.2)");

  const navItems = [
    { name: 'Home', icon: FiHome, path: '/', badge: null },
    { name: 'My Courses', icon: FiBook, path: '/my-courses', badge: null },
    { name: 'Create Course', icon: FiPlus, path: '/create', badge: 'NEW' },
  ];

  const quickStats = [
    { icon: FiBook, label: 'Active Courses', value: '3', color: 'blue.400' },
    { icon: FiClock, label: 'Learning Hours', value: '24h', color: 'green.400' },
    { icon: FiAward, label: 'Achievements', value: '8', color: 'yellow.400' },
  ];

  return (
    <MotionBox
      w="280px"
      bg={bgColor}
      bgGradient={bgGradient}
      backdropFilter="blur(20px)"
      color={textColor}
      p={6}
      borderRight="1px solid"
      borderColor={borderColor}
      boxShadow="2xl"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      position="relative"
      overflow="hidden"
    >
      {/* Background Effects */}
      <Box
        position="absolute"
        top={-100}
        left={-100}
        w="300px"
        h="300px"
        bgGradient={useColorModeValue(
          "linear(to-br, #667eea, #764ba2)",
          "linear(to-br, #ff0080, #7928ca)"
        )}
        borderRadius="full"
        opacity={0.1}
        filter="blur(64px)"
      />
      <Box
        position="absolute"
        bottom={-100}
        right={-100}
        w="250px"
        h="250px"
        bgGradient={useColorModeValue(
          "linear(to-tr, #4299E1, #3182CE)",
          "linear(to-tr, #0072ff, #00c6ff)"
        )}
        borderRadius="full"
        opacity={0.1}
        filter="blur(64px)"
      />

      {/* Brand Logo */}
      <Flex align="center" mb={8} position="relative">
        <HStack spacing={3}>
          <Box
            p={2}
            bgGradient={useColorModeValue(
              "linear(to-r, #667eea, #764ba2)",
              "linear(to-r, #ff0080, #7928ca)"
            )}
            borderRadius="lg"
            boxShadow={useColorModeValue(
              "0 4px 15px rgba(102, 126, 234, 0.4)",
              "0 4px 15px rgba(255, 0, 128, 0.3)"
            )}
          >
            <Icon as={FiBook} boxSize={5} color="white" />
          </Box>
          <VStack spacing={0} align="start">
            <Text 
              fontSize="xl" 
              fontWeight="black" 
              bgGradient={useColorModeValue(
                "linear(to-r, #667eea, #3182CE)",
                "linear(to-r, #ff0080, #0072ff)"
              )} 
              bgClip="text"
            >
              Text to Learn
            </Text>
            <Text fontSize="xs" color={secondaryTextColor} fontWeight="medium">
              AI Course Generator
            </Text>
          </VStack>
        </HStack>
      </Flex>

      {/* Navigation Items */}
      <VStack align="stretch" spacing={2} mb={8}>
        {navItems.map((item, index) => (
          <MotionLink
            key={item.path}
            as={RouterLink}
            to={item.path}
            _hover={{ textDecoration: 'none' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Flex
              align="center"
              p={3}
              borderRadius="xl"
              bg={location.pathname === item.path ? activeBg : 'transparent'}
              border="1px solid"
              borderColor={location.pathname === item.path ? borderColor : 'transparent'}
              backdropFilter="blur(10px)"
              _hover={{
                bg: hoverBg,
                borderColor: borderColor,
                transform: 'translateX(8px)',
              }}
              className="transition-all duration-300"
              position="relative"
              overflow="hidden"
            >
              {/* Active indicator */}
              {location.pathname === item.path && (
                <Box
                  position="absolute"
                  left={0}
                  top={0}
                  bottom={0}
                  w="4px"
                  bgGradient={useColorModeValue(
                    "linear(to-b, #667eea, #3182CE)",
                    "linear(to-b, #ff0080, #0072ff)"
                  )}
                  borderRadius="full"
                />
              )}

              <Icon 
                as={item.icon} 
                mr={3} 
                boxSize={5}
                color={location.pathname === item.path ? 'cyan.500' : secondaryTextColor}
              />
              <Text 
                fontWeight="medium" 
                color={location.pathname === item.path ? textColor : secondaryTextColor}
                flex={1}
              >
                {item.name}
              </Text>
              
              {item.badge && (
                <Badge
                  bgGradient={useColorModeValue(
                    item.badge === 'NEW' ? "linear(to-r, #667eea, #764ba2)" : "linear(to-r, #4299E1, #3182CE)",
                    item.badge === 'NEW' ? "linear(to-r, #ff0080, #7928ca)" : "linear(to-r, #00c6ff, #0072ff)"
                  )}
                  color="white"
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="full"
                  fontWeight="bold"
                >
                  {item.badge}
                </Badge>
              )}
            </Flex>
          </MotionLink>
        ))}
      </VStack>

      {/* User Progress Section */}
      <MotionBox
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Box
          bg={useColorModeValue("gray.50", "rgba(255,255,255,0.05)")}
          backdropFilter="blur(15px)"
          borderRadius="2xl"
          p={4}
          border="1px solid"
          borderColor={borderColor}
          mb={4}
        >
          <VStack spacing={4} align="stretch">
            {/* User Info */}
            <HStack spacing={3}>
              <Box
                p={2}
                bgGradient="linear(to-r, #00c6ff, #0072ff)"
                borderRadius="lg"
              >
                <Icon as={FiUser} color="white" boxSize={4} />
              </Box>
              <VStack spacing={0} align="start">
                <Text fontSize="sm" fontWeight="bold" color={textColor}>
                  Welcome Back!
                </Text>
                <Text fontSize="xs" color={secondaryTextColor}>
                  Continue your journey
                </Text>
              </VStack>
            </HStack>

            {/* Progress Bar */}
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="xs" color={secondaryTextColor} fontWeight="medium">
                  Learning Progress
                </Text>
                <Text fontSize="xs" color={textColor} fontWeight="bold">
                  65%
                </Text>
              </HStack>
              <Progress
                value={65}
                size="sm"
                borderRadius="full"
                bg={useColorModeValue("gray.200", "rgba(255,255,255,0.1)")}
                sx={{
                  '& > div': {
                    bgGradient: "linear(to-r, #00c6ff, #0072ff)",
                  }
                }}
              />
            </Box>
          </VStack>
        </Box>
      </MotionBox>

      {/* Quick Stats */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <Box
          bg={useColorModeValue("white", "rgba(255,255,255,0.05)")}
          backdropFilter="blur(15px)"
          borderRadius="2xl"
          p={4}
          border="1px solid"
          borderColor={borderColor}
        >
          <Text fontSize="sm" fontWeight="bold" color={textColor} mb={3}>
            Quick Stats
          </Text>
          <VStack spacing={3}>
            {quickStats.map((stat, index) => (
              <HStack key={stat.label} justify="space-between" w="full">
                <HStack spacing={2}>
                  <Icon as={stat.icon} color={stat.color} boxSize={4} />
                  <Text fontSize="sm" color={secondaryTextColor}>
                    {stat.label}
                  </Text>
                </HStack>
                <Text fontSize="sm" fontWeight="bold" color={textColor}>
                  {stat.value}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </MotionBox>
    </MotionBox>
  );
};

export default Sidebar;