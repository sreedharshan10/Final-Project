// Import necessary modules
const express = require('express');
const router = express.Router();
const User = require('../model/User');
const Admin = require('../model/Admin');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to update user or admin password
mongoose.connect('mongodb+srv://srijayhem10:zTjtmPyN52dg9TOO@cluster0.hafz5co.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Endpoint to reset password
// Endpoint to reset password
router.post('/api/reset-password/:userId', async (req, res) => {
    try {
      const userId = req.params.userId; // Corrected from req.params._id to req.params.userId
      const { newPassword } = req.body;
  
      // Find the user by user ID
      let user = await User.findById(userId);
  
      // If user is not found, try finding admin
      if (!user) {
        user = await Admin.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      }
  
      // Update user's password and passwordChanged status
      user.password = newPassword;
      user.passwordChanged = 'yes'; // Set passwordChanged to 'yes'
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ error: 'Failed to update password' });
    }
  });
  