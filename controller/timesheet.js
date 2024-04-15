const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Timesheet = require('../model/Timesheet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://srijayhem10:zTjtmPyN52dg9TOO@cluster0.hafz5co.mongodb.net/Tiempo?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Function to generate unique timesheet ID
async function generateTimesheetId() {
    const totalTimesheets = await Timesheet.countDocuments();
    const nextId = totalTimesheets + 1;
    return 'TS' + nextId.toString().padStart(2, '0');
}

async function generateFeedbackId() {
    const totalFeedbacks = await Timesheet.countDocuments();
    const nextId = totalFeedbacks + 1;
    return 'F' + nextId.toString().padStart(2, '0');
}

// Endpoint to get all timesheets
app.get('/api/timesheets', async (req, res) => {
    try {
        const timesheets = await Timesheet.find();
        res.json(timesheets);
    } catch (error) {
        console.error('Error fetching timesheets:', error);
        res.status(500).json({ error: 'Failed to fetch timesheets' });
    }
});

// Endpoint to create a new timesheet
app.post('/api/timesheets', async (req, res) => {
    try {
        const timesheetData = req.body;
        const timesheetId = await generateTimesheetId();
        const feedbackId = await generateFeedbackId(timesheetId);
        const timesheet = new Timesheet({ ...timesheetData, timesheetId, feedbackId });
        const savedTimesheet = await timesheet.save();
        res.status(201).json(savedTimesheet);
    } catch (error) {
        console.error('Error creating timesheet:', error);
        res.status(400).json({ error: 'Failed to create timesheet' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
