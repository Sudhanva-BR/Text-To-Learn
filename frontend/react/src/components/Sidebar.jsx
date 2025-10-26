import { Box, VStack, Link, Icon, Text, Flex } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiPlus } from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', icon: FiHome, path: '/' },
    { name: 'My Courses', icon: FiBook, path: '/my-courses' },
    { name: 'Create Course', icon: FiPlus, path: '/create' },
  ];
  
  return (
    <Box
      w="250px"
      bg="blue.700"
      color="white"
      p={5}
      display={{ base: 'none', md: 'block' }}
    >
      {/* Logo/Brand */}
      <Flex align="center" mb={8}>
        <Icon as={FiBook} boxSize={8} mr={2} />
        <Text fontSize="xl" fontWeight="bold">
          Text to Learn
        </Text>
      </Flex>
      
      {/* Navigation */}
      <VStack align="stretch" spacing={2}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            as={RouterLink}
            to={item.path}
            _hover={{ textDecoration: 'none', bg: 'blue.600' }}
            bg={location.pathname === item.path ? 'blue.600' : 'transparent'}
            p={3}
            borderRadius="md"
            display="flex"
            alignItems="center"
          >
            <Icon as={item.icon} mr={3} />
            <Text>{item.name}</Text>
          </Link>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;