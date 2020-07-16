import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import lusca from 'lusca';
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import bluebird from 'bluebird';
import { MONGODB_URI } from './util/secrets';
import { OpenApiValidator } from 'express-openapi-validator';

// Controllers (route handlers)
import * as homeController from './controllers/home';
import * as userController from './controllers/user';
import * as petController from './controllers/pet';

// API keys and Passport configuration
import { HttpError } from 'express-openapi-validator/dist/framework/types';

const spec = path.join(__dirname, '../openapi/openapi-spec.yml');

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;
mongoose.set('useFindAndModify', false);
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
app.use(cors());
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
        // User API
        app.get('/', homeController.index);
        app.post('/v1/login', userController.postLogin);
        app.post('/v1/signup', userController.postSignup);
        app.post('/forgot', userController.postForgot);
        app.get('/reset/:token', userController.getReset);
        app.post('/reset/:token', userController.postReset);
        //Pet API
        app.get('/v1/pet/:pet_id', passport.authenticate('jwt', { session: false }), petController.getPet);
        app.post('/v1/pet', passport.authenticate('jwt', { session: false }), petController.postPet);
        app.put('/v1/pet/:pet_id', passport.authenticate('jwt', { session: false }), petController.putPet);
        app.delete('/v1/pet/:pet_id', passport.authenticate('jwt', { session: false }), petController.deletePet);
        app.post('/v1/pet/:pet_id/ration', passport.authenticate('jwt', { session: false }), petController.addRation);
        app.get('/v1/pet/:pet_id/ration', passport.authenticate('jwt', { session: false }), petController.getRations);
        app.put(
            '/v1/pet/:pet_id/ration/:ration_id',
            passport.authenticate('jwt', { session: false }),
            petController.updateRations,
        );
        app.delete(
            '/v1/pet/:pet_id/ration/:ration_id',
            passport.authenticate('jwt', { session: false }),
            petController.deleteRations,
        );
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
