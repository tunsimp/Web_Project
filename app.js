const express = require("express");
const fs = require("fs");
const _ = require("lodash");
const app = express();
const mysql = require("mysql2");

const Docker = require('dockerode');
const docker = new Docker({
  socketPath: '\\\\.\\pipe\\docker_engine'  // Windows named pipe
});


const pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "secacademy",
  })
  .promise();

app.use(express.urlencoded({ extended: true })); // Parses application/x-www-form-urlencoded
app.use(express.json()); // Parses application/json
app.set("view engine", "ejs");
app.set("views", "./views");
app.listen(3000);
console.log("app is running on port 3000");
app.use(express.static("public"));

const stories = [
  "im 21 year old",
  "i have an lovely family and girlfriend",
  "i want to be an pentester",
];

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/about", (req, res) => {
  res.render("about", { stories: stories });
});
app.get("/login", (req, res) => {
  res.render("login", (error = ""));
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  // Process the login here
  if (!username || !password) {
    return res.render("login", { error: "Please enter both username and password" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE user_name = ? AND user_password = ?", [username, password]);
    if (rows.length === 0) {
      return res.render("login", { error: "Invalid username or password" });
    } else {
      if (rows[0].user_role === "admin") {
        return res.render("admin");
      }
      res.render("index");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/register", (req, res) => {
  res.render("register", (error = ""));
});

app.post("/register", (req, res) => {
  const { username, password, repassword, email } = req.body;
  if (!username || !password || !repassword || !email) {
    return res.render("register", { error: "Please enter all fields" });
  }
  if (password !== repassword) {
    return res.render("register", { error: "Passwords are not the same" });
  }
  (async () => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM users WHERE user_name = ?",
        [username]
      );
      if (rows.length > 0) {
        return res.render("register", { error: "Username has already taken" });
      } else {
        await pool.query(
          "INSERT INTO users (user_name, user_password, user_email) VALUES (?, ?, ?)",
          [username, password, email]
        );
        res.render("login", { error: "Register successfully" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
  })();
});

app.get("/docker", (req, res) => {
  docker.listImages((err, images) => {
    if (err) {
      console.log('Error listing images:', err);
      return res.status(500).send("Error listing images");
    } else {
      // Collect the image details and send them as a single response
      let imageDetails = images.map(image => {
        return { id: image.Id, repoTags: image.RepoTags };
      });

      // Send the response once, with all the collected image details
      res.json(imageDetails);
    }
  });
});



app.use((req, res) => {
  res.status(404).render("404");
});
