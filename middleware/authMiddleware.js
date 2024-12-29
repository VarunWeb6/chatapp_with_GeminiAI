import jwt from 'jsonwebtoken';
import redisClient from '../service/redisService.js';

export const authUser = async (req, res, next) => {
    try {
        // Retrieve token from cookies or Authorization header
        let token = req.cookies.token || 
                    (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        // Check if token exists
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        // Check if token is blacklisted
        const isBlackListed = await redisClient.get(token);
        if (isBlackListed) {
            res.clearCookie('token');  // Clear the token cookie
            return res.status(401).json({ error: 'Unauthorized: Token is blacklisted' });
        }

        // Verify token using the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user data to the request object
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // Handle JWT verification errors and other potential errors
        console.error("Authentication error:", error);
        res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
};
