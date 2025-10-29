import {
  Flex,
  Text,
  Button,
  Spacer,
  useColorMode,
  IconButton,
  HStack,
  Box,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSun, FiMoon, FiLogOut, FiUser, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const MotionFlex = motion(Flex);
const MotionIconButton = motion(IconButton);
const MotionButton = motion(Button);

const Topbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Color values for light/dark mode - Using home.jsx background in dark mode
  const bgColor = useColorModeValue(
    "rgba(255, 255, 255, 0.8)",
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <MotionFlex
      as="nav"
      align="center"
      justify="space-between"
      px={8}
      py={4}
      bg={bgColor}
      bgGradient={bgGradient}
      backdropFilter="blur(20px)"
      borderBottom="1px solid"
      borderColor={borderColor}
      boxShadow="0 4px 25px rgba(0, 0, 0, 0.1)"
      className="transition-all duration-300"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      position="sticky"
      top={0}
      zIndex={1000}
    >
      {/* Logo/Brand */}
      <Box>
        <Text
          fontSize="2xl"
          fontWeight="black"
          bgGradient="linear(to-r, #ff0080, #7928ca, #0072ff)"
          bgClip="text"
          _light={{
            bgGradient: "linear(to-r, #667eea, #764ba2, #6B46C1)"
          }}
          className="cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate('/')}
        >
          Text to Learn
        </Text>
      </Box>

      <Spacer />

      <Flex align="center" gap={4}>
        {/* Theme Toggle */}
        <MotionIconButton
          icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="Toggle color mode"
          color={textColor}
          bg={useColorModeValue("gray.100", "rgba(255,255,255,0.1)")}
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor={useColorModeValue("gray.200", "rgba(255,255,255,0.1)")}
          _hover={{
            bg: useColorModeValue("gray.200", "rgba(255,255,255,0.2)"),
            transform: "scale(1.1)",
            color: "cyan.500",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          size="lg"
        />

        {/* User Section */}
        {isAuthenticated && user && (
          <HStack spacing={4}>
            {/* Desktop View */}
            <Box display={{ base: 'none', md: 'block' }}>
              <HStack
                spacing={4}
                bg={useColorModeValue("gray.100", "rgba(255,255,255,0.1)")}
                backdropFilter="blur(15px)"
                px={4}
                py={2}
                borderRadius="xl"
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "rgba(255,255,255,0.15)")}
              >
                <VStack spacing={0} align="end">
                  <Text fontSize="sm" color={textColor} fontWeight="bold">
                    {user.username}
                  </Text>
                  <Text fontSize="xs" color={secondaryTextColor} fontWeight="medium">
                    Premium User
                  </Text>
                </VStack>
                
                <Avatar
                  size="sm"
                  name={user.username}
                  bgGradient="linear(to-r, #00c6ff, #0072ff)"
                  _light={{
                    bgGradient: "linear(to-r, #4299E1, #3182CE)"
                  }}
                  color="white"
                  fontWeight="bold"
                />
                
                <MotionButton
                  leftIcon={<FiLogOut />}
                  bgGradient="linear(to-r, #ff512f, #dd2476)"
                  color="white"
                  variant="solid"
                  onClick={handleLogout}
                  size="sm"
                  _hover={{
                    bgGradient: "linear(to-r, #dd2476, #ff512f)",
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(221, 36, 118, 0.3)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  fontWeight="bold"
                >
                  Logout
                </MotionButton>
              </HStack>
            </Box>

            {/* Mobile View */}
            <Box display={{ base: 'block', md: 'none' }}>
              <Menu>
                <MenuButton>
                  <Avatar
                    size="sm"
                    name={user.username}
                    bgGradient="linear(to-r, #00c6ff, #0072ff)"
                    _light={{
                      bgGradient: "linear(to-r, #4299E1, #3182CE)"
                    }}
                    color="white"
                    fontWeight="bold"
                    className="hover:scale-110 transition-transform"
                  />
                </MenuButton>
                <MenuList
                  bg={useColorModeValue("white", "rgba(15, 12, 41, 0.95)")}
                  backdropFilter="blur(20px)"
                  border="1px solid"
                  borderColor={useColorModeValue("gray.200", "rgba(255,255,255,0.2)")}
                  borderRadius="xl"
                  p={2}
                >
                  <MenuItem
                    icon={<FiUser />}
                    bg="transparent"
                    _hover={{ bg: useColorModeValue("gray.100", "rgba(255,255,255,0.2)") }}
                    color={textColor}
                  >
                    <VStack spacing={0} align="start">
                      <Text fontSize="sm" fontWeight="bold">
                        {user.username}
                      </Text>
                      <Text fontSize="xs" color={secondaryTextColor}>
                        Premium User
                      </Text>
                    </VStack>
                  </MenuItem>
                  <MenuItem
                    icon={<FiSettings />}
                    bg="transparent"
                    _hover={{ bg: useColorModeValue("gray.100", "rgba(255,255,255,0.2)") }}
                    color={textColor}
                  >
                    Settings
                  </MenuItem>
                  <MenuItem
                    icon={<FiLogOut />}
                    bg="transparent"
                    _hover={{ bg: "red.500", color: "white" }}
                    color={textColor}
                    onClick={handleLogout}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </HStack>
        )}

        {/* Login Button for non-authenticated users */}
        {!isAuthenticated && (
          <MotionButton
            bgGradient="linear(to-r, #00c6ff, #0072ff)"
            _light={{
              bgGradient: "linear(to-r, #4299E1, #3182CE)"
            }}
            color="white"
            onClick={() => navigate('/login')}
            _hover={{
              bgGradient: "linear(to-r, #0072ff, #00c6ff)",
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(0, 114, 255, 0.3)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            fontWeight="bold"
          >
            Sign In
          </MotionButton>
        )}
      </Flex>

      {/* Floating accent element */}
      <Box
        position="absolute"
        bottom={-2}
        left="10%"
        w="80px"
        h="2px"
        bgGradient="linear(to-r, transparent, #ff0080, transparent)"
        _light={{
          bgGradient: "linear(to-r, transparent, #667eea, transparent)"
        }}
        opacity={0.6}
      />
    </MotionFlex>
  );
};

export default Topbar;