import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  // Use the same background as home.jsx
  const bgGradient = useColorModeValue(
    "gray.50", // Light mode: light gray background
    "linear(to-br, #0f0c29, #302b63, #24243e)" // Dark mode: same as home.jsx
  );

  const contentBg = useColorModeValue(
    "white", // Light mode: white content area
    "rgba(255, 255, 255, 0.02)" // Dark mode: very subtle transparent overlay
  );

  return (
    <Flex 
      h="100vh" 
      overflow="hidden"
      bgGradient={bgGradient}
    >
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <Flex direction="column" flex="1" overflow="hidden">
        {/* Topbar */}
        <Topbar />
        
        {/* Page Content */}
        <Box 
          flex="1" 
          overflow="auto" 
          p={6} 
          bg={contentBg}
          backdropFilter="blur(10px)"
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;