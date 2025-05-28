// pages/Profile.js
import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, Heading, Input, VStack, Flex, useToast, Text, Divider
} from '@chakra-ui/react';
import { AuthContext } from '../auth/AuthContext';
import MenuLinks from '../components/MenuLinks';

const Profile = () => {
  const { token, user } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const toast = useToast();

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, password: '' });
      fetchAppointments();
      fetchDoctors();
      fetchPatients();
    }
  }, [user]);

  const fetchAppointments = async () => {
    let endpoint = '';
    if (user.role === 'doctor') {
      endpoint = `http://localhost:3004/appointments?doctorId=${user.id}`;
    } else if (user.role === 'patient') {
      endpoint = `http://localhost:3004/appointments?patientId=${user.id}`;
    } else {
      return;
    }

    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setAppointments(data);
  };

  const fetchDoctors = async () => {
    const res = await fetch('http://localhost:3003/doctors', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setDoctors(data);
  };

  const fetchPatients = async () => {
    const res = await fetch('http://localhost:3002/patients', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setPatients(data);
  };

  const getNameById = (list, id) => {
    const entry = list.find(i => i.id === id);
    return entry ? entry.name : id;
  };

  const handleUpdate = async () => {
    if (!form.name || !form.email) {
      toast({ title: 'Name and Email are required', status: 'warning' });
      return;
    }

    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    toast({ title: 'Profile updated', status: 'success' });
  };

  return (
    <Flex>
     

      <Box flex={1} p={6}>
        <Heading mb={4}>My Profile</Heading>
        <VStack spacing={4} align="start">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            type="password"
            placeholder="New Password (optional)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button onClick={handleUpdate} colorScheme="teal">Update Profile</Button>
        </VStack>

        {appointments.length > 0 && (
          <Box mt={10}>
            <Divider mb={4} />
            <Heading size="md" mb={2}>My Appointments</Heading>
            {appointments.map((appt) => (
              <Box key={appt.id} p={3} borderWidth={1} borderRadius="md" mb={2}>
                <Text><strong>Doctor:</strong> {getNameById(doctors, appt.doctorId)}</Text>
                <Text><strong>Patient:</strong> {getNameById(patients, appt.patientId)}</Text>
                <Text><strong>Date:</strong> {appt.date}</Text>
                <Text><strong>Time:</strong> {appt.time}</Text>
                <Text><strong>Reason:</strong> {appt.reason}</Text>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default Profile;
