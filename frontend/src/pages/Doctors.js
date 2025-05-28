
import React, { useEffect, useState, useContext } from 'react';
import {
  Heading, Table, Thead, Tbody, Tr, Th, Td, Box, Input, Button,
  VStack, HStack, useToast, IconButton, AlertDialog,
  AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { getAllDoctors, createDoctor } from '../api/doctor';
import { AuthContext } from '../auth/AuthContext';

const Doctors = () => {
  const { token } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ name: '', specialization: '', availability: '' });
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();

  useEffect(() => {
    fetchDoctors();
  }, [token]);

  const fetchDoctors = async () => {
    const res = await getAllDoctors(token);
    setDoctors(res.data);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.specialization || !form.availability) {
      toast({ title: 'Please fill all fields.', status: 'warning', duration: 2000 });
      return;
    }
    if (editingId) {
      await fetch(`http://localhost:3003/doctors/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      toast({ title: 'Doctor updated.', status: 'info', duration: 2000 });
    } else {
      await createDoctor(form, token);
      toast({ title: 'Doctor added successfully.', status: 'success', duration: 2000 });
    }
    setForm({ name: '', specialization: '', availability: '' });
    setEditingId(null);
    fetchDoctors();
  };

  const handleEdit = (doctor) => {
    setForm({ name: doctor.name, specialization: doctor.specialization, availability: doctor.availability });
    setEditingId(doctor.id);
  };

  const handleDeletePrompt = (id) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    await fetch(`http://localhost:3003/doctors/${deleteId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    toast({ title: 'Doctor deleted.', status: 'error', duration: 2000 });
    setIsAlertOpen(false);
    setDeleteId(null);
    fetchDoctors();
  };

  const filteredDoctors = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Heading mb={4}>Doctors</Heading>
      <Input mb={4} placeholder="Search doctors..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <VStack mb={4} spacing={2} align="stretch">
        <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
        <Input placeholder="Availability" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} />
        <Button onClick={handleSubmit} colorScheme={editingId ? 'blue' : 'teal'}>
          {editingId ? 'Update Doctor' : 'Add Doctor'}
        </Button>
      </VStack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Specialization</Th>
            <Th>Availability</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredDoctors.map(d => (
            <Tr key={d.id}>
              <Td>{d.name}</Td>
              <Td>{d.specialization}</Td>
              <Td>{d.availability}</Td>
              <Td>
                <HStack>
                  <IconButton icon={<EditIcon />} size="sm" aria-label="Edit" onClick={() => handleEdit(d)} />
                  <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" aria-label="Delete" onClick={() => handleDeletePrompt(d.id)} />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Confirm Delete
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this doctor? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Doctors;