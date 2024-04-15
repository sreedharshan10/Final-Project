const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  projectDomain: {
    type: String,
    required: true,
  },
  projectTasks: {
    type: [String],
    required: true,
  },
  projectLead: {
    type: String,
    required: true,
  },
  leadUserId: { // New field for storing the userId of the project lead
    type: String,
    required: true,
  },
  projectStartDate: {
    type: Date,
    required: true,
  },
  projectEndDate: {
    type: Date,
    required: true,
  },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
