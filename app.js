const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const indexRoutes = require('./routes/indexRoutes');
const checkAuth = require('./middleware/checkAuth'); // Import checkAuth middleware

const app = express();

// Set the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 * 60, secure: process.env.NODE_ENV === 'production' }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // If user is trying to access login or register page while already logged in, redirect to home
  if ((req.path === '/login' || req.path === '/register') && req.session.username) {
    return res.redirect('/'); // Redirect to home page if already logged in
  }
  
  // Check authentication for all routes except login/register
  if (req.path !== '/login' && req.path !== '/register' && !req.session.username) {
    return res.redirect('/login');  // Redirect to login if not authenticated
  }

  next();  // Proceed if authenticated or it's login/register route
});

// Use routes
app.use(authRoutes);
app.use('/', indexRoutes);

// Handle 404 if route is not defined
app.use((req, res) => {
  res.status(404).render('404');
});

// Start the server
const port = process.env.PORT || 443;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
