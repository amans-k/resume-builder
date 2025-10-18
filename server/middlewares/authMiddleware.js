import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, no token' });
        }

        // Remove "Bearer " prefix if present
        const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        
        // Verify user exists in database
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export default protect;