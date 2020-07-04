import passport from "passport";
import passportLocal from "passport-local";
import passportFacebook from "passport-facebook";
import UniqueTokenStrategy from "passport-unique-token";
import passportJwt from "passport-jwt";
import _ from "lodash";

// import { User, UserType } from '../models/User';
import { User, UserDocument } from "../models/User";
import { Request, Response, NextFunction } from "express";

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
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
    secretOrKey: "TOKEN"
}, (jwtPayload, done) => {
    // find the use in the DB.
    User.findOne({ jwt: jwtPayload.id })
        .then(user => {
            if (!user) return done(undefined, false, { message: "No user valid" });
            return done(null, user);
        })
        .catch(err => {
            return done(err);
        });
}));

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */


/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ["name", "email", "link", "locale", "timezone"],
    passReqToCallback: true
}, (req: any, accessToken, refreshToken, profile, done) => {
    if (req.user) {
        User.findOne({ facebook: profile.id })
            .then(existingUser => {
                if (existingUser) {
                    req.flash("errors", { msg: "There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account." });
                    done("error");
                } else {
                    User.findById(req.user.id)
                        .then(user => {
                            user.facebook = profile.id;
                            user.tokens.push({ kind: "facebook", accessToken });
                            user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
                            user.profile.gender = user.profile.gender || profile._json.gender;
                            user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
                            user.save((err: Error) => {
                                req.flash("info", { msg: "Facebook account has been linked." });
                                done(err, user);
                            });
                        })
                        .catch(err => { return done(err); });
                }
            })
            .catch(err => { return done(err); });
    } else {
        User.findOne({ facebook: profile.id })
            .then(existingUser => {
                if (existingUser) {
                    return done(undefined, existingUser);
                }
            })
            .catch(err => { return done(err); });

            User.findOne({ email: profile._json.email })
                .then(existingEmailUser => {
                    if (existingEmailUser) {
                        req.flash("errors", { msg: "There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings." });
                        done("Error");
                    } else {
                        const user: any = new User();
                        user.email = profile._json.email;
                        user.facebook = profile.id;
                        user.tokens.push({ kind: "facebook", accessToken });
                        user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
                        user.profile.gender = profile._json.gender;
                        user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
                        user.profile.location = (profile._json.location) ? profile._json.location.name : "";
                        user.save((err: Error) => {
                            done(err, user);
                        });
                    }
                })
                .catch(err => { return done(err); });
    }
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

/**
 * Authorization Required middleware.
 */
export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.path.split("/").slice(-1)[0];

    const user = req.user as UserDocument;
    if (_.find(user.tokens, { kind: provider })) {
        next();
    } else {
        res.redirect(`/auth/${provider}`);
    }
};
