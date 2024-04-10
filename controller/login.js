const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('../model/User');
const Admin = require('../model/Admin');
const cors= require('cors')
// Middleware for parsing JSON bodies
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://srijayhem10:zTjtmPyN52dg9TOO@cluster0.hafz5co.mongodb.net/Tiempo?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// User login endpoint
app.post('/api/user/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    // If login successful, you can generate a JWT token and send it back to the client
    res.status(200).json({ message: 'User logged in successfully' });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  const { email, key } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    if (admin.key !== key) {
      return res.status(401).json({ message: 'Invalid key' });
    }
    // If login successful, you can generate a JWT token and send it back to the client
    res.status(200).json({ message: 'Admin logged in successfully' });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
