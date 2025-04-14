const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const indexRoutes = require('./routes/indexRoutes');
const checkAuth = require('./middleware/checkAuth');

const app = express();

// Set up CORS options
const corsOptions = {
  origin: 'http://localhost:3000',  // Allow only the frontend's URL
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type',
};

// Enable CORS
app.use(cors(corsOptions));

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
  if ((req.path === '/login' || req.path === '/register') && req.session.username) {
    return res.redirect('/');
  }
  
  if (req.path !== '/login' && req.path !== '/register' && !req.session.username) {
    return res.redirect('/login');
  }

  next();
});

// Use routes
app.use(authRoutes);
app.use('/', indexRoutes);

// Handle 404 if route is not defined
app.use((req, res) => {
  res.status(404).render('404');
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port localhost:${port}`);
});
