import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // const token = authHeader;
    const token = authHeader.split(' ')[1];

    // console.log("token:", token);

    if (!token) {
        return res.status(401).send({ error: 'Unauthorized: No token provided' });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET_BACKEND
        );
        req.userID = payload.userID;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).send({ error: 'Unauthorized: Invalid token' });
    }
};

export default jwtAuth;