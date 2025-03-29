import express from 'express';
import { getUser, login, register, verificationStatus, verifyEmail } from './auth.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';


const AuthRouter = express.Router();

AuthRouter.get('/currentuser', jwtAuth, getUser);


// AuthRouter.get('/token', getToken);

AuthRouter.post('/register', register);

AuthRouter.post('/login', login);

AuthRouter.get('/verify', verifyEmail);

AuthRouter.get('/verify-status', verificationStatus);



export default AuthRouter;