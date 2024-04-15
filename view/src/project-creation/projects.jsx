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
    leadUserId: '', // Initialize leadUserId
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
      const usersResponse = await axios.get(`${API_URL}/users`);
      const users = usersResponse.data;
  
      const projectsResponse = await axios.get(`${API_URL}/projects`);
      const projects = projectsResponse.data;
  
      // Get all users who are Solutions Enabler or Solutions Architect
      const filteredUsers = users.filter(user => user.userRole === 'Solutions Enabler' || user.userRole === 'Solutions Architect');
      
      // Get the names of users who are already assigned as project leads
      const allocatedProjectLeads = projects.map(project => project.projectLead);
  
      // Mark users as available if they are not already assigned as project leads
      const solutionsUsersWithAvailability = filteredUsers.map(user => ({
        ...user,
        available: !allocatedProjectLeads.includes(user.name)
      }));
  
      setSolutionsUsers(solutionsUsersWithAvailability);
    } catch (error) {
      console.error('Error fetching solutions users:', error);
    }
  };
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };
  
  const handleTeamLeadChange = (event) => {
    const selectedLead = solutionsUsers.find(user => user.name === event.target.value);
    setProjectData({ ...projectData, projectLead: event.target.value, leadUserId: selectedLead.id });
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
      // Check if projectLead is empty
      if (!projectData.projectLead) {
        alert('Please select a project lead');
        return;
      }
      
      // Check if leadUserId is empty
      if (!projectData.leadUserId) {
        alert('Lead user ID is missing');
        return;
      }
      
      // Check if project ID already exists
      const existingProjectsResponse = await axios.get(`${API_URL}/projects`);
      const existingProjects = existingProjectsResponse.data;
      const isProjectIdExists = existingProjects.some(project => project.projectId === projectData.projectId);
      
      if (isProjectIdExists) {
        alert('Project ID already exists');
        return;
      }
  
      console.log('Project Data:', projectData);
  
      await axios.post(`${API_URL}/projects`, projectData);
      alert('Project created successfully');
      setProjectData({
        projectId: '',
        projectName: '',
        projectDomain: '',
        projectTasks: [''],
        projectLead: '',
        leadUserId: '', // Reset leadUserId as well
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
  onChange={handleTeamLeadChange} // Use handleTeamLeadChange instead of handleInputChange
  fullWidth
  required
>
  {solutionsUsers.map((user) => (
    <MenuItem key={user.userID} value={user.name} disabled={!user.available}>
      {user.name} {user.available ? "(Available)" : "(Not Available)"} - {user.userRole}
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
