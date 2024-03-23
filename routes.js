// routes/authRoutes.js
const express = require('express');
const User = require('../models/User'); // Adjust the path as needed
const bcrypt = require('bcryptjs');

const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
    const user = new User({ username, password });
    await user.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(500).send('Error registering new user');
  }
});

module.exports = router;
