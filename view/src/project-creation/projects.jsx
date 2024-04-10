import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Select, MenuItem } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Change this URL accordingly

function CreateProjectPage() {
  const [projectData, setProjectData] = useState({
    projectId: '',
    projectName: '',
    projectDomain: '',
    projectTasks: [''],
    projectLead: '',
    projectStartDate: null,
    projectEndDate: null,
  });
  const [solutionsUsers, setSolutionsUsers] = useState([]);

  useEffect(() => {
    // Fetch users who are either Solutions Enabler or Solutions Architect
    fetchSolutionsUsers();
  }, []);

  const fetchSolutionsUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      // Filter users to include only Solutions Enabler or Solutions Architect
      const filteredUsers = response.data.filter(user => user.userRole === 'Solutions Enabler' || user.userRole === 'Solutions Architect');
      setSolutionsUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching solutions users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleTaskChange = (index, value) => {
    const updatedTasks = [...projectData.projectTasks];
    updatedTasks[index] = value;
    setProjectData({ ...projectData, projectTasks: updatedTasks });
  };

  const handleAddTask = () => {
    setProjectData({ ...projectData, projectTasks: [...projectData.projectTasks, ''] });
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = [...projectData.projectTasks];
    updatedTasks.splice(index, 1);
    setProjectData({ ...projectData, projectTasks: updatedTasks });
  };

  const handleStartDateChange = (date) => {
    setProjectData({ ...projectData, projectStartDate: date });
  };

  const handleEndDateChange = (date) => {
    setProjectData({ ...projectData, projectEndDate: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/projects`, projectData);
      alert('Project created successfully');
      setProjectData({
        projectId: '',
        projectName: '',
        projectDomain: '',
        projectTasks: [''],
        projectLead: '',
        projectStartDate: null,
        projectEndDate: null,
      });
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Create Project</Typography>
      <br />
      <form onSubmit={handleSubmit}>
        <TextField
          name="projectId"
          label="Project ID"
          value={projectData.projectId}
          onChange={handleInputChange}
          fullWidth
          required
        /> 
        <br />
        <TextField
          name="projectName"
          label="Project Name"
          value={projectData.projectName}
          onChange={handleInputChange}
          fullWidth
          required
        />
        <br />
        <Typography variant="subtitle1" gutterBottom>Project Domain</Typography>
        <Select
          name="projectDomain"
          value={projectData.projectDomain}
          onChange={handleInputChange}
          fullWidth
          required
        >
          <MenuItem value="Full Stack Web Development">Full stack web development</MenuItem>
          <MenuItem value="Data Engineering">Data engineering</MenuItem>
          <MenuItem value="Data Science">Data science</MenuItem>
        </Select>
        {projectData.projectTasks.map((task, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <TextField
              label={`Task ${index + 1}`}
              value={task}
              onChange={(e) => handleTaskChange(index, e.target.value)}
              fullWidth
              required
            />
            {index === projectData.projectTasks.length - 1 && (
              <Button onClick={handleAddTask} variant="outlined">Add Task</Button>
            )}
            {index !== 0 && (
              <Button onClick={() => handleRemoveTask(index)} variant="outlined">Remove Task</Button>
            )}
          </div>
        ))}
        <Typography variant="subtitle1" gutterBottom>Project Lead</Typography>
        <Select
          name="projectLead"
          value={projectData.projectLead}
          onChange={handleInputChange}
          fullWidth
          required
        >
          {solutionsUsers.map((user) => (
            <MenuItem key={user.userID} value={user.name}>
              {`${user.name} - ${user.userRole}`}
            </MenuItem>
          ))}
        </Select>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="body1">Project Start Date</Typography>
          <DatePicker
            selected={projectData.projectStartDate}
            onChange={handleStartDateChange}
            dateFormat="yyyy-MM-dd"
            required
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="body1">Project End Date</Typography>
          <DatePicker
            selected={projectData.projectEndDate}
            onChange={handleEndDateChange}
            dateFormat="yyyy-MM-dd"
            required
          />
        </div>
        <Button type="submit" variant="contained" color="primary">Create Project</Button>
      </form>
    </Container>
  );
}

export default CreateProjectPage;
