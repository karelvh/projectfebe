//reqs
var LocalStrategy = require('passport-local').Strategy;

//user model
var User = require('../models/user.js');

module.exports = function(passport) {
    //sessions (required for persistent login)
    //serialize user for session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    //deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //LOCAL STRATEGY LOGIN
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, username, password, done) {
        if (username) {
            username = username.toLowerCase();
        }

        process.nextTick(function() {
            User.findOne({
                'local.username': username
            },
            function(err, user) {
                //in case of errors return them
                if (err) {
                    return done(err);
                }
                //if no user is found
                if (!user) {
                    return done(null, { error: "We couldn't find a user with that username." });
                }
                //check password
                if (!user.validPassword(password)) {
                    return done(null, { error: "Wooops, that's the wrong password." });
                }
                //if everything goes according to plan
                else {
                    console.log(user);
                    return done(null, user);
                }
            });
        });
    }));

    //LOCAL STRATEGY SIGNUP
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, username, password, done) {
        if (username) {
            username = username.toLowerCase();
        }

        process.nextTick(function() {
            //check is user is not already logged in
            //req.user contains the authenticated user. so if none is found thath means the user is not logged in and is allowed to create an account
            if (!req.user) {
                User.findOne( {
                    'local.username': username
                },
                function(err, user) {
                    //in case of errors return them
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, { error: "That username isn't available anymore." });
                    }
                    //if everything goes according to plan
                    else {
                        // new user
                        var newUser = new User();
                        newUser.local.username = username;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.score = 0;
                        //save in the database
                        newUser.save(function(err) {
                            if (err) {
                                throw err;
                            }
                            console.log(newUser);
                            return done(null, newUser);
                        });
                    }
                });
            }
            else {
                //the user is already logged in so can't create a new local account
                return done(null, req.user);
            }
        });
    }));

};
