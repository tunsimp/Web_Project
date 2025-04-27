const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "127.0.0.1", // Database host
  user: "root", // Database username
  password: "root", // Database password
  database: "secacademy", // Database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
