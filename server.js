var express = require('express');
var env = require('dotenv').config()
var ejs = require('ejs');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
// var bcrypt=require("bcrypt");
var md5=require("md5")



app.use(session({
  secret: 'ye secret hai kisi ko batana mat',
  resave: true,
  saveUninitialized: false,
}));


app.set('views', path.join(__dirname, 'views'));
// app.set('profiles', path.join(__dirname, 'profiles'));
app.set('view engine', 'ejs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

var index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('on my way...');
});
