// routes/indexRoutes.js
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const { createContainerController, deleteContainer} = require('../controllers/dockerController');

// Example: protected home route
router.get('/', checkAuth, (req, res) => {
  res.render('index');
});

// Example: about route
router.get('/about', checkAuth, (req, res) => {
  res.render('about', {
    stories: [
      "I'm 21 years old",
      "I have a lovely family and girlfriend",
      "I want to be a pentester"
    ]
  });
});

// Route that calls our Docker controller
router.get('/create-container/:imageName', checkAuth, createContainerController);
router.get('/delete-container',deleteContainer);
module.exports = router;
