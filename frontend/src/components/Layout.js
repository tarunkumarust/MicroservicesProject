
import React, { useContext } from 'react';
import { Box, Flex, Text, Button, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import MenuLinks from './MenuLinks';

const Layout = ({ children }) => {
  const { logout } = useContext(AuthContext);
  //const { user } = useContext(AuthContext);
 // useNotifications(user);


  return (
    <Flex minH="100vh">
      <Box w="240px" bg="gray.800" color="white" p={4}>
        <Text fontSize="xl" mb={6} fontWeight="bold">Hospital Admin</Text>
        <VStack align="start" spacing={4}>
          <MenuLinks />
        
        </VStack>
        <Button mt={6} size="sm" colorScheme="red" onClick={logout}>Logout</Button>
      </Box>
      <Box flex={1} p={6} bg="gray.50">
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
