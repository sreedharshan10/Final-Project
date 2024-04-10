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
          <h1>Welcome to TimeNow!</h1>
          <p>Welcome admin, bla bla bla...</p>
          <div>
            <Button variant="contained" color="primary" onClick={onAdminCreate}>Create User</Button>
            <br />
            <br />
            <Button variant="contained" color="primary" onClick={handleCreateProjectButtonClick}>Create Projects</Button>
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
