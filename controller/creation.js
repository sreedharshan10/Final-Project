const express = require('express');
const cors = require('cors'); // Add this line to import the cors middleware
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Admin = require('../model/Admin');
const User = require('../model/User');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for CORS
app.use(cors()); // Use the cors middleware
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://srijayhem10:zTjtmPyN52dg9TOO@cluster0.hafz5co.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Function to send password reset email
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;
    const newUser = new User(userData);
    await newUser.save();

    // Send email
    sendEmail(userData.email, userData.name, newUser._id);

    res.status(200).json({ message: 'User data stored successfully' });
  } catch (error) {
    console.error('Error storing user data:', error);
    res.status(500).json({ message: 'Failed to store user data' });
  }
});

app.post('/api/admins', async (req, res) => {
  try {
    const adminData = req.body;
    const newAdmin = new Admin(adminData);
    await newAdmin.save();

    // Send email
    sendEmail(adminData.email, adminData.name, newAdmin._id);

    res.status(200).json({ message: 'Admin data stored successfully' });
  } catch (error) {
    console.error('Error storing admin data:', error);
    res.status(500).json({ message: 'Failed to store admin data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Function to send email
function sendEmail(email, name, userId) {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
      user: 'sreedharshan@jmangroup.com', // Replace with your Gmail email
      pass: 'Jman@600113', // Replace with your Gmail password
    },
  });

  // Construct email message
  const mailOptions = {
    from: 'sreedharshan@jmangroup.com',
    to: email,
    subject: 'Welcome to Tiempo',
    html: `
      <p>Hello ${name},</p>
      <p>You have been successfully registered on Tiempo.</p>
      <p>Use these credentials to reset your password and login to our website:</p>
      <p>Email: ${email}</p>
      <p>Password: ${userData.key || userData.password}</p>
      <p>The link to reset your password is:</p>
      <p>http://localhost:5173/Reset-Password/${userId}</p>
    `,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}