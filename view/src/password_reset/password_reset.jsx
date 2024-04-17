import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate hooks
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { TextField, Button, Typography, Container, CssBaseline, Grid } from '@material-ui/core';
import './pass.css';

const theme = createTheme({
  typography: {
    fontFamily: '"Monsterrat", sans-serif',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#FF00FF',
    },
    secondary: {
      main: '#FFFFFF',
    },
    text: {
      primary: '#FFFFFF', // White text color
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& $notchedOutline': {
            borderColor: '#FFFFFF', // White border color
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#FFFFFF', // White label color
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#FFFFFF', // White form label color
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&::placeholder': {
            color: '#FFFFFF', // White placeholder color
          },
        },
      },
    },
  },
});

function ResetPassword() {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const idd = pathParts[pathParts.length - 1];
  const [id, setId] = useState("");

  useEffect(() => {
    setId(idd);
  }, [idd]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3000/api/reset-password`, { id: idd, newPassword, confirmPassword });
      setMessage(response.data.message);
      setNewPassword('');
      setConfirmPassword('');

      // Display alert box upon successful password change
      window.alert(response.data.message);

      // Navigate to home page after user clicks OK
      navigate('/');
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Failed to reset password');
    }
  };

  return (
    <div className="background2" >
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div >
        <Container maxWidth="md">
          <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={12} sm={8}>
              <div className='container1'>
                <Typography variant="h2" component="h2" gutterBottom>
                  Reset Password
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="newPassword"
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="confirmPassword"
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Typography variant="body1" gutterBottom color="error">
                    {message}
                  </Typography>
                  <Button type="submit" fullWidth variant="contained" color="primary">
                    Reset Password
                  </Button>
                </form>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
    </ThemeProvider></div>
  );
}

export default ResetPassword;
