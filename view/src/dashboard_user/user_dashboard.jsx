import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, IconButton, makeStyles, ThemeProvider, createMuiTheme, CssBaseline, Button, Divider, Toolbar, Typography } from '@material-ui/core';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FeedbackForm from '../feedback/feedback';
import Timesheet from '../timesheet/timesheet';
import CloseIcon from '@mui/icons-material/Close';
import UserContent from '../user_content/user_home';

const drawerWidth = 180;

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
    marginTop: theme.spacing(1.3)
  },
  websiteName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  closeIcon: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  }
}));

const Dashboard2 = () => {
  const classes = useStyles();
  const { userId } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTimesheet, setShowTimesheet] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showAdminLanding, setShowAdminLanding] = useState(false);
  const [showUserContent, setShowUserContent] = useState(false); // State to manage user content display
  const [userData, setUserData] = useState(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleTimesheetClick = () => {
    setShowTimesheet(true);
    setShowFeedbackForm(false);
    setShowAdminLanding(false);
    setShowUserContent(false); // Close user content when other options are clicked
  };

  const handleFeedbackClick = () => {
    setShowFeedbackForm(true);
    setShowTimesheet(false);
    setShowAdminLanding(false);
    setShowUserContent(false); // Close user content when other options are clicked
  };

  const handleCreateUserClick = () => {
    setShowAdminLanding(true);
    setShowUserContent(false); // Close user content when admin landing is displayed
  };

  const handleCloseAdminLanding = () => {
    setShowAdminLanding(false);
  };

  const handleProfileClick = () => {
    setShowUserContent(true); // Display user content when profile is clicked
  };
  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('authToken'); // Example: Remove authentication token
    // Redirect the user to the login page
    window.location.href = '/'; // Redirect using window.location.href
  };
  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const users = await response.json();
      setUserData(users);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const currentUser = userData && userData.find(user => user.id === userId);
  const userName = currentUser ? currentUser.name : '';

  const theme = createMuiTheme({
    typography: {
      fontFamily: '"Open Sans", sans-serif',
    },
    palette: {
      type: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#FF00FF',
      },
      secondary: {
        main: '#FFFFFF',
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
            <Typography variant="h5" className={classes.websiteName}>TimeNow</Typography>
            <div className={classes.profileContainer}>
              <PersonOutlineIcon className={classes.profileIcon} onClick={handleProfileClick} />
              <Typography variant="h6" className={classes.profileName}>{userName}</Typography>
            </div>
          </Toolbar>
          <Divider />
          <List>
            <ListItem button onClick={handleTimesheetClick}>
              <ListItemText primary="Timesheet" />
            </ListItem>
            <ListItem button onClick={handleFeedbackClick}>
              <ListItemText primary="Feedback" />
            </ListItem>
          </List>
          <Divider />
          <IconButton onClick={toggleTheme}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
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
            {showTimesheet && <Timesheet />}
            {showFeedbackForm && <FeedbackForm />}
            {showAdminLanding && (
              <>
                <AdminLanding setShowAdminLanding={setShowAdminLanding} />
                <IconButton className={classes.closeIcon} onClick={handleCloseAdminLanding}>
                  <CloseIcon />
                </IconButton>
              </>
            )}
            {showUserContent && <UserContent userName={userName} />} {/* Render UserContent component */}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard2;
