import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = (req, res, next) => {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

export const authorize = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        // console.log(req.user);

        if (!user.approved) {
            return res.status(401).json({ message: 'authorization denied' });
        }
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};