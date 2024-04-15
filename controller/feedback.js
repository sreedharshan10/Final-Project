const express = require('express');
const mongoose = require('mongoose');
const Feedback = require('../model/Feedback');
const cors =require('cors');
const app = express();
app.use(express.json());
app.use(cors());
// Connect to MongoDB
// Connect to MongoDB
mongoose.connect('mongodb+srv://srijayhem10:zTjtmPyN52dg9TOO@cluster0.hafz5co.mongodb.net/Tiempo?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});


// Endpoint to handle feedback submission
// Endpoint to handle feedback submission
app.post('/api/feedback', async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        await feedback.save();
        res.status(201).send(feedback);
    } catch (error) {
        console.error('Error saving feedback to MongoDB:', error);
        res.status(500).send('Error saving feedback');
    }
});

// Start the server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
