const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth.js'); // If you have a separate middleware file
const { createContainerWithRandomPort } = require('../controllers/dockerController');

// Home route (protected)
router.get('/', checkAuth, (req, res) => {
  res.render('index');
});

// About route (protected)
router.get('/about', checkAuth, (req, res) => {
  res.render('about', { stories: ["I'm 21 years old", "I have a lovely family and girlfriend", "I want to be a pentester"] });
});

router.get('/create-container/:imageName', async (req, res) => {
  const { imageName } = req.params;
  if (!imageName) {
    return res.status(400).json({ error: 'Image name is required' });
  }
  try {
    const randomPort = await createContainerWithRandomPort(imageName);
    res.status(200).json({
      message: `Container created successfully from image: ${imageName}`,
      randomPort: randomPort
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create or start container' });
  }
});
module.exports = router;
