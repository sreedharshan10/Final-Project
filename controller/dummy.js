const express = require('express');
const mongoose = require('mongoose');
const ProjectAllocation = require('../model/Allocation');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://srijayhem10:zTjtmPyN52dg9TOO@cluster0.hafz5co.mongodb.net/Tiempo?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));


  app.get('/api/project-allocations', async (req, res) => {
    try {
      const allocation = await ProjectAllocation.find(); // Fetch all users from the database
      res.status(200).json(allocation); // Send the users as JSON response
    } catch (error) {
      console.error('Error fetching allocations:', error);
      res.status(500).json({ message: 'Failed to fetch allocations' });
    }
  });
  


// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'sreedharshan@jmangroup.com',
    pass: 'Jman@600113'
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

    // Send emails to users sequentially
    for (const user of userDetails) {
      const mailOptions = {
        from: 'sreedharshan@jmangroup.com',
        to: user.userEmail,
        subject: `You have been included in ${projectName}`,
        html: `
          <p>Hello ${user.username},</p>
          <p>You have been included in the project ${projectName} as ${user.userRole}.</p>
          <p>Your team lead will be ${teamLead}.</p>
          <p>These are your tasks:</p>
          <ul>
            ${user.userTasks.map((task, index) => `<li>Task ${index + 1}: ${task}</li>`).join('')}
          </ul>
          <p>Login to Tiempo to start entering your timesheets.</p>
        `
      };

      // Send email
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${user.userEmail}`);
    }

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
