const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Admin = require('../model/Admin');
const User = require('../model/User');
const Project = require('../model/Projects')
const bcrypt = require('bcryptjs');

 

const app = express();

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://srijayhem10:zTjtmPyN52dg9TOO@cluster0.hafz5co.mongodb.net/Tiempo?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(bodyParser.json());
app.use(cors());


app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users); // Send the users as JSON response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.get('/api/projects', async (req,res)=>{ 
  try{
    const projects= await Project.find();
    res.status(200).json(projects);
  } catch (error){
    console.error('Error in fetching projects.',error);
    res.status(500).json({message : 'Failed to fetch projects'})
  }
});

// Endpoint to create a new project
app.post('/api/projects', async (req, res) => {
  try {
    const projectData = req.body;
    const newProject = new Project(projectData);
    await newProject.save();
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Failed to create project' });
  }
});

app.post('/api/user', async (req, res) => {
  try {
    const userData = req.body;
    const newUser = new User(userData);
    await newUser.save();

    // Send email
    sendEmail(userData.email, userData.name, newUser._id, null, userData);

    res.status(200).json({ message: 'User data stored successfully' });
  } catch (error) {
    console.error('Error storing user data:', error);
    res.status(500).json({ message: 'Failed to store user data' });
  }
});

app.post('/api/admin', async (req, res) => {
  try {
    const adminData = req.body;
    const newAdmin = new Admin(adminData);
    await newAdmin.save();

    // Send email
    sendEmail(adminData.email, adminData.name, null, newAdmin._id, adminData);

    res.status(200).json({ message: 'Admin data stored successfully' });
  } catch (error) {
    console.error('Error storing admin data:', error);
    res.status(500).json({ message: 'Failed to store admin data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function sendEmail(email, name, userId, adminId, userData) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Outlook',
      auth: {
        user: 'sreedharshan@jmangroup.com',
        pass: 'Jman@600113',
      },
    });

    const mailOptions = {
      from: 'sreedharshan@jmangroup.com',
      to: email,
      subject: 'Welcome to Tiempo',
      html: `
        <p>Hello ${name},</p>
        <p>You have been successfully registered on Tiempo.</p>
        <p>Use these credentials to reset your password and login to our website:</p>
        <p>Email: ${email}</p>
        <p>Password: ${adminId ? userData.key : userData.password}</p>
        <p>The link to reset your password is:</p>
        <p>http://localhost:5173/Reset-Password/${userId || adminId}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}


app.post('/api/reset-password', async (req, res) => {
  try {
    const { id, newPassword, confirmPassword } = req.body;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password with the hashed password
    const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

    // Check if user exists
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send email notification
    // sendEmail(updatedUser.email, updatedUser.name, null, 'password-reset', null);

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
});
