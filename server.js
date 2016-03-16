var express=require('express');
var app=express();
var router=express.Router();
var path=require('path');
// var router=express.Router();
var bodyPaser=require('body-parser');
var http = require('http');
var mongojs=require('mongojs');

var db = mongojs('mongodb://arun:123@ds023398.mlab.com:23398/heroku_461p1j1s', ['register']);

 
var port = Number(process.env.PORT || 3000)
var session = require('express-session');
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));




app.use('/', express.static(__dirname+'/public'));
app.use(require(path.join(__dirname+'/public/server/routers/auth.js')));


app.listen(port,function(){
})

