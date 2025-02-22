const express= require('express');
const fs = require('fs');
const _ = require('lodash');
const app= express();

app.set('view engine','ejs');
app.set('views','./views');
app.listen(3000);
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
app.use((req,res)=>{
    res.status(404).render('404');  
});