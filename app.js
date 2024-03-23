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

// Route for the login page
app.get('/login', (req, res) => {
  res.send('<form method="post"><input type="text" name="username"/><input type="password" name="password"/><button type="submit">Login</button></form>');
});

// Handling login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.findOne({ username: username }, (err, user) => {
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      req.session.userId = user._id; // Set user id in session
      res.redirect('/dashboard');
    } else {
      res.send('Login failed: invalid username or password.');
    }
  });
});

// Route for the dashboard
app.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.status(403).send('Not authorized. Please login first.');
  }
  res.send('Welcome to your dashboard!');
});

// Registration route (add this section)
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check for existing user
    const userExists = await db.findOne({ username: username });
    if (userExists) {
      return res.status(400).send('Username already exists.');
    }
    // Hash password and create user
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = { username, passwordHash };
    await db.insert(user); // Make sure your DB has an insert method or adjust accordingly
    res.redirect('/login'); // Redirect to login after successful registration
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('Error during registration.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
