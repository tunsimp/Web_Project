const http = require('http');
const fs = require('fs');
const _ = require('lodash');
const server = http.createServer((req, res) => {
    const randnum = _.random(0,20);
    console.log(randnum);
    res.setHeader('Content-Type', 'text/html');
    let path = './views/';
    switch(req.url){
        case '/':
            path += 'index.html';
            res.statusCode=200;
            break;
        case '/about':
            path += 'about.html';
            res.statusCode=200;
            break;
        default:
            path += '404.html';
            res.statusCode=404;
            break;
    }
    fs.readFile(path,(err,data)=>{
        if (err){
            console.log(err);
            res.end();
        }
        else{
            res.write(data);
            res.statusCode=200;
            res.end();
        }
    })

});


server.listen(3000, 'localhost', () => {
    console.log('Server is running on http://localhost:3000');
});