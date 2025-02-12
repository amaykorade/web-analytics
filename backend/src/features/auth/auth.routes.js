import express from 'express';
import { getUser, login, register } from './auth.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';


const AuthRouter = express.Router();

AuthRouter.get('/currentuser', jwtAuth, getUser);


// AuthRouter.get('/token', getToken);

AuthRouter.post('/register', register);

AuthRouter.post('/login', login);



export default AuthRouter;