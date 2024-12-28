import jwt from 'jsonwebtoken';

export const authUser = async (req, res, next) => {
    try {
        // Retrieve token from cookies or Authorization header
        const token =
            req.cookies.token ||
            (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        // Check if token exists
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized user' });
        }

        // Verify token using the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user data to the request object
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate!' });
    }
};
