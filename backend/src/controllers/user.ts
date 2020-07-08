import async from 'async';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import passport from 'passport';
import { AuthToken, User, UserDocument } from '../models/User';
import { Request, Response, NextFunction } from 'express';
import { WriteError } from 'mongodb';
import { body, check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import '../config/passport';
import logger from '../util/logger';

/**
 * POST /login
 * Sign in using email and password.
 */
export const postLogin = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    await check('email', 'Email is not valid').isEmail().run(req);
    await check('password', 'Password cannot be blank').isLength({ min: 1 }).run(req);
    await check('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    passport.authenticate('local', { session: false }, (err: Error, user: UserDocument) => {
        if (err) return res.status(500).json({ code: 1, message: err });
        if (!user) {
            return res.status(401).json({
                code: 2,
                message: 'Something went wrong :( Unable to find you in our system',
            });
        }
        req.logIn(user, { session: false }, (err) => {
            if (err) {
                return res.send({ code: 2, message: err });
            }
            const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET);
            res.json({ token: token, message: 'User find and logged in' });
        });
    })(req, res, next);
};

/**
 * POST /signup
 * Create a new local account.
 */
export const postSignup = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    await check('email', 'Email is not valid').isEmail().run(req);
    await check('password', 'Password must be at least 4 characters long').isLength({ min: 4 }).run(req);
    await check('confirmPassword', 'Passwords do not match').equals(req.body.password).run(req);
    await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);
    await check('name').run(req);
    await check('surname').run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            code: 1,
            message: errors.array(),
        });
    }

    const user = new User({
        email: req.body.email,
        password: req.body.password,
        profile: {
            name: req.body.name,
            surname: req.body.surname,
        },
    });

    User.findOne({ email: req.body.email })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(403).json({ code: 1, message: 'Account with that email address already exists.' });
            }
            user.save()
                .then((user) => {
                    req.logIn(user, (err) => {
                        if (err) {
                            return res.status(500).json({ code: 2, message: 'Unable to login: ' + err });
                        }
                        res.json({ email: user.email, message: 'New user create successfully' });
                    });
                })
                .catch((err) => {
                    return res.status(500).json({ code: 3, message: 'Unable to save the user into DB: ' + err });
                });
        })
        .catch((err) => next(err));
};

/**
 * POST /account/profile
 * Update profile information.
 */
export const postUpdateProfile = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    await check('email', 'Please enter a valid email address.').isEmail().run(req);
    await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(500).json({ code: 1, message: errors.array() });
    }

    const user = req.user as UserDocument;
    User.findById(user.id)
        .then((user) => {
            user.email = req.body.email || '';
            user.profile.name = req.body.name || '';
            user.save()
                .then(() => {
                    res.json({ message: 'Profile information has been updated.' });
                })
                .catch((err: WriteError) => {
                    if (err) {
                        if (err.code === 11000) {
                            return res.status(401).json({
                                code: 2,
                                message: 'The email address you have entered is already associated with an account.',
                            });
                        }
                    }
                });
        })
        .catch((err) => {
            return res.status(500).json({ code: 3, message: err });
        });
};

/**
 * POST /account/password
 * Update current password.
 */
export const postUpdatePassword = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    await check('password', 'Password must be at least 4 characters long').isLength({ min: 4 }).run(req);
    await check('confirmPassword', 'Passwords do not match').equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(401).json({ code: 1, message: errors.array() });
    }

    const user = req.user as UserDocument;
    User.findById(user.id)
        .then((user) => {
            user.password = req.body.password;
            user.save()
                .then(() => {
                    res.json({ message: 'Password has been changed.' });
                })
                .catch((err: WriteError) => {
                    res.status(500).json({ code: 2, message: err });
                });
        })
        .catch((err) => {
            res.status(500).json({ code: 3, message: err });
        });
};

/**
 * DELETE /account/delete
 * Delete user account.
 */
export const deleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as UserDocument;
    User.remove({ _id: user.id })
        .then(() => {
            req.logout();
            return res.json({ message: 'User delete successfully' });
        })
        .catch((err) => {
            return res.status(500).json({ code: 1, message: err });
        });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
export const getReset = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    if (req.isAuthenticated()) {
        return res.status(402).json({ code: 1, message: 'User logged in. Unable to reset password.' });
    }
    User.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires')
        .gt(Date.now())
        .exec()
        .then((user) => {
            if (!user) {
                return res.status(401).json({ code: 2, message: 'Password reset token is invalid or has expired.' });
            }
            return res.json({ message: 'Token provided is valid' });
        })
        .catch((err: Error) => {
            return res.status(500).json({ code: 3, message: err });
        });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
export const postReset = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    await check('password', 'Password must be at least 4 characters long.').isLength({ min: 4 }).run(req);
    await check('passwordConfirm', 'Passwords must match.').equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(500).json({ code: 1, message: errors.array() });
    }

    async.waterfall(
        [
            function resetPassword(done: (err: Error, user: UserDocument) => void) {
                User.findOne({ passwordResetToken: req.params.token })
                    .where('passwordResetExpires')
                    .gt(Date.now())
                    .exec()
                    .then((user) => {
                        if (!user) {
                            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
                            return res.redirect('back');
                        }
                        user.password = req.body.password;
                        user.passwordResetToken = undefined;
                        user.passwordResetExpires = undefined;
                        user.save()
                            .then((user) => {
                                req.logIn(user, (err) => {
                                    done(err, user);
                                });
                            })
                            .catch((err) => {
                                return res.status(500).json({ code: 1, message: err });
                            });
                    })
                    .catch((err) => {
                        return res.status(500).json({ code: 2, message: err });
                    });
            },
            function sendResetPasswordEmail(user: UserDocument, done: (err: Error) => void) {
                const transporter = nodemailer.createTransport({
                    service: 'SendGrid',
                    auth: {
                        user: process.env.SENDGRID_USER,
                        pass: process.env.SENDGRID_PASSWORD,
                    },
                });
                const mailOptions = {
                    to: user.email,
                    from: 'express-ts@starter.com',
                    subject: 'Your password has been changed',
                    text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`,
                };
                transporter.sendMail(mailOptions, (err) => {
                    done(err);
                });
            },
        ],
        (err) => {
            if (err) {
                return res.status(500).json({ code: 3, message: err });
            }
            return res.json({ message: 'The password has just benn changed' });
        },
    );
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
export const postForgot = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    await check('email', 'Please enter a valid email address.').isEmail().run(req);
    await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(500).json({ code: 1, message: 'Malformed input' });
    }

    async.waterfall(
        [
            function createRandomToken(done: (err: Error, token: string) => void) {
                crypto.randomBytes(16, (err, buf) => {
                    const token = buf.toString('hex');
                    done(err, token);
                });
            },
            function setRandomToken(token: string, done: (err: WriteError, token: string, user: UserDocument) => void) {
                User.findOne({ email: req.body.email })
                    .then((user: UserDocument) => {
                        if (!user) {
                            return res
                                .status(401)
                                .json({ code: 1, message: 'Account with that email address does not exist.' });
                        }
                        user.passwordResetToken = token;
                        user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
                        user.save((err: WriteError) => {
                            done(err, token, user);
                        });
                    })
                    .catch((err) => {
                        return done(err, null, null);
                    });
            },
            function sendForgotPasswordEmail(token: AuthToken, user: UserDocument, done: (err: Error) => void) {
                /*const transporter = nodemailer.createTransport({
                    service: 'SendGrid',
                    auth: {
                        user: process.env.SENDGRID_USER,
                        pass: process.env.SENDGRID_PASSWORD,
                    },
                });
                const mailOptions = {
                    to: user.email,
                    from: 'hackathon@starter.com',
                    subject: 'Reset your password on Hackathon Starter',
                    text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
                           Please click on the following link, or paste this into your browser to complete the process:\n\n
                           http://${req.headers.host}/reset/${token}\n\n
                           If you did not request this, please ignore this email and your password will remain unchanged.\n`,
                };
                transporter.sendMail(mailOptions, (err: Error) => {
                    logger.info(`An e-mail has been sent to ${user.email} with further instructions.`);
                    done(err);
                });*/
                done(null);
            },
        ],
        (err: Error) => {
            if (err) {
                return res.status(500).json({ code: 2, message: err });
            }
            return res.json({ message: 'An email is sent at your email' });
        },
    );
};
