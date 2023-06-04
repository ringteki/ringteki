const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const { logger } = require('./logger');
const bcrypt = require('bcrypt');
const api = require('./api');
const path = require('path');
const jwt = require('jsonwebtoken');
const http = require('http');
const helmet = require('helmet');
const monk = require('monk');
const _ = require('underscore');

const UserService = require('./services/UserService.js');
const Settings = require('./settings.js');
const { errorHandler, requestHandler } = require('./ErrorMonitoring');
const env = require('./env.js');

class Server {
    constructor(isDeveloping) {
        let db = monk(env.dbPath);
        this.userService = new UserService(db);
        this.isDeveloping = isDeveloping;
        // @ts-ignore
        this.server = http.Server(app);
    }

    init() {
        if (!this.isDeveloping) {
            app.use(requestHandler);
            app.use(errorHandler);
        }

        app.use(helmet());

        app.set('trust proxy', 1);
        app.use(
            session({
                store: new MongoStore({ mongoUrl: env.dbPath }),
                saveUninitialized: false,
                resave: false,
                secret: env.secret,
                cookie: {
                    maxAge: env.cookieLifetime,
                    secure: env.https,
                    httpOnly: false,
                    domain: env.domain
                },
                name: 'sessionId'
            })
        );

        app.use(passport.initialize());
        app.use(passport.session());

        passport.use(new localStrategy(this.verifyUser.bind(this)));
        passport.serializeUser(this.serializeUser.bind(this));
        passport.deserializeUser(this.deserializeUser.bind(this));

        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        api.init(app);

        app.use(express.static(__dirname + '/../public'));
        app.set('view engine', 'pug');
        app.set('views', path.join(__dirname, '..', 'views'));

        app.get('*', (req, res) => {
            let token = undefined;

            if (req.user) {
                token = jwt.sign(req.user, env.secret);
                req.user = _.omit(req.user, 'blockList');
            }

            res.render('index', {
                basedir: path.join(__dirname, '..', 'views'),
                user: Settings.getUserWithDefaultsSet(req.user),
                token: token,
                production: !this.isDeveloping
            });
        });

        // Define error middleware last
        app.use(function (err, req, res) {
            // eslint-disable-line no-unused-vars
            res.status(500).send({ success: false });
            logger.error(err);
        });

        return this.server;
    }

    run() {
        var port = env.lobbyPort;

        this.server.listen(port, '127.0.0.1', function onStart(err) {
            if (err) {
                logger.error(err);
            }

            logger.info('==> ?? Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
        });
    }

    verifyUser(username, password, done) {
        this.userService
            .getUserByUsername(username)
            .then((user) => {
                if (!user) {
                    done(null, false, { message: 'Invalid username/password' });

                    return Promise.reject('Failed auth');
                }

                bcrypt.compare(password, user.password, function (err, valid) {
                    if (err) {
                        logger.info(err.message);

                        return done(err);
                    }

                    if (!valid) {
                        return done(null, false, { message: 'Invalid username/password' });
                    }

                    const userObj = Settings.getUserWithDefaultsSet({
                        username: user.username,
                        email: user.email,
                        emailHash: user.emailHash,
                        _id: user._id,
                        admin: user.admin,
                        settings: user.settings,
                        promptedActionWindows: user.promptedActionWindows,
                        permissions: user.permissions,
                        blockList: user.blockList
                    });

                    return done(null, userObj);
                });
            })
            .catch((err) => {
                done(err);

                logger.info(err);
            });
    }

    serializeUser(user, done) {
        if (user) {
            done(null, user._id);
        }
    }

    deserializeUser(id, done) {
        this.userService.getUserById(id).then((user) => {
            if (!user) {
                return done(new Error('user not found'));
            }

            let userObj = {
                username: user.username,
                email: user.email,
                emailHash: user.emailHash,
                _id: user._id,
                admin: user.admin,
                settings: user.settings,
                promptedActionWindows: user.promptedActionWindows,
                permissions: user.permissions,
                blockList: user.blockList
            };

            done(null, userObj);
        });
    }
}
module.exports = Server;
