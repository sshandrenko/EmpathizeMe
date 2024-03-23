const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

// Simple route for login page (you'll likely use a template engine or serve static files in a real app)
app.get('/login', (req, res) => {
  res.send('<form method="post"><input type="text" name="username"/><input type="password" name="password"/><button type="submit">Login</button></form>');
});

// Handling login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.findOne({ username: username }, (err, user) => {
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      req.session.userId = user._id; // Set user id session
      res.redirect('/dashboard');
    } else {
      res.send('Login failed: invalid username or password.');
    }
  });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.status(403).send('Not authorized. Please login first.');
  }
  res.send('Welcome to your dashboard!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
