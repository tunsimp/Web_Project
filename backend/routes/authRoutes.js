const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { deleteContainer } = require('../controllers/dockerController');

// Login routes

router.get('/login', (req, res) => {
  res.render('login', { error: '' });
});

router.post('/login', authController.login);  // Call the login controller

// Register routes
router.get('/register', (req, res) => {
  res.render('register', { error: '' });
});

router.post('/register', authController.register);  // Call the register controller

router.get('/logout',deleteContainer, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');  // Redirect to login page after logout
  });
});
module.exports = router;
