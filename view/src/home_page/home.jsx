import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import CreateProjectForm from '../project-creation/projects'; // Import the CreateProjectForm component
import AllUsersTable from '../all_users/all_users'; // Import the AllUsers component
import AllProjectsTable from '../all_projects/all_projects';
const HomeContent = ({ onAdminCreate, onCreateProjects }) => {
  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false); // State to control visibility of the form

  const handleCreateProjectButtonClick = () => {
    setShowCreateProjectForm(true); // Show the CreateProjectForm when the button is clicked
  };

  const handleCloseForm = () => {
    setShowCreateProjectForm(false);
  };

  return (
    <div>
      {!showCreateProjectForm && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
  <h1>Welcome to Tiempo!</h1>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Button variant="outlined" color="primary" onClick={onAdminCreate} style={{ width: '200px', height: '50px', fontSize: '16px', marginBottom: '10px' }}>Create User</Button>
    <Button variant="outlined" color="primary" onClick={handleCreateProjectButtonClick} style={{ width: '200px', height: '50px', fontSize: '16px' }}>Create Projects</Button>
  </div>
</div>


          <AllUsersTable />
          <AllProjectsTable/>
        </div>
      )}
       {showCreateProjectForm && (
        <CreateProjectForm onCreateProject={handleCreateProjectButtonClick} onClose={handleCloseForm} />
      )}
      
    </div>
  );
};

export default HomeContent;
