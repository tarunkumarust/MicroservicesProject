// pages/LandingPage.js
import React from 'react';
import { Box, Button, Heading, Stack, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-r, blue.400, teal.500)"
      color="white"
    >
      <VStack spacing={8} textAlign="center" maxW="xl">
        <Heading fontSize={{ base: '3xl', md: '5xl' }}>
          Welcome to Hospital Management System
        </Heading>
        <Text fontSize="lg">
          Secure. Scalable. Role-based Access for Admins, Doctors
        </Text>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
          <Link to="/login">
            <Button colorScheme="teal" bg="white" color="teal.600">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" colorScheme="whiteAlpha">
              Register
            </Button>
          </Link>
        </Stack>
      </VStack>
    </Box>
  );
};

export default LandingPage;
