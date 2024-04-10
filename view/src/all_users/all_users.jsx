import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table, TableHead, TableBody, TableCell, TableRow, Paper, Select, MenuItem, makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  primaryRow: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2196f3', // Primary color
    },
  },
});

const AllUsersTable = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const tableRef = useRef(null);

  useEffect(() => {
    // Fetch user data from MongoDB when component mounts
    fetchUsers();
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.addEventListener('scroll', handleScroll);
      return () => {
        if (tableRef.current) {
          tableRef.current.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [tableRef]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users'); // Assuming you have an endpoint to fetch users
      setUsers(response.data);
      setFilteredUsers(response.data); // Initially, set filteredUsers to all users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleScroll = () => {
    // You can implement infinite scrolling or any other scrolling behavior here
  };

  const handleRoleFilterChange = (event) => {
    const selectedRole = event.target.value;
    setSelectedRole(selectedRole);
    if (selectedRole === '') {
      // If no role is selected, show all users
      setFilteredUsers(users);
    } else {
      // Filter users based on selected role
      const filtered = users.filter(user => user.userRole === selectedRole);
      setFilteredUsers(filtered);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <h2>All Users</h2>
        <div style={{ marginTop: '10px' }}>
          <Select
            value={selectedRole}
            onChange={handleRoleFilterChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Filter by Role
            </MenuItem>
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="Intern">Intern</MenuItem>
            <MenuItem value="Software Engineer">Software Engineer</MenuItem>
            <MenuItem value="Senior Software Engineer">Senior Software Engineer</MenuItem>
            <MenuItem value="Solutions Enabler">Solutions Enabler</MenuItem>
            <MenuItem value="Solutions Consultant">Solutions Consultant</MenuItem>
            <MenuItem value="Solutions Architect">Solutions Architect</MenuItem>
            <MenuItem value="Human Resource">Human Resource</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
          </Select>
        </div><br />
        <Paper style={{ maxHeight: 300, overflow: 'auto' }}>
          <Table ref={tableRef}>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Position</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={index} className={index % 2 === 0 ? classes.primaryRow : ''}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.userRole}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        
      </div>
    </ThemeProvider>
  );
};

export default AllUsersTable;
