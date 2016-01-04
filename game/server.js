// it's a setup
//server
var express = require('express');
var app = express();
var port = process.env.PORT || 9000;
var path = require('path');
//auth en database
var cookieParser = require('cookie-parser'); //needed for auth
var bodyParser = require('body-parser'); //get data from html forms
var mongoose = require('mongoose'); //read and write to mogodb
var passport = require('passport'); //for handeling login/signup
var session = require('express-session'); //persistent login
var configDB = require('./server/config/database.js');
//dev
var morgan = require('morgan'); //log requests to the console

//config
mongoose.connect(configDB.url); //connect to database
require('./server/config/passport.js')(passport); // passing passport for config. pass passing passport pass

//express config
//get post request logging in terminal
app.use(morgan('short'));
//parse cookies for login purposes
app.use(cookieParser());
//get data from html froms
app.use(bodyParser());

//passport reqs
app.use(session( {secret: 'projectgame'} )); //session secret
app.use(passport.initialize());
app.use(passport.session()); //persistent login so the user doesn't have log back in when switching pages

app.use(express.static(path.join(__dirname, '/app')));
require('./server/routes.js')(app, passport); //load the routes and pass the app and passport configs

//start express server
var server = app.listen(port);
console.log('aim all firepower at localhost:' + port);

///////////////////////////////////////
///////////// GAME SERVER /////////////
///////////////////////////////////////
require('./server/gameserver.js')(server);
