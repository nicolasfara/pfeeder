import {MicroframeworkLoader, MicroframeworkSettings} from "microframework";
import passport from "passport";
import passportLocal from "passport-local";
import passportJwt from 'passport-jwt';
import {User} from "../api/models/User";

import {env} from '../env';

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;

export const passportLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                return done(undefined, false, { message: `Email ${email} not found`});
            }
            if (await user.comparePassword(password, user.password)) {
                done(undefined, user);
            } else {
                done(undefined, false, { message: `Invalid password or email` });
            }
        }));

        passport.use(new JwtStrategy(
            {
                jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
                secretOrKey: env.app.jwtSecret
            }
        , async (jwtPayload, done) => {
            const user = await User.findOne({ email: jwtPayload.id });
            if (!user) {
                return done(undefined, false, { message: 'No user valid'});
            } else {
                return done(undefined, user);
            }
        }));
    }
}
