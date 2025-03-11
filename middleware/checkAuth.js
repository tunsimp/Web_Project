function checkAuth(req, res, next) {
    if (!req.session.username) {
      // Redirect to login page if not authenticated
      return res.redirect("/login");
    }
    // Proceed to the next middleware or route handler if authenticated
    next();
  }
  
  module.exports = checkAuth; // Export the middleware to be used in routes
  