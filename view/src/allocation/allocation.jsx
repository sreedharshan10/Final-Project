import React, { useState, useEffect } from 'react';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, TextField, Typography, Popover, FormControl, FormGroup, FormControlLabel, Checkbox, Box } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';
 
const Allocation = () => {
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedProjectDetails, setSelectedProjectDetails] = useState({});
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedTeamLead, setSelectedTeamLead] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [memberRoles, setMemberRoles] = useState([]);
  const [memberTasks, setMemberTasks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTaskMemberId, setSelectedTaskMemberId] = useState(null);
  const [projectAllocations, setProjectAllocations] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
    fetchProjectAllocations();
  }, []);
 
  useEffect(() => {
    setFilteredUsers(users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name)));
  }, [searchTerm, users]);
 
  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  const fetchProjectAllocations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/project-allocations');
      setProjectAllocations(response.data);
    } catch (error) {
      console.error('Error fetching project allocations:', error);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
 
  const handleAllocateProjectsClick = () => {
    setShowForm(true);
  };
 
  const handleProjectChange = async (event) => {
    const selectedProjectName = event.target.value;
    setSelectedProject(selectedProjectName);
 
    try {
      const selectedProjectDetails = projects.find(project => project.projectName === selectedProjectName);
      setSelectedProjectDetails(selectedProjectDetails);
      setMemberRoles([]);
      setSelectedMembers([]); // Reset selected members
      setSelectedTeamLead(''); // Reset selected team lead
      setMemberTasks([]); // Reset member tasks
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };
 
  const handleUserSelectionChange = (userId) => (event) => {
    if (!selectedProjectDetails) {
      // Project is not selected, show an alert or handle the situation accordingly
      alert('Please select a project first.');
      return;
    }
  
    const isChecked = event.target.checked;
    let newSelectedMembers;
  
    if (isChecked) {
      // Add the user if checked
      newSelectedMembers = [...selectedMembers, userId];
    } else {
      // Remove the user if unchecked, filtering out the first and last persons
      newSelectedMembers = selectedMembers.filter(id => id !== userId && id !== selectedMembers[0] && id !== selectedMembers[selectedMembers.length - 1]);
    }
  
    // Ensure the selected members array doesn't exceed the maximum allowed length
    const maxMembers = getMaxMembers(selectedProjectDetails.projectDomain.toLowerCase());
    if (newSelectedMembers.length > maxMembers) {
      alert(`Error: Maximum team members for ${selectedProjectDetails.projectDomain} is ${maxMembers}`);
      return;
    }
  
    setSelectedMembers(newSelectedMembers);
  };
  

  const handleTeamLeadChange = (event) => {
    setSelectedTeamLead(event.target.value);
  };
  const isProjectAllocated = (projectId) => {
    // Check if any project allocation has the provided projectId
    return projectAllocations.some(allocation => allocation.projectId === projectId);
  };
  
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/project-allocations', {
        projectName: selectedProjectDetails.projectName,
        projectId: selectedProjectDetails.projectId,
        projectDomain: selectedProjectDetails.projectDomain,
        userDetails: selectedMembers.map(userId => ({
          username: users.find(user => user.id === userId)?.name,
          userId,
          userRole: memberRoles.find(role => role.userId === userId)?.role,
          userTasks: memberTasks.find(task => task.userId === userId)?.tasks || [], // Default to an empty array if no tasks selected
          userEmail: users.find(user => user.id === userId)?.email
        })),
        teamLead: selectedProjectDetails.projectLead
      });
      if (response.status === 201) {
        alert('Project allocation created successfully');
        setSelectedProject('');
        setSelectedMembers([]);
        setSelectedTeamLead('');
        setMemberRoles([]);
        setMemberTasks([]);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating project allocation:', error);
    }
  };
 
  const handleMemberRoleChange = (userId) => (event) => {
    const newMemberRoles = [...memberRoles];
    const index = newMemberRoles.findIndex(role => role.userId === userId);
    if (index !== -1) {
      newMemberRoles[index] = { userId, role: event.target.value };
    } else {
      newMemberRoles.push({ userId, role: event.target.value });
    }
    setMemberRoles(newMemberRoles);
  };
 
  const handleTaskCheckboxChange = (userId, task) => {
    const memberTaskIndex = memberTasks.findIndex(mt => mt.userId === userId);
    if (memberTaskIndex !== -1) {
      const newMemberTasks = [...memberTasks];
      const taskIndex = newMemberTasks[memberTaskIndex].tasks.indexOf(task);
      if (taskIndex !== -1) {
        newMemberTasks[memberTaskIndex].tasks.splice(taskIndex, 1);
      } else {
        newMemberTasks[memberTaskIndex].tasks.push(task);
      }
      setMemberTasks(newMemberTasks);
    } else {
      setMemberTasks([...memberTasks, { userId, tasks: [task] }]);
    }
  };
 
  const handleTaskFieldClick = (event, memberId) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskMemberId(memberId);
  };
 
  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedTaskMemberId(null);
  };
 
  return (
    <div style={{ textAlign: 'center' }}>
      <Button variant="contained" color="primary" style={{ marginBottom: '1rem' }} onClick={handleAllocateProjectsClick}>
        Allocate Projects
      </Button>
      {showForm && (
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
 <Select
            value={selectedProject}
            onChange={handleProjectChange}
            fullWidth
            required
            style={{ height: '40px' }}
          >
            {projects.map((project, index) => (
              <MenuItem
                key={index}
                value={project.projectName}
                disabled={isProjectAllocated(project.projectId)}
              >
                {project.projectName}
              </MenuItem>
            ))}
          </Select>
          {selectedProjectDetails && (
            <div>
              <TableCell>Project ID: {selectedProjectDetails.projectId}</TableCell>
              <TableCell>Project Domain: {selectedProjectDetails.projectDomain}</TableCell>
              <TableCell>Lead: {selectedProjectDetails.projectLead}</TableCell>
            </div>
          )}
          <Autocomplete
            multiple
            options={filteredUsers.filter(user => user.department !== 'Finance' && user.department !== 'Human Resource')}
            getOptionLabel={(option) => `${option.name} - ${option.projectAllocated ? 'Allocated' : 'Not allocated'}`}
            renderInput={(params) => <TextField {...params} label="Select Members" variant="outlined" />}
            onChange={(event, value) => {
              setSelectedMembers(value.map(user => user.id));
              setMemberRoles(value.map(user => ({ userId: user.id, role: '' })));
              setMemberTasks(value.map(user => ({ userId: user.id, tasks: [] })));
            }}
            filterSelectedOptions
            value={filteredUsers.filter(user => selectedMembers.includes(user.id))}
            disableCloseOnSelect
            onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
            style={{ width: '100%' }}
          />
 
          {selectedMembers.length > 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Member</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Tasks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
  {selectedMembers.map((memberId) => (
    <TableRow key={memberId}>
      <TableCell style={{ width: '30%' }}>{users.find(user => user.id === memberId)?.name}</TableCell>
      <TableCell style={{ width: '30%' }}>
        <Select
          value={memberRoles.find(role => role.userId === memberId)?.role || ''}
          onChange={handleMemberRoleChange(memberId)}
          fullWidth
          required
        >
          {getRoleOptions(selectedProjectDetails.projectDomain)}
        </Select>
      </TableCell>
      <TableCell style={{ width: '40%' }}>
        <Box border={1} p={1}>
          <Typography variant="body2" onClick={(event) => handleTaskFieldClick(event, memberId)} style={{ cursor: 'pointer' }}>
            {memberTasks.find(mt => mt.userId === memberId)?.tasks.join(', ') || 'No tasks selected'}
          </Typography>
        </Box>
        <Popover
          open={anchorEl && selectedTaskMemberId === memberId}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
        >
          <FormControl component="fieldset">
            <FormGroup>
              {selectedProjectDetails.projectTasks.map((task, index) => (
                <FormControlLabel
                  key={index}
                  control={<Checkbox
                    checked={memberTasks.find(mt => mt.userId === memberId)?.tasks.includes(task) || false}
                    onChange={() => handleTaskCheckboxChange(memberId, task)}
                    name={task}
                  />}
                  label={task}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Popover>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

            </Table>
          )}
          <br />
          <Button type="submit" variant="contained" color="primary">Create</Button>
        </form>
      )}
    </div>
  );
};
 
const getRoleOptions = (projectDomain) => {
  if (!projectDomain) {
    return [];
  }

  switch (projectDomain.toLowerCase()) {
    case 'full stack web development':
      return [
        <MenuItem key="project-manager" value="Project Manager">Project Manager</MenuItem>,
        <MenuItem key="frontend-developer" value="Frontend Developer">Frontend Developer</MenuItem>,
        <MenuItem key="backend-developer" value="Backend Developer">Backend Developer</MenuItem>,
        <MenuItem key="db-administrator" value="DB Administrator">DB Administrator</MenuItem>,
        <MenuItem key="ui-ux-designer" value="UI/UX Designer">UI/UX Designer</MenuItem>,
        <MenuItem key="devops-engineer" value="DevOps Engineer">DevOps Engineer</MenuItem>,
        <MenuItem key="qa-engineer" value="QA Engineer">QA Engineer</MenuItem>,
        <MenuItem key="shadow" value="Shadow">Shadow</MenuItem>
      ];
    case 'data engineering':
      return [
        <MenuItem key="project-manager" value="Project Manager">Project Manager</MenuItem>,
        <MenuItem key="data-architect" value="Data Architect">Data Architect</MenuItem>,
        <MenuItem key="etl-developer" value="ETL Developer">ETL Developer</MenuItem>,
        <MenuItem key="big-data-engineer" value="Big Data Engineer">Big Data Engineer</MenuItem>,
        <MenuItem key="db-administrator" value="DB Administrator">DB Administrator</MenuItem>,
        <MenuItem key="data-quality-analyst" value="Data Quality Analyst">Data Quality Analyst</MenuItem>,
        <MenuItem key="data-analyst" value="Data Analyst">Data Analyst</MenuItem>,
        <MenuItem key="shadow" value="Shadow">Shadow</MenuItem>
      ];
    case 'data science':
      return [
        <MenuItem key="project-manager" value="Project Manager">Project Manager</MenuItem>,
        <MenuItem key="data-scientist" value="Data Scientist">Data Scientist</MenuItem>,
        <MenuItem key="ml-engineer" value="ML Engineer">ML Engineer</MenuItem>,
        <MenuItem key="data-analyst" value="Data Analyst">Data Analyst</MenuItem>,
        <MenuItem key="statistician" value="Statistician">Statistician</MenuItem>,
        <MenuItem key="shadow" value="Shadow">Shadow</MenuItem>
      ];
    default:
      return [];
  }
};

 
export default Allocation;