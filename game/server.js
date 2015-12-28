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
//get post request logging
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

//start server
var server = app.listen(port);
console.log('aim all firepower at localhost:' + port);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//////////////// GAME SOCKET LOGIC //////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

var counter = 0;
var BALL_SPEED = 30;
var WIDTH = 1280;
var HEIGHT = 720;
var TANK_INIT_HP = 100;
var BALL_DAMAGE = 20;

var io = require('socket.io')(server);

function GameServer(){
    this.tanks = [];
    this.balls = [];
    this.lastBallId = 0;
}

GameServer.prototype = {

    addTank: function(tank) {
        this.tanks.push(tank);
    },

    addBall: function(ball) {
        this.balls.push(ball);
    },

    removeTank: function(tankId) {
        this.tanks = this.tanks.filter( function(t){ return t.id != tankId; });
    },

    //Sync tank with new data received from a client
    syncTank: function(newTankData) {
        this.tanks.forEach( function(tank) {
            if(tank.id == newTankData.id) {
                tank.x = newTankData.x;
                tank.y = newTankData.y;
                tank.baseAngle = newTankData.baseAngle;
                tank.cannonAngle = newTankData.cannonAngle;
            }
        });
    },

    //The app has absolute control of the balls and their movement
    syncBalls: function() {
        var self = this;
        //Detect when ball is out of bounds
        this.balls.forEach( function(ball) {
            self.detectCollision(ball);

            if(ball.x < 0 || ball.x > WIDTH || ball.y < 0 || ball.y > HEIGHT) {
                ball.out = true;
            } else {
                ball.fly();
            }
        });
    },

    //Detect if ball collides with any tank
    detectCollision: function(ball) {
        var self = this;

        this.tanks.forEach( function(tank){
            if(tank.id != ball.ownerId && Math.abs(tank.x - ball.x) < 30 && Math.abs(tank.y - ball.y) < 30) {
                //Hit tank
                self.hurtTank(tank);
                ball.out = true;
                ball.exploding = true;
            }
        });
    },

    hurtTank: function(tank) {
        tank.hp -= BALL_DAMAGE;
    },

    getData: function() {
        var gameData = {};
        gameData.tanks = this.tanks;
        gameData.balls = this.balls;

        return gameData;
    },

    cleanDeadTanks: function() {
        this.tanks = this.tanks.filter(function(t) {
            return t.hp > 0;
        });
    },

    cleanDeadBalls: function() {
        this.balls = this.balls.filter(function(ball) {
            return !ball.out;
        });
    },

    increaseLastBallId: function() {
        this.lastBallId ++;
        if(this.lastBallId > 1000) {
            this.lastBallId = 0;
        }
    }
};

var game = new GameServer();

//on connection
io.on('connection', function(client) {
    console.log('User connected');

    client.on('joinGame', function(tank){
        console.log(tank.id + ' joined the game');
        var initX = getRandomInt(40, 900);
        var initY = getRandomInt(40, 500);
        client.emit('addTank', { id: tank.id, type: tank.type, isLocal: true, x: initX, y: initY, hp: TANK_INIT_HP });
        client.broadcast.emit('addTank', { id: tank.id, type: tank.type, isLocal: false, x: initX, y: initY, hp: TANK_INIT_HP} );

        game.addTank({ id: tank.id, type: tank.type, hp: TANK_INIT_HP});

        //killfeed join
        //send message to sender
        client.emit("serverMessage", JSON.stringify({id : tank.id , content: "You are logged in as " + tank.id }));
        //send message to other clients
        client.broadcast.emit("serverMessage", JSON.stringify({id : tank.id , content: tank.id + " is logged in." }));
    });

    client.on('killMessage', function(json) {
        client.emit("serverMessage", JSON.stringify({id : "game.localTank.id" , content: "You were killed."}));
        // console.log("============================kill message");
        //send message to other clients
        client.broadcast.emit("serverMessage", json);
        client.emit("showPrompt");
    });

    client.on('sync', function(data) {
        //Receive data from clients
        if(data.tank !== undefined){
            game.syncTank(data.tank);
        }
        //update ball positions
        game.syncBalls();
        //Broadcast data to clients
        client.emit('sync', game.getData());
        client.broadcast.emit('sync', game.getData());

        //cleanup after sending data, this way the clients know when the tank dies and when the balls explode
        game.cleanDeadTanks();
        game.cleanDeadBalls();
        // counter ++;
        // console.log(counter + " syncs");
    });

    client.on('shoot', function(ball) {
        var ball = new Ball(ball.ownerId, ball.alpha, ball.x, ball.y );
        game.addBall(ball);
    });

    client.on('leaveGame', function(tankId) {
        client.broadcast.emit("serverMessage", JSON.stringify({id : tankId , content: tankId + " has left the game." }));
        console.log(tankId + ' has left the game');
        game.removeTank(tankId);
        client.broadcast.emit('removeTank', tankId);
    });
});

function Ball(ownerId, alpha, x, y) {
    this.id = game.lastBallId;
    game.increaseLastBallId();
    this.ownerId = ownerId;
    this.alpha = alpha; //angle of shot in radians
    this.x = x;
    this.y = y;
    this.out = false;
}

Ball.prototype = {
    fly: function() {
        //move to trayectory
        var speedX = BALL_SPEED * Math.sin(this.alpha);
        var speedY = -BALL_SPEED * Math.cos(this.alpha);
        this.x += speedX;
        this.y += speedY;
    }

};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
