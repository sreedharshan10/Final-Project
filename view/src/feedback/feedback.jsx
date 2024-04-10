import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function FeedbackForm() {
    const { userId } = useParams(); // Get userId from URL params
    const [timesheets, setTimesheets] = useState([]);
    const [feedbackIds, setFeedbackIds] = useState([]);
    const [selectedFeedbackId, setSelectedFeedbackId] = useState('');
    const [projectType, setProjectType] = useState('');
    const [feedbackFields, setFeedbackFields] = useState([]);

    useEffect(() => {
        // Fetch timesheets for the user when component mounts
        fetchTimesheets();
    }, []);

    // Function to fetch timesheets for the user from the server
    const fetchTimesheets = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/timesheets'); // Adjust the endpoint URL as needed
            setTimesheets(response.data);
            const uniqueFeedbackIds = [...new Set(response.data.map((timesheet) => timesheet.feedbackId))];
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
            setProjectType(selectedTimesheet.projectType);
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

    // Function to submit feedback
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add logic to submit feedback to server or perform other actions
        console.log('Project Type:', projectType);
        console.log('Feedback Fields:', feedbackFields);
        // Reset feedback state after submission if needed
        setSelectedFeedbackId('');
        setProjectType('');
        setFeedbackFields([]);
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
        <div className="content-container">
            <h1 style={{ marginTop: "5px", marginBottom: "0px", color: "midnightblue" }}>Feedback Form</h1>
            <div className="h3-row" style={{ color: "midnightblue" }}>
                <h3>Please provide your feedback below:</h3>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="feedback-form">
                    <div style={{ marginBottom: "10px" }}>
                        <label style={{ marginRight: "10px" }}>Select Feedback ID:</label>
                        <select value={selectedFeedbackId} onChange={handleFeedbackIdChange}>
                            <option value="">-- Select Feedback ID --</option>
                            {feedbackIds.map((feedbackId) => (
                                <option key={feedbackId} value={feedbackId}>{feedbackId}</option>
                            ))}
                        </select>
                    </div>
                    {projectType && fetchQuestions(projectType).map((question, index) => (
                        <div key={index} style={{ marginBottom: "10px" }}>
                            <strong>{question.split(': ')[0]}:</strong><br /> {question.split(': ')[1]}
                            <br />
                            <select
                                value={feedbackFields[index] || ''} // Ensure empty value for each field upon initialization
                                onChange={(e) => handleFeedbackFieldChange(index, e.target.value)}
                            >
                                <option value="" disabled>Select Score</option>
                                {[...Array(10)].map((_, score) => (
                                    <option key={score} value={score + 1}>{score + 1}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                    {projectType && (
                        <div style={{ marginBottom: "10px" }}>
                            <strong>Additional Comments:</strong><br />
                            <textarea
                                value={feedbackFields[fetchQuestions(projectType).length] || ''} // Field for comments is after the questions
                                onChange={(e) => handleFeedbackFieldChange(fetchQuestions(projectType).length, e.target.value)}
                                rows={4} cols={50}
                            ></textarea>
                        </div>
                    )}

                    {!projectType && <p>Please select a feedback ID to view questions.</p>}
                    <button type="submit" style={{ marginTop: "10px", padding: "8px 20px", fontSize: "16px", backgroundColor: "#FF00FF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Submit Feedback</button>
                </div>
            </form>
        </div>
    );
}

export default FeedbackForm;
