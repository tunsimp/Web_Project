const bcrypt = require('bcryptjs');
const pool = require('../config/db'); // Import database configuration

exports.login = async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.render("login", { error: "Please enter both username and password" });
    }
  
    try {
      const [rows] = await pool.query("SELECT * FROM Users WHERE user_name = ?", [username]);
  
      if (rows.length === 0 || !(await bcrypt.compare(password, rows[0].user_password))) {
        return res.render("login", { error: "Invalid username or password" });
      }
      console.log('Rows:',rows);
      // Set the session username
      req.session.username = username;
      req.session.userId = rows[0].user_id;
      req.session.containerId = '';
      console.log('Session:',req.session);
      // Redirect to the dashboard or home page after successful login
      if (rows[0].user_role === "admin") {
        return res.redirect("/admin"); // Redirect to admin dashboard if the user is an admin
      }
  
      return res.redirect("/");  // Redirect to home page if it's a regular user
  
    } catch (err) {
      console.error('Login Error:',err);
      return res.status(500).send("Internal Server Error");
    }
  };
  
exports.register = async (req, res) => {
  const { username, password, repassword, email } = req.body;

  if (password !== repassword) {
    return res.render('register', { error: 'Passwords do not match' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM Users WHERE user_name = ?', [username]);

    if (rows.length > 0) {
      return res.render('register', { error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO Users (user_name, user_password, user_email) VALUES (?, ?, ?)', 
      [username, hashedPassword, email]);

    return res.render('login', { error: 'Registration successful! Please login.' });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};
