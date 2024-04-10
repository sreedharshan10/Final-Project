const express = require('express');
const mongoose = require('mongoose');
const ProjectAllocation = require('../model/Allocation');
const cors=require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
const nodemailer= require('nodemailer')
app.use(cors())
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://srijayhem10:zTjtmPyN52dg9TOO@cluster0.hafz5co.mongodb.net/Tiempo?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

  app.get('/api/project-allocations', async (req, res) => {
    try {
      const users = await User.find(); // Fetch all users from the database
      res.status(200).json(users); // Send the users as JSON response
    } catch (error) {
      console.error('Error fetching allocations:', error);
      res.status(500).json({ message: 'Failed to fetch allocations' });
    }
  });
  



// Define route for creating project allocations
app.post('/api/project-allocations', async (req, res) => {
  try {
    const { projectName, projectId, projectDomain, userDetails, teamLead } = req.body;

    // Create a new project allocation document
    const projectAllocation = new ProjectAllocation({
      projectName,
      projectId,
      projectDomain,
      userDetails,
      teamLead
    });

    // Save the project allocation document to the database
    await projectAllocation.save();

    // Respond with success message
    res.status(201).json({ message: 'Project allocation created successfully' });
  } catch (error) {
    console.error('Error creating project allocation:', error);
    // Respond with error message
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
