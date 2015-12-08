module.exports = function(app, passport) {

// normal routes ===============================================================
    // LOGOUT ==============================
    app.post('/logout', function(req, res) {
        req.logout();
        res.json({ redirect: '/' });
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================
    // locally --------------------------------
        // LOGIN ===============================

        // process the login form
        app.post('/login', function(req, res, next) {
            if (!req.body.username || !req.body.password) {
                return res.json({ error: 'Username and Password required' });
            }
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
                    // return res.json({ redirect: '/profile' });
                    return res.json({ redirect: '/game' });
                });
            })(req, res);
        });

        // SIGNUP =================================

        // process the signup form
        app.post('/signup', function(req, res, next) {
            if (!req.body.username || !req.body.password) {
                return res.json({ error: 'Username and Password required' });
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
                    return res.json({ redirect: '/game' });
                    // return res.json({ redirect: '/profile' });
                });
            })(req, res);
        });


    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'username' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove username and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.username    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    app.get('/api/userData', isLoggedInAjax, function(req, res) {
        return res.json(req.user);
    });

    // show the home page (will also have our login links)
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html');
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
