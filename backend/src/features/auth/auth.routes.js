import express from 'express';
import { getUser, login, register, verificationStatus, verifyEmail, resendVerificationEmail } from './auth.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';
import passport from 'passport';
import '../../config/passport-config.js'

const AuthRouter = express.Router();

AuthRouter.get('/currentuser', jwtAuth, getUser);


// AuthRouter.get('/token', getToken);

AuthRouter.post('/register', register);

AuthRouter.post('/login', login);

AuthRouter.get('/verify', verifyEmail);

AuthRouter.get('/verify-status', verificationStatus);

AuthRouter.post('/resend-verification', resendVerificationEmail);

AuthRouter.get('/google', passport.authenticate("google", { scope: ["profile", "email"] }));

AuthRouter.get('/google/callback', passport.authenticate("google", { failureRedirect: "/login", session: false }),
    (req, res) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Authentication failed" });
        }

        const { user, token } = req.user;

        res.redirect(`https://www.webmeter.in/google/callback?token=${token}`);
    }
)



export default AuthRouter;