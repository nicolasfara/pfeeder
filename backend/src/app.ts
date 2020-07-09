import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression'; // compresses requests
import session from 'express-session';
import bodyParser from 'body-parser';
import lusca from 'lusca';
import mongo from 'connect-mongo';
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import bluebird from 'bluebird';
import { MONGODB_URI, SESSION_SECRET } from './util/secrets';
import { OpenApiValidator } from 'express-openapi-validator';

// Controllers (route handlers)
import * as homeController from './controllers/home';
import * as userController from './controllers/user';
import * as notificationController from './controllers/notification';

// API keys and Passport configuration
import { HttpError } from 'express-openapi-validator/dist/framework/types';
import logger from './util/logger';

const spec = path.join(__dirname, '../openapi/openapi-spec.yml');

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose
    .connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    })
    .catch((err) => {
        console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
        // process.exit();
    });

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use(express.static(spec));

new OpenApiValidator({
    apiSpec: spec,
    validateRequests: true, // (default)
    validateResponses: true, // false by default
})
    .install(app)
    .then(() => {
        /**
         * Primary app routes.
         */
        app.get('/', homeController.index);
        app.post('/v1/login', userController.postLogin);
        app.post('/v1/signup', userController.postSignup);
        app.post('/forgot', userController.postForgot);
        app.get('/reset/:token', userController.getReset);
        app.post('/reset/:token', userController.postReset);

        app.get('/v1/user', passport.authenticate('jwt', { session: false }), (req, res, next) => {
            logger.info('Here');
            return res.status(200).json({
                code: '5',
                message: 'Yess',
                user: req.user,
            });
        });
        //app.get("/v1/signup", userController.getSignup);
        /*app.get("/logout", userController.logout);
        app.get("/forgot", userController.getForgot);

        

        app.get("/contact", contactController.getContact);
        app.post("/contact", contactController.postContact);
        app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
        app.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
        app.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
        app.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
        app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);*/
        app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
            res.status(err.status || 500).json({
                message: err.message,
                errors: err.errors,
            });
        });
    });

export default app;
