import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table, TableHead, TableBody, TableCell, TableRow, Paper, Select, MenuItem, makeStyles, ThemeProvider } from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  primaryRow: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // Primary color
    },
  },
});

const AllProjectsTable = () => {
  const classes = useStyles();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const tableRef = useRef(null);

  useEffect(() => {
    // Fetch project data from MongoDB when component mounts
    fetchProjects();
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

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/projects'); // Assuming you have an endpoint to fetch projects
      setProjects(response.data);
      setFilteredProjects(response.data); // Initially, set filteredProjects to all projects
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleScroll = () => {
    // You can implement infinite scrolling or any other scrolling behavior here
  };

  const handleDomainFilterChange = (event) => {
    const selectedDomain = event.target.value;
    setSelectedDomain(selectedDomain);
    if (selectedDomain === '') {
      // If no domain is selected, show all projects
      setFilteredProjects(projects);
    } else {
      // Filter projects based on selected domain
      const filtered = projects.filter(project => project.projectDomain === selectedDomain);
      setFilteredProjects(filtered);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <h2>All Projects</h2>
        <div style={{ marginTop: '10px' }}>
          <Select
            value={selectedDomain}
            onChange={handleDomainFilterChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Filter by Domain
            </MenuItem>
            <MenuItem value="">All Domains</MenuItem>
            <MenuItem value="Full Stack Web Development">Full Stack Web Development</MenuItem>
            <MenuItem value="Data Engineering">Data Engineering</MenuItem>
            <MenuItem value="Data Science">Data Science</MenuItem>

            {/* Add more menu items for other domains */}
          </Select>
        </div><br />
        <Paper style={{ maxHeight: 300, overflow: 'auto' }}>
          <Table ref={tableRef}>
            <TableHead>
              <TableRow>
                <TableCell>Project ID</TableCell>
                <TableCell>Project Name</TableCell>
                <TableCell>Project Domain</TableCell>
                {/* Add more table headers as needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjects.map((project, index) => (
                <TableRow key={index} className={index % 2 === 0 ? 'oddrow' : ''}>
                  <TableCell>{project.projectId}</TableCell>
                  <TableCell>{project.projectName}</TableCell>
                  <TableCell>{project.projectDomain}</TableCell>
                  {/* Add more table cells for other project data */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default AllProjectsTable;
