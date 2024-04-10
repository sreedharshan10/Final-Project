import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './login_page.css'; // Import the CSS file for styling

const LoginPage = () => {
  const [loginMode, setLoginMode] = useState('user');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleModeChange = (mode) => {
    setLoginMode(mode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (loginMode === 'admin') {
      const adminEmail = e.target.elements.adminEmail.value;
      const adminId = e.target.elements.adminId.value;
      const adminKey = e.target.elements.adminKey.value;
  
      // Perform admin login logic here
      if (adminEmail && adminId && adminKey) {
        // Make an API call to authenticate the admin
        fetch('http://localhost:3003/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: adminEmail, adminId, adminKey }),
        })
        .then((response) => {
          if (response.ok) {
            // Admin authentication successful
            console.log('Admin login successful');
            // Redirect to admin landing page
            navigate('/admin'); // Use navigate to redirect
          } else {
            // Admin authentication failed
            console.error('Admin login failed');
            // Display error message to the user
          }
        })
        .catch((error) => {
          console.error('Error during admin login:', error);
          // Handle error
        });
      } else {
        // Handle case where some fields are empty
        console.error('Please fill in all fields');
        // Display error message to the user
      }
    } else if (loginMode === 'user') {
      const userEmail = e.target.elements.email.value;
      const userPassword = e.target.elements.password.value;
  
      // Perform user login logic here
      if (userEmail && userPassword) {
        // Make an API call to authenticate the user
        fetch('http://localhost:3003/api/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userEmail, password: userPassword }),
        })
        .then((response) => {
          if (response.ok) {
            // User authentication successful
            console.log('User login successful');
            // Fetch user data using the email to find the user ID
            return fetch('http://localhost:3000/api/users');
          } else {
            // User authentication failed
            console.error('User login failed');
            // Display error message to the user
            throw new Error('Invalid credentials');
          }
        })
        .then((response) => response.json())
        .then((userData) => {
          // Find the user ID corresponding to the provided email
          const user = userData.find((user) => user.email === userEmail);
          if (user) {
            const userId = user.id;
            // Redirect to user dashboard with user ID in the URL
            navigate(`/User/${userId}`);
          } else {
            console.error('User not found');
            // Handle case where user data is not found
          }
        })
        .catch((error) => {
          console.error('Error during user login:', error);
          // Handle error
        });
      } else {
        // Handle case where some fields are empty
        console.error('Please fill in all fields');
        // Display error message to the user
      }
    }
  };

  return (
    <div className="login-container"> {/* Apply the unique class here */}
      <h2>Login</h2>
      <div className="mode-selection">
        <label>
          <input
            type="radio"
            value="user"
            checked={loginMode === 'user'}
            onChange={() => handleModeChange('user')}
          />
          User
        </label>
        <label>
          <input
            type="radio"
            value="admin"
            checked={loginMode === 'admin'}
            onChange={() => handleModeChange('admin')}
          />
          Admin
        </label>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        {loginMode === 'user' && (
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" name="email" />
          </div>
        )}
        {loginMode === 'admin' && (
          <>
            <div className="form-group">
              <label htmlFor="adminEmail">Admin Email:</label>
              <input type="text" id="adminEmail" name="adminEmail" />
            </div>
            <div className="form-group">
              <label htmlFor="adminId">Admin ID:</label>
              <input type="text" id="adminId" name="adminId" />
            </div>
            <div className="form-group">
              <label htmlFor="adminKey">Admin Key:</label>
              <input type="password" id="adminKey" name="adminKey" />
            </div>
          </>
        )}
        {loginMode === 'user' && (
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" />
          </div>
        )}
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
