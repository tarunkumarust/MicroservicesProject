// pages/Users.js
import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, Heading, Input, Table, Thead, Tbody, Tr, Th, Td,
  VStack, useToast, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Select,
  IconButton, Badge, AlertDialog, AlertDialogOverlay, AlertDialogContent,
  AlertDialogHeader, AlertDialogBody, AlertDialogFooter,Flex, Text, Menu,
  MenuButton, MenuList, MenuItem, Icon

} from '@chakra-ui/react';
import { AuthContext } from '../auth/AuthContext';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
//import { FaBell } from 'react-icons/fa';

const Users = () => {
  const { token, user } = useContext(AuthContext);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState([]);
 // const [notifications, setNotifications] = useState([]);

  //const [unreadCount, setUnreadCount] = useState(0);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });
  const [editUserId, setEditUserId] = useState(null);
  const [filterRole, setFilterRole] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, userId: null });
  const cancelRef = React.useRef();

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:3000/auth/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
  };
 /* const fetchNotifications = async () => {

    const res = await fetch('http://localhost:3000/notification/history', {
    
    headers: { Authorization: `Bearer ${token}` },
    
    });
    
    const data = await res.json();
    
    console.log('🔔 Notification history:', data);

    setNotifications(data);
    
    setUnreadCount(data.filter(n => !n.read).length);
    
    };
*/
  useEffect(() => {
    if (token && user?.role === 'admin') {
      fetchUsers();
     // fetchNotifications();
    }
  }, [token, user]);

  const handleSubmitUser = async () => {
    if (!newUser.name || !newUser.email || (!editUserId && !newUser.password) || !newUser.role) {
      toast({ title: 'All fields are required', status: 'warning' });
      return;
    }

    const url = editUserId
    ? `http://localhost:3000/auth/users/${editUserId}`
    : newUser.password
      ? 'http://localhost:3000/auth/register'
      : 'http://localhost:3000/auth/invite';

    const method = editUserId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
    toast({ title: editUserId ? 'User updated' : newUser.password ? 'User created' : 'Invite sent', status: 'success' });

      fetchUsers();
      onClose();
      setEditUserId(null);
      setNewUser({ name: '', email: '', password: '', role: '' });
    } else {
      const err = await res.json();
      toast({ title: err.message || 'Operation failed', status: 'error' });
    }
  };

  const handleEdit = (u) => {
    setEditUserId(u.id);
    setNewUser({ name: u.name, email: u.email, password: '', role: u.role });
    onOpen();
  };

  const confirmDelete = (id) => {
    setDeleteDialog({ isOpen: true, userId: id });
  };

  const handleDelete = async () => {
    const id = deleteDialog.userId;
    const res = await fetch(`http://localhost:3000/auth/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      toast({ title: 'User deleted', status: 'info' });
      fetchUsers();
    } else {
      toast({ title: 'Delete failed', status: 'error' });
    }
    setDeleteDialog({ isOpen: false, userId: null });
  };

  const filteredUsers = filterRole ? users.filter(u => u.role === filterRole) : users;

  if (user?.role !== 'admin') {
    return <Box p={6}><Heading size="md">Access Denied</Heading></Box>;
  }

  return (
    <Box p={6}>
      <Flex justifyContent="space-between" alignItems="center">
          <Heading mb={4}>Users</Heading>
          
        </Flex>

      <Button onClick={onOpen} colorScheme="teal" mb={4}>Invite User</Button>

      <Select placeholder="Filter by role" mb={4} value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
        <option value="admin">Admin</option>
        <option value="doctor">Doctor</option>
        <option value="nurse">Nurse</option>
        <option value="patient">Patient</option>
      </Select>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers.map((u) => (
            <Tr key={u.id}>
              <Td>{u.name}</Td>
              <Td>{u.email}</Td>
              <Td><Badge colorScheme={u.role === 'admin' ? 'purple' : u.role === 'doctor' ? 'green' : u.role === 'nurse' ? 'yellow' : 'blue'}>{u.role}</Badge></Td>
              <Td>
                <IconButton icon={<EditIcon />} size="sm" mr={2} onClick={() => handleEdit(u)} />
                <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => confirmDelete(u.id)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={() => { setEditUserId(null); onClose(); }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editUserId ? 'Edit User' : 'Invite New User'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
            <Text fontSize="sm" color="gray.500" mt={-2} mb={2}>
                      Leave password blank to send invite link instead
              </Text>
              <Input placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
              <Input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
              {!editUserId && <Input placeholder="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />}
              <Select placeholder="Select role" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="patient">Patient</option>
              </Select>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmitUser}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={deleteDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setDeleteDialog({ isOpen: false, userId: null })}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete User
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setDeleteDialog({ isOpen: false, userId: null })}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Users;
