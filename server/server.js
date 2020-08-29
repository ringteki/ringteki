const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const logger = require('./log.js');
const api = require('./api');
const path = require('path');
const http = require('http');
const Raven = require('raven');
const monk = require('monk');

/* New */
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

/* Old
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');

const _ = require('underscore');

const UserService = require('./services/UserService.js');
const version = require('../version.js');
const Settings = require('./settings.js');
*/

const ServiceFactory = require('./services/ServiceFactory.js');

const version = require('../version.js');

class Server {
    constructor(isDeveloping) {
        this.configService = ServiceFactory.configService();

        //@ts-ignore TS2349
        let db = monk(this.configService.getValue('dbPath'));

        this.userService = ServiceFactory.userService(db, this.configService);
        this.isDeveloping = isDeveloping;
        this.server = http.createServer(app);
    }

    init(options) {
        if(!this.isDeveloping) {
            Raven.config(this.configService.getValue('sentryDsn'), { release: version.releaseDate }).install();

            app.use(Raven.requestHandler());
            app.use(Raven.errorHandler());
        }

        var opts = {};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        opts.secretOrKey = this.configService.getValue('secret');

        passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
            this.userService.getUserById(jwtPayload._id).then(user => {
                if(user) {
                    return done(null, user.getWireSafeDetails());
                }

                return done(null, false);
            }).catch(err => {
                return done(err, false);
            });
        }));
        app.use(passport.initialize());

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        api.init(app, options);

        app.use(express.static(__dirname + '/../public'));

        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
        });

        // Define error middleware last
        app.use(function(err, req, res, next) {
            logger.error(err);

            if(!res.headersSent && req.xhr) {
                return res.status(500).send({ success: false });
            }

            next(err);
        });

        return this.server;
    }

    run() {
        let port = process.env.PORT || this.configService.getValue('port') || 4000;

        this.server.listen(port, '0.0.0.0', function onStart(err) {
            if(err) {
                logger.error(err);
            }

            logger.info('==> ?? Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
        });
    }

    serializeUser(user, done) {
        if(user) {
            done(null, user._id);
        }
    }
}

module.exports = Server;

/*
class Server {
    constructor(isDeveloping) {
        let db = monk(config.dbPath);
        this.userService = new UserService(db);
        this.isDeveloping = isDeveloping;
        // @ts-ignore
        this.server = http.Server(app);
    }

    init() {
        if(!this.isDeveloping) {
            Raven.config(config.sentryDsn, { release: version }).install();

            app.use(Raven.requestHandler());
            app.use(Raven.errorHandler());
        }

        app.use(helmet());

        app.set('trust proxy', 1);
        app.use(session({
            store: new MongoStore({ url: config.dbPath }),
            saveUninitialized: false,
            resave: false,
            secret: config.secret,
            cookie: {
                maxAge: config.cookieLifetime,
                secure: config.https,
                httpOnly: false,
                domain: config.domain
            },
            name: 'sessionId'

        }));

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

        if(this.isDeveloping) {
            const compiler = webpack(webpackConfig);
            const middleware = webpackDevMiddleware(compiler, {
                hot: true,
                contentBase: 'client',
                publicPath: webpackConfig.output.publicPath,
                stats: {
                    colors: true,
                    hash: false,
                    timings: true,
                    chunks: false,
                    chunkModules: false,
                    modules: false
                },
                historyApiFallback: true
            });

            app.use(middleware);
            app.use(webpackHotMiddleware(compiler, {
                log: false,
                path: '/__webpack_hmr',
                heartbeat: 2000
            }));
        }

        app.get('*', (req, res) => {
            let token = undefined;

            if(req.user) {
                token = jwt.sign(req.user, config.secret);
                req.user = _.omit(req.user, 'blockList');
            }

            res.render('index', { basedir: path.join(__dirname, '..', 'views'), user: Settings.getUserWithDefaultsSet(req.user), token: token, production: !this.isDeveloping });
        });

        // Define error middleware last
        app.use(function(err, req, res, next) { // eslint-disable-line no-unused-vars
            res.status(500).send({ success: false });
            logger.error(err);
        });

        return this.server;
    }

    run() {
        var port = config.lobby.port;

        this.server.listen(port, '127.0.0.1', function onStart(err) {
            if(err) {
                logger.error(err);
            }

            logger.info('==> ?? Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
        });
    }

    verifyUser(username, password, done) {
        this.userService.getUserByUsername(username)
            .then(user => {
                if(!user) {
                    done(null, false, { message: 'Invalid username/password' });

                    return Promise.reject('Failed auth');
                }

                bcrypt.compare(password, user.password, function(err, valid) {
                    if(err) {
                        logger.info(err.message);

                        return done(err);
                    }

                    if(!valid) {
                        return done(null, false, { message: 'Invalid username/password' });
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

                    userObj = Settings.getUserWithDefaultsSet(userObj);

                    return done(null, userObj);
                });
            })
            .catch(err => {
                done(err);

                logger.info(err);
            });
    }

    serializeUser(user, done) {
        if(user) {
            done(null, user._id);
        }
    }

    deserializeUser(id, done) {
        this.userService.getUserById(id)
            .then(user => {
                if(!user) {
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
*/
