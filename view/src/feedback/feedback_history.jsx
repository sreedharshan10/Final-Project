import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, makeStyles, createTheme, ThemeProvider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(1),
    width: 300, // Set fixed width for the card
    height: 600, // Set fixed height for the card
    border: '2px solid pink', // Border color
    borderRadius: theme.spacing(1), // Border radius
  },
  projectName: {
    color: 'blue', // Pink color for project name
  },
}));

const FeedbackHistory = () => {
  const { userId } = useParams(); // Get user ID from URL params
  const [feedbacks, setFeedbacks] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`http://localhost:3004/api/feedback?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch feedback data');
        }
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      }
    };

    fetchFeedbacks();
  }, [userId]);

  // Filter feedbacks based on userId
  const filteredFeedbacks = feedbacks.filter(feedback => feedback.userId === userId);

  // Define the theme
  const theme = createTheme({
    typography: {
      fontFamily: 'Montserrat, sans-serif',
    },
    palette: {
      primary: {
        main: '#FF00FF', // Primary color
      },
      secondary: {
        main: '#FFFFFF', // Secondary color
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div>
        <h2>Feedback History</h2>
        <Grid container spacing={2}>
          {filteredFeedbacks.map((feedback) => (
            <Grid item xs={12} sm={6} md={4} key={feedback.feedbackId}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h6" className={classes.projectName}>{` ${feedback.projectName}`}</Typography>
                  <Typography variant="body1">{`Feedback ID: ${feedback.feedbackId}`}</Typography>
                  <Typography variant="body2">{`Project Type: ${feedback.projectType}`}</Typography>
                  <Typography variant="body2">{`Project ID: ${feedback.projectId}`}</Typography>
                  <Typography variant="body2">{`Comments: ${feedback.additionalComments}`}</Typography>

                  <Typography variant="body2">Numerical Feedback:</Typography>
                  <ul>
                    {Object.entries(feedback.numericalFeedback).map(([question, score]) => (
                      <li key={question}>
                        <Typography variant="body2">{`${question}: ${score}`}</Typography>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default FeedbackHistory;
