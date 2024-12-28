import dbmodels from '../models/dbmodels.js';
import * as userService from '../service/userService.js';
import { validationResult } from 'express-validator';
import redisClient from '../service/redisService.js';

// Controller to create a new user
export const createUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await userService.createUser(req.body);

        // Assuming generateJWT() is defined and creates a JWT token
        const token = await user.generateJWT();
        delete user._doc.password;
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to log in a user
export const loginController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Find the user in the database
        const user = await dbmodels.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify the password
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        delete user._doc.password;
        // Generate JWT token
        const token = await user.generateJWT();
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to get user profile
export const profileController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        // Assuming req.user is populated via middleware
        res.status(200).json({
            user: req.user,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const logoutController = async (req, res) => {
    try {
        // Assuming token is stored in cookies
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        //logout the user by setting the token in Redis with an expiry time
        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24, (err, reply) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json({ message: 'Logged out successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
