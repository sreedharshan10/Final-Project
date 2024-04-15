import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, makeStyles, ThemeProvider, CssBaseline, Button, Divider, Toolbar, Typography } from '@material-ui/core';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FeedbackForm from '../feedback/feedback';
import Timesheet from '../timesheet/timesheet';
import Allocation from '../allocation/allocation';
import HomeContent from '../home_page/home';
import AdminLanding from '../landing_page/admin_landing';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { createTheme } from '@material-ui/core/styles';

const drawerWidth = 160;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#7E57C2',
    color: 'white',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: theme.spacing(1),
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  profileIcon: {
    marginRight: theme.spacing(0),
    fontSize: 32,
    marginTop: theme.spacing(),
    marginLeft: theme.spacing(0.5)
  },
  profileName: {
    fontSize: 16,
    marginLeft: theme.spacing(0), 
    marginTop: theme.spacing(1.3),
    fontFamily: 'Montserrat, sans-serif', // Montserrat font
  },
  websiteLogo: {
    width: '100%',
    height: 'auto',
  },
  closeIcon: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  }
}));

const Dashboard1 = () => {
  const classes = useStyles();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTimesheet, setShowTimesheet] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showAllocation, setShowAllocation] = useState(false);
  const [showHomeContent, setShowHomeContent] = useState(true);
  const [showAdminLanding, setShowAdminLanding] = useState(false); // Add state for AdminLanding
  const navigate = useNavigate(); // Initialize useNavigate hook

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleTimesheetClick = () => {
    setShowTimesheet(true);
    setShowFeedbackForm(false);
    setShowAllocation(false);
    setShowHomeContent(false);
    setShowAdminLanding(false); // Close AdminLanding when other options are clicked
  };

  const handleFeedbackClick = () => {
    setShowFeedbackForm(true);
    setShowTimesheet(false);
    setShowAllocation(false);
    setShowHomeContent(false);
    setShowAdminLanding(false); // Close AdminLanding when other options are clicked
  };

  const handleAllocationClick = () => {
    setShowAllocation(true);
    setShowTimesheet(false);
    setShowFeedbackForm(false);
    setShowHomeContent(false);
    setShowAdminLanding(false); // Close AdminLanding when other options are clicked
  };

  const handleHomeClick = () => {
    setShowHomeContent(true);
    setShowTimesheet(false);
    setShowFeedbackForm(false);
    setShowAllocation(false);
    setShowAdminLanding(false); // Close AdminLanding when other options are clicked
  };

  const handleCreateUserClick = () => {
    setShowHomeContent(false); // Hide HomeContent
    setShowAdminLanding(true); // Show AdminLanding
  };

  const handleCloseAdminLanding = () => {
    setShowHomeContent(true); // Show HomeContent
    setShowAdminLanding(false); // Hide AdminLanding
  };

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('authToken'); // Example: Remove authentication token
    // Redirect the user to the login page
    navigate('/'); // Navigate to home page
  };
  

  const paletteType = isDarkMode ? 'dark' : 'light';

  const theme = createTheme({
    typography: {
      fontFamily: '"Montserrat", sans-serif', // Montserrat font
    },
    palette: {
      type: paletteType,
      primary: {
        main: '#FF00FF',
      },
      secondary: {
        main: '#FFFFFF',
      },
      // Define colors for light mode
      light: {
        primary: '#FF00FF',
        secondary: '#FFFFFF',
      },
      // Define colors for dark mode
      dark: {
        primary: '#00FF00',
        secondary: '#000000',
      },
    },
  });

  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar className={classes.toolbar}>
            <img src="C:\Users\ASUS\OneDrive\Desktop\Final-Project\assets\Screenshot_2024-04-16_011818-transformed-removebg-preview.png" alt="Website Logo" className={classes.websiteLogo} />
            <div className={classes.profileContainer}>
              <PersonOutlineIcon className={classes.profileIcon} />
              <Typography variant="h6" className={classes.profileName}>Your Profile Name</Typography>
            </div>
          </Toolbar>
          <Divider />
          <List>
            <ListItem button onClick={handleHomeClick}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button onClick={handleAllocationClick}>
              <ListItemText primary="Allocation" />
            </ListItem>
          </List>
          <Divider />
          <IconButton onClick={toggleTheme}>
            {isDarkMode ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
          <Divider />
          <List>
            <ListItem>
              <Button variant="contained" color="primary" onClick={handleLogout}>
                Logout
              </Button>
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div>
            {showHomeContent && <HomeContent onAdminCreate={handleCreateUserClick} />}
            {showTimesheet && <Timesheet />}
            {showFeedbackForm && <FeedbackForm />}
            {showAllocation && <Allocation />}
            {showAdminLanding && (
              <>
                <AdminLanding setShowAdminLanding={setShowAdminLanding} />
                <IconButton className={classes.closeIcon} onClick={handleCloseAdminLanding}>
                  <CloseIcon />
                </IconButton>
              </>
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard1;
