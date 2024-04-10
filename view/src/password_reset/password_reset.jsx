import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './pass.css';

function ResetPassword() {
  const { id } = useParams(); // Extract ID from the URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3002/api/reset-password/${id}`, { newPassword, confirmPassword });
      setMessage(response.data.message);
      // Clear password fields after successful password reset
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Failed to reset password');
    }
  };

  return (
    <div className='container1'>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="newPassword">New Password:</label>
        <input type="password" id="newPassword" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /><br />

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /><br />

        <p>{message}</p>

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
