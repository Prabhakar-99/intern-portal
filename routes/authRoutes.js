
const express = require('express');
const router = express.Router();
const Intern = require('../models/intern');
const bcrypt = require('bcrypt');


// GET: Login page
router.get('/', (req, res) => {
  res.redirect('/login');
});

//it renders the login pagr
router.get('/login', (req, res) => {
  res.render('login'); 
});


router.post('/login', async (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    req.flash('error', 'Username and password are required');
    return res.redirect('/login');
  }

  try {
    const user = await Intern.findOne({ username: new RegExp(`^${username}$`, 'i') });

    if (!user) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/login');
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role
    };

    req.flash('success', 'Login successful!');
    res.redirect('/dashboard');

  } catch (err) {
    console.error('Login error:', err);
    req.flash('error', 'Server error. Please try again.');
    res.redirect('/login');
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log('Logout error:', err);
      return res.redirect('/dashboard'); 
    }
    res.clearCookie('connect.sid');
    res.redirect('/login'); // i used this for bz it Redirect to login page after logout
  });
});


//register route 
// GET: Registration page
router.get('/register', (req, res) => {
  res.render('register');
});

// POST: Handle registration
router.post('/register', async (req, res) => {
  const { username, password, email, fullName } = req.body;

  if (!username || !password || !email || !fullName) {
    req.flash('error', 'All fields are required');
    return res.redirect('/register');
  }

  try {
    const existingUser = await Intern.findOne({ username: new RegExp(`^${username}$`, 'i') });
    if (existingUser) {
      req.flash('error', 'Username already exists');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newIntern = new Intern({
      username,
      password: hashedPassword,
      email,
      fullName,
      role: 'intern'
    });

    await newIntern.save();
    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err);
    req.flash('error', 'Registration failed');
    res.redirect('/register');
  }
});


module.exports = router;
