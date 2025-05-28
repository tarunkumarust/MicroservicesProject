
import React, { useContext, useState } from 'react';
import { Box, Button,Stack, FormControl, FormLabel, Input, VStack, Heading } from '@chakra-ui/react';
import { AuthContext } from './AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <Box maxW="md" mx="auto" mt={20} p={6} borderWidth={1} borderRadius="md">
      <Heading size="lg" mb={6}>Login</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </FormControl>
          <Button colorScheme="blue" mt={5} w="full"  type="submit">Login</Button>
        </VStack>
        
      <Link to="/register">
            <Button variant="outline" mt={5} w="full" colorScheme="blue">
              Register
            </Button>
          </Link>
         
      </form>

    </Box>
  );
};

export default Login;
