// auth/Register.js
import React, { useState } from 'react';
import {
  Box, Button, Heading, Input, Select, VStack, useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async () => {
    const { name, email, password, role } = form;
    if (!name || !email || !password || !role) {
      toast({ title: 'Please fill all fields', status: 'warning' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Password must be at least 6 characters', status: 'warning' });
      return;
    }

    const res = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      // Auto login after registration
      const loginRes = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        localStorage.setItem('token', loginData.access_token);
        localStorage.setItem('user', JSON.stringify(loginData.user));
        toast({ title: 'Registered & logged in', status: 'success' });
        navigate('/');
      } else {
        toast({ title: 'Login failed after register', status: 'error' });
      }
    } else {
      const err = await res.json();
      toast({ title: err.message || 'Registration failed', status: 'error' });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="md">
      <Heading mb={4}>Register</Heading>
      <VStack spacing={4}>
        <Input required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input required
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          placeholder="Password (min 6 characters)"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Select
          placeholder="Select role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
        
        </Select>
        <Button onClick={handleRegister} colorScheme="blue" w="full">Register</Button>
      </VStack>
            <Link to="/login">
                    <Button variant="outline" mt={5} w="full" colorScheme="blue">
                  login
                  </Button>
                </Link>
    </Box>
  );
};

export default Register;
