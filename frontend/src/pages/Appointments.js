
import React, { useEffect, useState, useContext } from 'react';
import {
  Heading, Table, Thead, Tbody, Tr, Th, Td, Input, Button, VStack, HStack, Select,
  useToast, IconButton, AlertDialog, AlertDialogOverlay, AlertDialogContent,
  AlertDialogHeader, AlertDialogBody, AlertDialogFooter
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import { AuthContext } from '../auth/AuthContext';
import { getAllAppointments } from '../api/appointment';
import { getAllPatients } from '../api/patient';
import { getAllDoctors } from '../api/doctor';

const Appointments = () => {
  const { token } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ patientId: '', doctorId: '', date: '', time: '', reason: '' });
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;
  const cancelRef = React.useRef();
  const toast = useToast();

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
    fetchAppointments();
  }, [token]);

  useEffect(() => {
    handleFilter();
  }, [search, appointments]);

  const fetchAppointments = async () => {
    const res = await getAllAppointments(token);
    setAppointments(res.data);
  };

  const fetchDoctors = async () => {
    const res = await getAllDoctors(token);
    setDoctors(res.data);
  };

  const fetchPatients = async () => {
    const res = await getAllPatients(token);
    setPatients(res.data);
  };

  const getNameById = (list, id) => {
    const entry = list.find(i => i.id === id);
    return entry ? entry.name : id;
  };

  const handleFilter = () => {
    const term = search.toLowerCase();
    const filtered = appointments.filter(a => {
      const patientName = getNameById(patients, a.patientId);
      const doctorName = getNameById(doctors, a.doctorId);
      return (
        (typeof patientName === 'string' && patientName.toLowerCase().includes(term)) ||
        (typeof doctorName === 'string' && doctorName.toLowerCase().includes(term)) ||
        a.reason.toLowerCase().includes(term)
      );
    });
    setFilteredAppointments(filtered);
    setCurrentPage(1);
  };
  

  const handleExportCSV = () => {
    const csvContent = [
      ['Patient', 'Doctor', 'Date', 'Time', 'Reason'],
      ...filteredAppointments.map(a => [
        getNameById(patients, a.patientId),
        getNameById(doctors, a.doctorId),
        a.date,
        a.time,
        a.reason
      ])
    ]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'appointments.csv';
    link.click();
  };

  const handleSubmit = async () => {
    if (!form.patientId || !form.doctorId || !form.date || !form.time) {
      toast({ title: 'Please fill all fields.', status: 'warning', duration: 2000 });
      return;
    }
    const url = editingId ? `http://localhost:3004/appointments/${editingId}` : 'http://localhost:3004/appointments';
    const method = editingId ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    fetchAppointments();
    setForm({ patientId: '', doctorId: '', date: '', time: '', reason: '' });
    setEditingId(null);
    toast({ title: `Appointment ${editingId ? 'updated' : 'booked'}.`, status: 'success', duration: 2000 });
  };

  const handleEdit = (a) => {
    setForm({ patientId: a.patientId, doctorId: a.doctorId, date: a.date, time: a.time, reason: a.reason });
    setEditingId(a.id);
  };

  const handleDeletePrompt = (id) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    await fetch(`http://localhost:3004/appointments/${deleteId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setIsAlertOpen(false);
    setDeleteId(null);
    fetchAppointments();
    toast({ title: 'Appointment deleted.', status: 'error', duration: 2000 });
  };

  const indexOfLast = currentPage * appointmentsPerPage;
  const indexOfFirst = indexOfLast - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  return (
    <>
      <Heading mb={4}>Appointments</Heading>
      <VStack spacing={2} align="stretch" mb={4}>
        <Input placeholder="Search by patient, doctor, or reason" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select placeholder="Select Patient" value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
        <Select placeholder="Select Doctor" value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
          {doctors.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </Select>
        <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        <Input placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
        <Button onClick={handleSubmit} colorScheme={editingId ? 'blue' : 'teal'}>
          {editingId ? 'Update Appointment' : 'Book Appointment'}
        </Button>
        <Button onClick={handleExportCSV} leftIcon={<DownloadIcon />} colorScheme="gray">
          Export CSV
        </Button>
      </VStack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Patient</Th>
            <Th>Doctor</Th>
            <Th>Date</Th>
            <Th>Time</Th>
            <Th>Reason</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentAppointments.map(a => (
            <Tr key={a.id}>
              <Td>{getNameById(patients, a.patientId)}</Td>
              <Td>{getNameById(doctors, a.doctorId)}</Td>
              <Td>{a.date}</Td>
              <Td>{a.time}</Td>
              <Td>{a.reason}</Td>
              <Td>
                <HStack>
                  <IconButton icon={<EditIcon />} size="sm" aria-label="Edit" onClick={() => handleEdit(a)} />
                  <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" aria-label="Delete" onClick={() => handleDeletePrompt(a.id)} />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <HStack mt={4} justify="center">
        {[...Array(totalPages)].map((_, i) => (
          <Button key={i} size="sm" onClick={() => setCurrentPage(i + 1)} colorScheme={currentPage === i + 1 ? 'blue' : 'gray'}>
            {i + 1}
          </Button>
        ))}
      </HStack>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>Confirm Delete</AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to delete this appointment?</AlertDialogBody>
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

export default Appointments;
