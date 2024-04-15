import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

const API_URL = 'http://localhost:3000/api';

const userRoles = [
  'Intern',
  'Software Engineer',
  'Senior Software Engineer',
  'Solutions Enabler',
  'Solutions Consultant',
  'Solutions Architect',
  'Human Resource',
  'Finance',
];

function AdminLanding() {
  const [userData, setUserData] = useState({
    role: '',
    id: '',
    name: '',
    email: '',
    key: '',
    passwordChanged: false,
    userRole: '',
    password: '',
  });

  const [existingUsers, setExistingUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`);
        setExistingUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting with role:', userData.role); // Log the role

    // Check if email or id already exists
    if (existingUsers.some((user) => user.email === userData.email || user.id === userData.id)) {
      alert('Email or ID already exists');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/${userData.role === 'admin' ? 'admin' : 'user'}`, userData);
      console.log('Server response:', response.data); // Log the server response
      alert(`${userData.role} data stored successfully`);
      setUserData({
        role: '',
        id: '',
        name: '',
        email: '',
        key: '',
        passwordChanged: false,
        userRole: '',
        password: '',
      });
    } catch (error) {
      console.error('Error storing data:', error);
      alert(`Failed to store ${userData.role} data`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Add {userData.role ? userData.role : 'User'}</Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            id="role"
            name="role"
            value={userData.role}
            onChange={handleUserChange}
          >
            <MenuItem value="">Select Role</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>

        {userData.role === 'admin' && (
          <>
            <TextField
              name="id"
              label="Admin ID"
              value={userData.id}
              onChange={handleUserChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="name"
              label="Admin Name"
              value={userData.name}
              onChange={handleUserChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="email"
              label="Email"
              value={userData.email}
              onChange={handleUserChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="key"
              label="Admin Key"
              value={userData.key}
              onChange={handleUserChange}
              type="password"
              fullWidth
              margin="normal"
              required
            />
          </>
        )}

        {userData.role === 'user' && (
          <>
            <TextField
              name="id"
              label="User ID"
              value={userData.id}
              onChange={handleUserChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="name"
              label="Username"
              value={userData.name}
              onChange={handleUserChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="userRole"
              label="User Role"
              select
              value={userData.userRole}
              onChange={handleUserChange}
              fullWidth
              margin="normal"
              required
            >
              <MenuItem value="">Select User Role</MenuItem>
              {userRoles.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </TextField>
            <TextField
              name="email"
              label="Email"
              value={userData.email}
              onChange={handleUserChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="password"
              label="Password"
              value={userData.password}
              onChange={handleUserChange}
              type="password"
              fullWidth
              margin="normal"
              required
            />
            
          </>
        )}

        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Container>
  );
}

export default AdminLanding;
