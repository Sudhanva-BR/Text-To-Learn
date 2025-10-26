import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  return (
    <Flex h="100vh" overflow="hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <Flex direction="column" flex="1" overflow="hidden">
        {/* Topbar */}
        <Topbar />
        
        {/* Page Content */}
        <Box flex="1" overflow="auto" p={6} bg="gray.50">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;