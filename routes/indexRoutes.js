const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth.js'); // If you have a separate middleware file

// Home route (protected)
router.get('/', checkAuth, (req, res) => {
  res.render('index');
});

// About route (protected)
router.get('/about', checkAuth, (req, res) => {
  res.render('about', { stories: ["I'm 21 years old", "I have a lovely family and girlfriend", "I want to be a pentester"] });
});

module.exports = router;
