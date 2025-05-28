
import React, { useEffect, useState, useContext } from 'react';
import {
  Heading, Table, Thead, Tbody, Tr, Th, Td, Input, Button, VStack, HStack, useToast,
  IconButton, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader,
  AlertDialogBody, AlertDialogFooter, Select
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { getAllPatients, createPatient } from '../api/patient';
import { getAllDoctors } from '../api/doctor';
import { AuthContext } from '../auth/AuthContext';

const Patients = () => {
  const { token } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ name: '', gender: '', age: '', doctorId: '', department: '', medicalHistory: '' });
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, [token]);

  const fetchPatients = async () => {
    const res = await getAllPatients(token);
    setPatients(res.data);
  };

  const fetchDoctors = async () => {
    const res = await getAllDoctors(token);
    setDoctors(res.data);
  };

  const getDoctorName = (id) => {
    const doc = doctors.find(d => d.id === id);
    return doc ? doc.name : id;
  };

  const handleDoctorChange = (e) => {
    const selectedId = e.target.value;
    const selectedDoctor = doctors.find(d => d.id === parseInt(selectedId));
    setForm({
      ...form,
      doctorId: selectedId,
      department: selectedDoctor ? selectedDoctor.specialization : ''
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.gender || !form.age || !form.doctorId) {
      toast({ title: 'Fill all required fields.', status: 'warning', duration: 2000 });
      return;
    }
    const url = editingId ? `http://localhost:3002/patients/${editingId}` : 'http://localhost:3002/patients';
    const method = editingId ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    fetchPatients();
    setForm({ name: '', gender: '', age: '', doctorId: '', department: '', medicalHistory: '' });
    setEditingId(null);
    toast({ title: `Patient ${editingId ? 'updated' : 'added'} successfully.`, status: 'success', duration: 2000 });
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, gender: p.gender, age: p.age, doctorId: p.doctorId, department: p.department, medicalHistory: p.medicalHistory });
    setEditingId(p.id);
  };

  const handleDeletePrompt = (id) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    await fetch(`http://localhost:3002/patients/${deleteId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setIsAlertOpen(false);
    setDeleteId(null);
    fetchPatients();
    toast({ title: 'Patient deleted.', status: 'error', duration: 2000 });
  };

  return (
    <>
      <Heading mb={4}>Patients</Heading>
      <VStack spacing={2} align="stretch" mb={4}>
        <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
        <Input placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />

        <Select placeholder="Select Doctor" value={form.doctorId} onChange={handleDoctorChange}>
          {doctors.map(doc => (
            <option key={doc.id} value={doc.id}>{doc.name}</option>
          ))}
        </Select>

        <Input placeholder="Department" value={form.department} isReadOnly />
        <Input placeholder="Medical History" value={form.medicalHistory} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })} />
        <Button onClick={handleSubmit} colorScheme={editingId ? 'blue' : 'teal'}>
          {editingId ? 'Update Patient' : 'Add Patient'}
        </Button>
      </VStack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Gender</Th>
            <Th>Age</Th>
            <Th>Doctor</Th>
            <Th>Department</Th>
            <Th>History</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {patients.map(p => (
            <Tr key={p.id}>
              <Td>{p.name}</Td>
              <Td>{p.gender}</Td>
              <Td>{p.age}</Td>
              <Td>{getDoctorName(p.doctorId)}</Td>
              <Td>{p.department}</Td>
              <Td>{p.medicalHistory}</Td>
              <Td>
                <HStack>
                  <IconButton icon={<EditIcon />} size="sm" aria-label="Edit" onClick={() => handleEdit(p)} />
                  <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" aria-label="Delete" onClick={() => handleDeletePrompt(p.id)} />
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
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>Confirm Delete</AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to delete this patient?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>Cancel</Button>
              <Button colorScheme='red' onClick={confirmDelete} ml={3}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Patients;
