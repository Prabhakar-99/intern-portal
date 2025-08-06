const express = require('express');
const router = express.Router();
const Intern = require('../models/intern');
const bcrypt = require('bcrypt');

const saltRounds = 10;

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

    const hashedPassword = await bcrypt.hash(password, saltRounds);

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