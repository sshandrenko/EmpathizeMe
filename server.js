const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// BodyParser Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/empathizeme', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Models
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

// Routes
app.post('/register', (req, res) => {
  // User registration logic here
});

app.post('/post', (req, res) => {
  // Posting logic here
});

app.post('/comment', (req, res) => {
  // Commenting logic here
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
