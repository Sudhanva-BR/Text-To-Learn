import { Flex, Text, Button, Spacer, useColorMode, IconButton } from '@chakra-ui/react';
import { FiSun, FiMoon, FiUser } from 'react-icons/fi';

const Topbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  
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
        
        {/* Login button (placeholder for now) */}
        <Button leftIcon={<FiUser />} colorScheme="blue" variant="outline">
          Login
        </Button>
      </Flex>
    </Flex>
  );
};

export default Topbar;