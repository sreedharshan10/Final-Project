const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: String,
    projectId: String,
    projectName: String,
    projectType: String,
    feedbackId: String,
    numericalFeedback: Object,
    additionalComments: String
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
