module.exports = function(app, passport) {
    //rederict to homepage if user is logged out
    app.post('/logout', function(req, res) {
        req.logout();
        res.json({ redirect: '/' });
    });

    //LOGIN ROUTE
    //get data from login form
    app.post('/login', function(req, res, next) {
        // if (!req.body.username || !req.body.password) {
        //     return res.json({ error: 'Username and Password required' });
        // }
        //only check if a username exists, password is optional but not required
        if (!req.body.username ) {
            return res.json({ error: 'Username is required' });
        }
        //passport magic
        passport.authenticate('local-login', function(err, user, info) {
            if (err) {
                return res.json(err);
            }
            if (user.error) {
                return res.json({ error: user.error });
            }
            req.logIn(user, function(err) {
                if (err) {
                    return res.json(err);
                }
                //back to the homepage where angular will hide the login/sign up nuttons and show the game
                // return res.json({ redirect: '/' });

                //temp debug redirect
                return res.json({ redirect: '/game' });
            });
        })(req, res);
    });

    //SIGN UP ROUTE
    //get data from the signup form
    app.post('/signup', function(req, res, next) {
        // if (!req.body.username || !req.body.password) {
        //     return res.json({ error: 'Username and Password required' });
        // }
        if (!req.body.username) {
            return res.json({ error: 'Username is required' });
        }
        passport.authenticate('local-signup', function(err, user, info) {
            if (err) {
                return res.json(err);
            }
            if (user.error) {
                return res.json({ error: user.error });
            }
            req.logIn(user, function(err) {
                if (err) {
                    return res.json(err);
                }
                //back to the homepage where angular will hide the login/sign up nuttons and show the game
                // return res.json({ redirect: '/' });

                //temp debug redirect
                return res.json({ redirect: '/game' });
            });
        })(req, res);
    });

    //so angular can use /api/userData in the pages
    app.get('/api/userData', isLoggedInAjax, function(req, res) {
        return res.json(req.user);
    });

    // show the home page (will also have our login links)
    app.get('*', function(req, res) {
        console.log("!!=============PAGE NOT FOUND REDIRECT TO '/'=============!!");
        res.sendfile('./app/index.html');
    });
};

// route middleware to ensure user is logged in - ajax get
function isLoggedInAjax(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.json( { redirect: '/login' } );
    } else {
        next();
    }
}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
