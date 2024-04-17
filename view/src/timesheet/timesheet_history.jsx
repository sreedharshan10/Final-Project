import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(1),
    width: 360, // Set fixed width for the card
    height: 710, // Set fixed height for the card
    border: '2px solid pink', // Border color
    borderRadius: theme.spacing(1), // Border radius
    display: 'flex', // Set display to flex
    flexDirection: 'column', // Align items vertically
    justifyContent: 'center', // Align items horizontally
    alignItems: 'center', // Center align text
  },
  projectName: {
    color: 'blue', // Blue color for project name
  },
}));

const TimesheetHistory = () => {
  const [timesheets, setTimesheets] = useState([]);
  const { userId } = useParams();
  const classes = useStyles();

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        const response = await fetch(`http://localhost:3002/api/timesheets`);
        if (!response.ok) {
          throw new Error('Failed to fetch timesheet data');
        }
        const data = await response.json();
        // Filter timesheets based on userId
        const filteredTimesheets = data.filter(timesheet => timesheet.userId === userId);
        setTimesheets(filteredTimesheets);
      } catch (error) {
        console.error('Error fetching timesheet data:', error);
      }
    };

    fetchTimesheets();
  }, [userId]);

  return (
    <div>
      <h2>Timesheet History</h2>
      <Grid container spacing={3} justifyContent="center"> {/* Center align the grid */}
        {timesheets.map((timesheet) => (
          <Grid item key={timesheet.timesheetId} xs={12} sm={6} md={4}>
            <div className={classes.card}>
              <p>Timesheet ID: {timesheet.timesheetId}</p>
              <p className={classes.projectName}>{timesheet.projectName}</p>
              <p>Project Type: {timesheet.projectType}</p>
              <p>Project ID: {timesheet.projectId}</p>
              <p>Task: {timesheet.task}</p>
              <p>Week Start Date: {timesheet.weekStartDate}</p>
              <p>Week End Date: {timesheet.weekEndDate}</p>
              <p>Total Hours: {timesheet.totalHours}</p>
              <p>Hours:</p>
              <ul>
                <li>Monday: {timesheet.hours.mon}</li>
                <li>Tuesday: {timesheet.hours.tue}</li>
                <li>Wednesday: {timesheet.hours.wed}</li>
                <li>Thursday: {timesheet.hours.thu}</li>
                <li>Friday: {timesheet.hours.fri}</li>
                <li>Saturday: {timesheet.hours.sat}</li>
                <li>Sunday: {timesheet.hours.sun}</li>
              </ul>
              <p>Comment: {timesheet.comment}</p>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default TimesheetHistory;
