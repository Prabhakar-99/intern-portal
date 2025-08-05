const express = require('express');
const router = express.Router();
const Intern = require('../models/intern');

function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login');
}

// Dashboard route
router.get('/dashboard', isAuthenticated, async (req, res) => {
  const user = req.session.user;

  if (user.role === 'admin') {
    const interns = await Intern.find();
    // return res.render('adminDashboard', { interns });  
    return res.render('dashboard', { user, interns });
  }

  const referralCode = `${user.username}2025`;
  const totalDonations = 42;
  const rewards = ['Bronze Badge', 'Early Access', 'Free T-shirt'];

  res.render('dashboard', {
    user,
    referralCode,
    totalDonations,
    rewards
  });
});
// Leaderboard route
router.get('/leaderboard', isAuthenticated, (req, res) => {
  res.render('leaderboard');
});

module.exports = router;