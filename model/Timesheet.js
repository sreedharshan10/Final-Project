const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
    userId: String,
    projectType: String,
    projectId: String,
    projectName: String,
    task: String,
    comment: String,
    hours: Object,
    totalHours: Number,
    timesheetId: String,
    feedbackId: String,
    weekStartDate: Date, // Start date of the timesheet week
    weekEndDate: Date,   // End date of the timesheet week
});

const Timesheet = mongoose.model('Timesheet', timesheetSchema);

module.exports = Timesheet;
