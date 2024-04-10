import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, makeStyles, ThemeProvider, createMuiTheme, CssBaseline, Button, Divider, Toolbar, Typography } from '@material-ui/core';
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

const Dashboard1 = () => {
  const classes = useStyles();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTimesheet, setShowTimesheet] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showAllocation, setShowAllocation] = useState(false);
  const [showHomeContent, setShowHomeContent] = useState(true);
  const [showAdminLanding, setShowAdminLanding] = useState(false); // Add state for AdminLanding

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
              <PersonOutlineIcon className={classes.profileIcon} />
              <Typography variant="h6" className={classes.profileName}>Your Profile Name</Typography>
            </div>
          </Toolbar>
          <Divider />
          <List>
            <ListItem button onClick={handleTimesheetClick}>
              <ListItemText primary="Timesheet" />
            </ListItem>
            <ListItem button onClick={handleAllocationClick}>
              <ListItemText primary="Allocation" />
            </ListItem>
            <ListItem button onClick={handleFeedbackClick}>
              <ListItemText primary="Feedback" />
            </ListItem>
            <ListItem button onClick={handleHomeClick}>
              <ListItemText primary="Home" />
            </ListItem>
            {/* Remove "Create User" option from sidebar */}
          </List>
          <Divider />
          <IconButton onClick={toggleTheme}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Divider />
          <List>
            <ListItem>
              <Button variant="contained" color="primary">
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
