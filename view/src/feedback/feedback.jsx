import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Grid,
    createTheme,
    ThemeProvider, // Import ThemeProvider
} from '@mui/material';

function FeedbackForm() {
    const { userId } = useParams(); // Get userId from URL params
    const [timesheets, setTimesheets] = useState([]);
    const [feedbackIds, setFeedbackIds] = useState([]);
    const [selectedFeedbackId, setSelectedFeedbackId] = useState('');
    const [projectType, setProjectType] = useState('');
    const [feedbackFields, setFeedbackFields] = useState([]);
    const [projectId, setProjectId] = useState('');
    const [projectName, setProjectName] = useState('');

    useEffect(() => {
        // Fetch timesheets for the user when component mounts
        fetchTimesheets();
    }, []);

    // Function to fetch timesheets for the user from the server
    const fetchTimesheets = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/timesheets');
            const userTimesheets = response.data.filter(timesheet => timesheet.userId === userId);
            setTimesheets(userTimesheets);
            const uniqueFeedbackIds = [...new Set(userTimesheets.map((timesheet) => timesheet.feedbackId))];
            setFeedbackIds(uniqueFeedbackIds);
        } catch (error) {
            console.error('Error fetching timesheets:', error);
        }
    };

    // Function to handle feedback ID selection
    const handleFeedbackIdChange = async (e) => {
        const feedbackId = e.target.value;
        setSelectedFeedbackId(feedbackId);

        // Find the timesheet with the selected feedback ID
        const selectedTimesheet = timesheets.find((timesheet) => timesheet.feedbackId === feedbackId);

        if (selectedTimesheet) {
            const { projectId, projectName, projectType } = selectedTimesheet;
            setProjectType(projectType);
            setProjectId(projectId); // Assuming you have a state variable for projectId
            setProjectName(projectName); // Assuming you have a state variable for projectName
            const questionsCount = questions[selectedTimesheet.projectType].length;
            setFeedbackFields(Array.from({ length: questionsCount + 1 }, () => ''));
        } else {
            console.error('Timesheet not found for feedback ID:', feedbackId);
        }
    };

    // Function to fetch questions based on the project type
    const fetchQuestions = (projectType) => {
        const commonQuestions = [
            'Additional Comments: Please provide any additional comments or feedback here.',
        ];
        const projectQuestions = questions[projectType] || [];
        return [...projectQuestions, ...commonQuestions];
    };

    // Function to handle input changes and update state for feedback fields
    const handleFeedbackFieldChange = (index, value) => {
        const updatedFields = [...feedbackFields];
        updatedFields[index] = value;
        setFeedbackFields(updatedFields);
    };
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
    // Function to submit feedback
// Function to submit feedback
const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an object to store the feedback data
    const feedbackData = {
        userId: userId,
        projectId: projectId,
        projectName: projectName,
        projectType: projectType,
        feedbackId: selectedFeedbackId,
        numericalFeedback: {}, // Object to store numerical feedback questions and scores
        additionalComments: feedbackFields[fetchQuestions(projectType).length - 1] || '' // Additional comments
    };

    // Populate numerical feedback questions and scores
    if (projectType) {
        const numericalQuestions = fetchQuestions(projectType).slice(0, -1); // Exclude additional comments question
        numericalQuestions.forEach((question, index) => {
            const questionLabel = `Q${index + 1}`; // Create label like Q1, Q2, etc.
            feedbackData.numericalFeedback[questionLabel] = parseInt(feedbackFields[index], 10) || 0; // Parse score to integer, default to 0 if empty
        });
    }

    console.log('Input Feedback Data:', feedbackData); // Console log the input data

    try {
        const response = await fetch('http://localhost:3004/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData),
        });

        if (!response.ok) {
            throw new Error('Error submitting feedback');
        }

        const responseData = await response.json();
        alert('Feedback submitted successfully');
        window.location.reload();
        console.log('Feedback submitted successfully:', responseData);
    } catch (error) {
        console.error('Error submitting feedback:', error.message);
    }
};



    // Questions object
    const questions = {
        'Full Stack Web Development': [
            'Communication Effectiveness: On a scale of 1 to 10, how would you rate the effectiveness of communication among team members during the project?',
            'Team Environment Support: From 1 to 10, how supportive was the team environment throughout the project?',
            'Role Alignment Satisfaction: On a scale of 1 to 10, how well did you feel your role aligned with your skills and expertise?',
            'Professional Growth Opportunities: From 1 to 10, how much did team members feel they had opportunities to learn and grow professionally during the project?',
            'Recognition and Valuation: On a scale of 1 to 10, how much did team members feel their contributions were acknowledged and valued by the team?',
            'Work-Life Balance Satisfaction: From 1 to 10, how balanced did team members feel their work-life balance was during the project?',
            'Lead Feedback: On a scale of 1 to 10, how effectively did the lead handle this project?',
            'Technology Stack Suitability: On a scale of 1 to 10, how well-suited was the chosen technology stack for the project requirements?',
            'Frontend Development: On a scale of 1 to 10, how responsive and intuitive was the user interface developed for the frontend?',
            'Backend Development: On a scale of 1 to 10, how efficiently did the backend handle requests and manage data operations?',
            'Database Design and Optimization: On a scale of 1 to 10, how well-designed and optimized were the database schemas and queries for performance?',
            'Cross-Browser Compatibility and Performance: On a scale of 1 to 10, how compatible and performant was the application across different web browsers and devices?',
        ],
        'Data Engineering': [
            'Communication Effectiveness: On a scale of 1 to 10, how would you rate the effectiveness of communication among team members during the project?',
            'Team Environment Support: From 1 to 10, how supportive was the team environment throughout the project?',
            'Role Alignment Satisfaction: On a scale of 1 to 10, how well did you feel your role aligned with your skills and expertise?',
            'Professional Growth Opportunities: From 1 to 10, how much did team members feel they had opportunities to learn and grow professionally during the project?',
            'Recognition and Valuation: On a scale of 1 to 10, how much did team members feel their contributions were acknowledged and valued by the team?',
            'Work-Life Balance Satisfaction: From 1 to 10, how balanced did team members feel their work-life balance was during the project?',
            'Lead Feedback: On a scale of 1 to 10, how effectively did the lead handle this project?',
            'Data Pipeline Efficiency: On a scale of 1 to 10, how efficiently did the data pipeline process and transform raw data into usable formats for analysis?',
            'Scalability and Performance: From 1 to 10, how scalable and performant was the data processing infrastructure, considering potential increases in data volume and complexity?',
            'Data Quality and Integrity: On a scale of 1 to 10, how effectively were data quality checks and validation mechanisms implemented to ensure the integrity and accuracy of processed data?',
            'Tool Selection and Integration: From 1 to 10, how well-suited were the selected tools and technologies for data extraction, transformation, and loading (ETL) tasks, and how seamlessly were they integrated into the data pipeline?',
            'Monitoring and Maintenance: On a scale of 1 to 10, how robust was the monitoring and maintenance system for identifying and resolving issues in the data pipeline, ensuring uninterrupted data flow and system reliability?',
        ],
        'Data Science': [
            'Communication Effectiveness: On a scale of 1 to 10, how would you rate the effectiveness of communication among team members during the project?',
            'Team Environment Support: From 1 to 10, how supportive was the team environment throughout the project?',
            'Role Alignment Satisfaction: On a scale of 1 to 10, how well did you feel your role aligned with your skills and expertise?',
            'Professional Growth Opportunities: From 1 to 10, how much did team members feel they had opportunities to learn and grow professionally during the project?',
            'Recognition and Valuation: On a scale of 1 to 10, how much did team members feel their contributions were acknowledged and valued by the team?',
            'Work-Life Balance Satisfaction: From 1 to 10, how balanced did team members feel their work-life balance was during the project?',
            'Lead Feedback: On a scale of 1 to 10, how effectively did the lead handle this project?',
            'Model Performance: On a scale of 1 to 10, how accurate and reliable were the predictive models developed as part of the project, considering factors such as precision, recall, and F1 score?',
            'Feature Engineering: From 1 to 10, how effective was the feature engineering process in extracting relevant insights from raw data and improving the performance of machine learning models?',
            'Model Interpretability: On a scale of 1 to 10, how interpretable were the machine learning models used in the project, allowing stakeholders to understand the factors influencing predictions and decisions?',
            'Experimentation and Iteration: From 1 to 10, how well-structured and iterative was the experimentation process for testing and refining various machine learning algorithms and techniques?',
            'Business Impact: On a scale of 1 to 10, how significant was the business impact of the data science project in terms of driving actionable insights, optimizing processes, or improving decision-making?',
        ],
    };

    // Render the component
    return (
        <ThemeProvider theme={theme}>

        <Container maxWidth="md">
            <Typography variant="h4" style={{ marginTop: "5px", marginBottom: "0px", color: "midnightblue", textAlign: "center" }}>Feedback Form</Typography>
            <Typography variant="h6" style={{ color: "midnightblue", textAlign: "center" }}>Please provide your feedback below:</Typography><br />
            <Grid container justifyContent="center">
                <Grid item xs={12} sm={6}>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth style={{ marginBottom: "20px" }}>
                            <InputLabel>Select Feedback ID</InputLabel>
                            <Select
                                value={selectedFeedbackId}
                                onChange={handleFeedbackIdChange}
                            >
                                <MenuItem value="">-- Select Feedback ID --</MenuItem><br />

                                {feedbackIds.map((feedbackId) => (
                                    <MenuItem key={feedbackId} value={feedbackId}>{feedbackId}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {projectType && fetchQuestions(projectType).map((question, index) => (
                            <div key={index} style={{ marginBottom: "20px" }}>
                                <Typography variant="body1"><strong>{question.split(': ')[0]}:</strong> {question.split(': ')[1]}</Typography>
                                {index !== fetchQuestions(projectType).length - 1 ? (
                                    <FormControl fullWidth>
                                        <InputLabel>Select Score</InputLabel>
                                        <Select
                                            value={feedbackFields[index] || ''}
                                            onChange={(e) => handleFeedbackFieldChange(index, e.target.value)}
                                        >
                                            <MenuItem value="" disabled>Select Score</MenuItem>
                                            {[...Array(10)].map((_, score) => (
                                                <MenuItem key={score} value={score + 1}>{score + 1}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <TextField
                                        multiline
                                        fullWidth
                                        rows={4}
                                        label="Additional Comments"
                                        variant="outlined"
                                        value={feedbackFields[index] || ''}
                                        onChange={(e) => handleFeedbackFieldChange(index, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                        {!projectType && <Typography variant="body1">Please select a feedback ID to view questions.</Typography>}
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ marginTop: "20px", backgroundColor: "#FF00FF", color: "white", borderRadius: "5px" }}
                        >
                            Submit Feedback
                        </Button>
                    </form>
                </Grid>
            </Grid>
        </Container>
        </ThemeProvider>

    );
}

export default FeedbackForm;
