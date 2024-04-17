import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  makeStyles,
  ThemeProvider,
  CssBaseline,
  Button,
  Divider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import NightsStayIcon from "@material-ui/icons/NightsStay";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FeedbackForm from "../feedback/feedback";
import Timesheet from "../timesheet/timesheet";
import CloseIcon from "@mui/icons-material/Close";
import UserContent from "../user_content/user_home";
import FeedbackHistory from "../feedback/feedback_history"; // Import FeedbackHistory component
import TimesheetHistory from "../timesheet/timesheet_history"; // Import TimesheetHistory component
import { createTheme } from "@material-ui/core/styles";
import logo from "../assets/logo.png";

const drawerWidth = 160;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#7E57C2",
    color: "white",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: theme.spacing(1),
  },
  profileContainer: {
    display: "flex",
    alignItems: "center",
  },
  profileIcon: {
    marginRight: theme.spacing(0),
    fontSize: 32,
    marginTop: theme.spacing(),
    marginLeft: theme.spacing(0.5),
  },
  profileName: {
    fontSize: 16,
    marginLeft: theme.spacing(0),
    marginTop: theme.spacing(1.3),
    fontFamily: "Montserrat, sans-serif",
  },
  websiteName: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    fontFamily: "Montserrat, sans-serif",
  },
  closeIcon: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
}));

const Dashboard2 = () => {
  const classes = useStyles();
  const { userId } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTimesheet, setShowTimesheet] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showAdminLanding, setShowAdminLanding] = useState(false);
  const [showUserContent, setShowUserContent] = useState(false);
  const [showFeedbackHistory, setShowFeedbackHistory] = useState(false); // State for showing feedback history
  const [showTimesheetHistory, setShowTimesheetHistory] = useState(false); // State for showing timesheet history
  const [userData, setUserData] = useState(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleTimesheetClick = () => {
    setShowTimesheet(true);
    setShowFeedbackForm(false);
    setShowAdminLanding(false);
    setShowUserContent(false);
    // Close feedback history when timesheet is clicked
    setShowFeedbackHistory(false);
    setShowTimesheetHistory(false);
  };

  const handleFeedbackClick = () => {
    setShowFeedbackForm(true);
    setShowTimesheet(false);
    setShowAdminLanding(false);
    setShowUserContent(false);
    // Close timesheet history when feedback is clicked
    setShowFeedbackHistory(false);
    setShowTimesheetHistory(false);
  };

  const handleFeedbackHistoryClick = () => {
    setShowFeedbackHistory(true);
    setShowTimesheetHistory(false);
    setShowTimesheet(false);
    setShowFeedbackForm(false); // Close timesheet history when feedback history is clicked
  };

  const handleTimesheetHistoryClick = () => {
    setShowTimesheetHistory(true);
    setShowFeedbackHistory(false);
    setShowTimesheet(false);
    setShowFeedbackForm(false);
    // Close feedback history when timesheet history is clicked
  };

  const handleCreateUserClick = () => {
    setShowAdminLanding(true);
    setShowUserContent(false);
  };

  const handleCloseAdminLanding = () => {
    setShowAdminLanding(false);
  };

  const handleProfileClick = () => {
    setShowUserContent(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const users = await response.json();
      setUserData(users);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const currentUser = userData && userData.find((user) => user.id === userId);
  const userName = currentUser ? currentUser.name : "";

  const theme = createTheme({
    typography: {
      fontFamily: '"Montserrat", sans-serif',
    },
    palette: {
      type: isDarkMode ? "dark" : "light",
      primary: {
        main: "#FF00FF",
      },
      secondary: {
        main: "#FFFFFF",
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
            <img
              src={logo}
              alt="Website Logo"
              className={classes.websiteLogo}
              style={{ width: "140px", marginTop: "140px" }}
            />
            <div className={classes.profileContainer} style={{marginTop: "-10px"}}>
              <PersonOutlineIcon
                className={classes.profileIcon}
                onClick={handleProfileClick}
              />
              <Typography variant="h6" className={classes.profileName}>
                {userName}
              </Typography>
            </div>
            <br />
            <br />
            <br />
          </Toolbar>
          <br />
          <List style={{marginTop : '60px'}}>
            <Divider />
            <ListItem button onClick={handleTimesheetClick}>
              <ListItemText primary="Timesheet" />
            </ListItem>
            <ListItem button onClick={handleFeedbackClick}>
              <ListItemText primary="Feedback" />
            </ListItem>
            <ListItem button onClick={handleFeedbackHistoryClick}>
              {" "}
              {/* Feedback History list item */}
              <ListItemText primary="Feedback History" />
            </ListItem>
            <ListItem button onClick={handleTimesheetHistoryClick}>
              {" "}
              {/* Timesheet History list item */}
              <ListItemText primary="Timesheet History" />
            </ListItem>
          </List>
          <Divider />
          <IconButton onClick={toggleTheme}>
            {isDarkMode ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
          <Divider />
          <List>
            <ListItem>
              <Button
                variant="contained"
                style={{ marginTop: "130px", marginLeft: "15px" }}
                color="primary"
                onClick={handleLogout}
              >
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
                <IconButton
                  className={classes.closeIcon}
                  onClick={handleCloseAdminLanding}
                >
                  <CloseIcon />
                </IconButton>
              </>
            )}
            {showUserContent && <UserContent userName={userName} />}
            {showFeedbackHistory && <FeedbackHistory userId={userId} />}{" "}
            {/* Render FeedbackHistory component */}
            {showTimesheetHistory && <TimesheetHistory userId={userId} />}{" "}
            {/* Render TimesheetHistory component */}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard2;
