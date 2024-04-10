const mongoose = require('mongoose');

const projectAllocationSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true
  },
  projectId: {
    type: String,
    required: true,
    unique: true
  },
  projectDomain: {
    type: String,
    required: true
  },
  userDetails: [{
    username: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    userRole: {
      type: String,
      required: true
    },
    userTasks: [String], // Array of tasks associated with the user
    userEmail: {
      type: String,
      required: true
    }
  }],
  teamLead: {
    type: String,
    required: true
  }
});

const ProjectAllocation = mongoose.model('ProjectAllocation', projectAllocationSchema);

module.exports = ProjectAllocation;
