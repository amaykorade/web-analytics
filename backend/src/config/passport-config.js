import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthModel } from "../features/auth/auth.schema.js";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";


dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://backend.webmeter.in/api/user/google/callback",
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                let user = await AuthModel.findOne({ email: profile.emails[0].value });

                if (!user) {
                    user = new AuthModel({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        verified: true,
                    });
                    await user.save();
                }

                const token = jwt.sign({ userID: user._id, email: user.email }, process.env.JWT_SECRET, {
                    expiresIn: "30d",
                });

                return done(null, { user, token });
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await AuthModel.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
