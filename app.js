const express= require('express');
const app= express();
const fs = require('fs');
const _ = require('lodash');
app.listen(3000);
app.use(express.static('public'));
app.get('/',(req,res)=>{
    res.sendFile('./views/index.html',{root:__dirname});
});
app.get('/about',(req,res)=>{
    res.sendFile('./views/about.html',{root:__dirname});
});
app.get('/login',(req,res)=>{
    res.sendFile('./views/login.html',{root:__dirname});
});
app.use((req,res)=>{
    res.statusCode(404).sendFile('./views/404.html',{root:__dirname});
});