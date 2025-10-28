import { Flex, Text, Button, Spacer, useColorMode, IconButton, HStack } from '@chakra-ui/react';
import { FiSun, FiMoon, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      px={6}
      py={4}
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      boxShadow="sm"
    >
      <Text fontSize="2xl" fontWeight="bold" color="blue.600">
        Dashboard
      </Text>
      
      <Spacer />
      
      <Flex align="center" gap={3}>
        {/* Color mode toggle */}
        <IconButton
          icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="Toggle color mode"
        />
        
        {/* User info and logout button */}
        {isAuthenticated && user && (
          <HStack spacing={3}>
            <Text fontSize="sm" color="gray.700" fontWeight="medium">
              Welcome, {user.username}!
            </Text>
            <Button 
              leftIcon={<FiLogOut />} 
              colorScheme="blue" 
              variant="outline"
              onClick={handleLogout}
              size="sm"
            >
              Logout
            </Button>
          </HStack>
        )}
      </Flex>
    </Flex>
  );
};

export default Topbar;