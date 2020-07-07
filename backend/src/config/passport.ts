import passport from "passport";
import passportLocal from "passport-local";
import UniqueTokenStrategy from "passport-unique-token";
import passportJwt from "passport-jwt";
import {User} from "../models/User";
import { Request, Response, NextFunction } from "express";
import logger from "../util/logger";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;

passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => done(undefined, user))
        .catch(err => done(err, undefined));
});


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() })
        .then(user => {
            if (!user) {
                return done(undefined, false, { message: `Email ${email} not found.` });
            }
            user.comparePassword(password, (err: Error, isMatch: boolean) => {
                if (err) { return done(err); }
                if (isMatch) {
                    return done(undefined, user);
                }
                return done(undefined, false, { message: "Invalid email or password." });
            });
        })
        .catch(err => { return done(err); });
}));

/**
 * Authenticate the user throw API token.
 */
passport.use(new UniqueTokenStrategy((token, done) => {
    User.findOne({apiKeys: {$in: [token]}})
        .then(user => {
            if (!user) return done(undefined, false, {message: "No tokens found."});
            return done(null, user);
        })
        .catch(err => {
            return done(err, {message: "No token found"});
        });
}));

/**
 * Authentication with JWT Token.
 */
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, (jwtPayload, done) => {
    // find the use in the DB.
    User.findOne({ email: jwtPayload.id })
        .then(user => {
            if (!user) return done(undefined, false, { message: "No user valid" });
            return done(null, user);
        })
        .catch(err => {
            return done(err);
        });
}));

/**
 * Token auth middleware.
 */
export const isTokenValid = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("token", (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: "Incorrect token credentials" });
        req.user = user;
        next();
    })(req, res, next);
};

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

