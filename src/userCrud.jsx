// src/UserCrud.js
import React, { useEffect, useState } from 'react';
import UserList from './userList';
import UserForm from './userForm';
import { Container, Button, Box, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserCrud = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Users from API with error handling
  useEffect(()=>{
    fetch('https://jsonplaceholder.typicode.com/users')
    .then((res)=>res.json())
    .then((data)=>setUsers(data))
    .catch(()=>toast.error('Failed to fetch users'))
  },[])

  // Create or Update User
  const handleSaveUser = async(user)=>{
    try{
      if(editingUser){
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${editingUser.id}`, {
          method:'PUT',
          headers: {'Content-type': 'application/json'}, 
          body: JSON.stringify(user)
        })
        const data = await response.json()
        setUsers(users.map((u) => (u.id === editingUser.id ? data : u)));
          toast.success('User updated successfully');
      }
      else{
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
          method:'POST',
          headers: {'Content-type': 'application/json'}, 
          body: JSON.stringify(user)
        })
        const data = await response.json()
        setUsers([...users, data]);
        toast.success('User created successfully');
      }
    }
    catch(err){
      toast.error('Failed to create user')
    }
    
  }

  // Edit User
  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  // Delete User with error handling
  const handleDeleteUser = async(userId)=>{
    try{
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        method:'DELETE'
      })
      setUsers(users.filter((user) => user.id !== userId));
      toast.success('User deleted successfully');
    }
    catch(err){
      toast.error('Failed to delete user')
    }
  }

  // Filter users by search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Box mt={3} mb={3} display="flex" justifyContent="space-between">
        <Button variant="contained" onClick={() => setFormOpen(true)}>Add User</Button>
        <TextField
          label="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <UserList users={filteredUsers} onEdit={handleEditUser} onDelete={handleDeleteUser} />
      <UserForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveUser}
        user={editingUser}
      />
      <ToastContainer />
    </Container>
  );
};

export default UserCrud;
