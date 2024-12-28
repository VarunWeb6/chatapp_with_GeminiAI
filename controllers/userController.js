import dbmodels from '../models/dbmodels.js';
import * as userService from '../service/userService.js';
import { validationResult } from 'express-validator';

export const createUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await userService.createUser(req.body);

        const token = await user.generateJWT();
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const loginController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Fetch user from database
        const user = await dbmodels.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ errors: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(401).json({ errors: 'Invalid credentials' });
        }

        // Generate JWT
        const token = await user.generateJWT();
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).send(error.message); // Corrected to 500 Internal Server Error
    }
};

export const profileController = async (req, res) => {
    
}
