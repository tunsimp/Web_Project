const express= require('express');
const fs = require('fs');
const _ = require('lodash');
const app= express();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'secacademy'
}).promise();

app.use(express.urlencoded({ extended: true })); // Parses application/x-www-form-urlencoded
app.use(express.json()); // Parses application/json
app.set('view engine','ejs');
app.set('views','./views');
app.listen(3000);
console.log('app is running on port 3000');
app.use(express.static('public'));

const stories= ['im 21 year old','i have an lovely family and girlfriend','i want to be an pentester'];

app.get('/',(req,res)=>{
    res.render('index');
});
app.get('/about',(req,res)=>{
    res.render('about',{stories:stories});
});
app.get('/login',(req,res)=>{
    res.render('login');
});

app.post('/login', (req, res) => {
    const { first, password } = req.body;
    console.log(first, password);
    // Process the login here
    (async () => {
        try {
          const [rows] = await pool.query('SELECT * FROM users WHERE user_name = ? AND user_password = ?', [first, password]);
          if (rows.length === 0) {
            return res.status(401).send('Invalid username or password');
          }
          else{
            res.render('index');
          };
        } catch (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }
      })();
    });


app.use((req,res)=>{
    res.status(404).render('404');  
});
