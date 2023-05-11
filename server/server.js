'use strict';
const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');

const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the users in the DB
const memesDao = require('./memes-dao'); // module for accessing memes in the DB

// init express
const app = new express();
const port = 3001;

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
    function (username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if (!user) {
                return done(null, false, { message: 'Incorrect username and/or password.' });
            }
            return done(null, user);
        })
    }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});

app.use(morgan('dev'));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    return res.status(401).json({ error: 'User not authenticated' });
}

// set up the session
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());


/******API******/

// GET /api/AllMemes 
app.get('/api/AllMemes', async (req, res) => {
    try {
        const result = await memesDao.getAllMemes(req.user.id);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).json({ errors: 'Database error getting memes.' });
    }
});

// GET /api/PublicMemes
app.get('/api/PublicMemes', async (req, res) => {
    try {
        const result = await memesDao.getPublicMemes();
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).json({ errors: 'Database error getting memes.' });
    }
});


// GET /api/GetTipiMeme 
app.get('/api/GetTipiMeme', async (req, res) => {
    try {
        const result = await memesDao.getTipiMeme();
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).json({ errors: 'Database error getting type-memes.' });
    }
});

// DELETE /api/meme/<id>
app.delete('/api/meme/:id', isLoggedIn, async (req, res) => {
    try {
        const result = await memesDao.deleteMeme(req.params.id, req.user.id);
        if (result && result.errors)
            res.status(404).json(result);
        else
            res.status(204).end();
    } catch (err) {
        res.status(503).json({ errors: `Database error during the deletion of the meme.` });
    }
});

// POST /api/creaMeme
app.post('/api/creaMeme', [
    check('idTipoMeme').not().isEmpty(),
    check('titolo').not().isEmpty(),
    check('pubblico').not().isEmpty(),
    check('colore').not().isEmpty(),
    check('font').not().isEmpty(),
    check('idTipoMeme').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    if ((req.body.textTop == null || req.body.textTop == '') && (req.body.textMid == null || req.body.textMid == '') && (req.body.textBottom == null || req.body.textBottom == '')) {
        return res.status(422).json({ error: 'Non è stata inserita nessuna scritta' });
    }

    const meme = {
        idTipoMeme: req.body.idTipoMeme,
        userId: req.user.id,
        titolo: req.body.titolo,
        textTop: req.body.textTop,
        textMid: req.body.textMid,
        textBottom: req.body.textBottom,
        pubblico: req.body.pubblico,
        colore: req.body.colore,
        font: req.body.font
    };

    try {
        const result = await memesDao.creaMeme(meme);
        if (result.errors)
            res.status(404).json(result);
        else
            res.status(204).end();
    } catch (err) {
        res.status(503).json({ errors: `Database error during the creation of meme '${meme.titolo}'.` });
    }
});


/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from userDao.getUser()
            return res.json(req.user);
        });
    })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
    req.logout();
    res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({ error: 'Unauthenticated user!' });;
});

// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});