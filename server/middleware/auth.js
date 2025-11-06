import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = (req, res, next) => {
    const token = req.cookies?.token;
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

export const authorize = (allowedRoles = []) => {
    //ROLES enum: ['TPO', 'TPC', 'Student', 'TPF'],;
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.userId);
            console.log(req.user);

            if (!user || !user.role) {
                return res.status(401).json({ message: 'Unauthorized: User not authenticated or role not found.' });
            }

            const userRole = req.user.role;

            if (allowedRoles.length == 0 || allowedRoles.includes(userRole)) {
                next();
            } else {
                res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
            }
        } catch (error) {
            console.error('Error in authorization middleware:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };
};

