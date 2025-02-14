import dbmodels from "../models/dbmodels.js"; // Keeping this consistent
import * as userService from "../service/userService.js";
import { validationResult } from "express-validator";
import redisClient from "../service/redisService.js";

// Controller to create a new user
export const createUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await userService.createUser(req.body);

        // Generate JWT token
        const token = user.generateJWT(); // No need for `await` here since it's synchronous
        delete user._doc.password;

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message }); // Use 400 for bad requests
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
        const user = await dbmodels.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Verify the password
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = user.generateJWT(); // JWT generation is synchronous
        delete user._doc.password;

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Use 500 for server errors
    }
};

// Controller to get user profile
export const profileController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        // Assuming req.user is populated via middleware
        res.status(200).json({ user: req.user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to log out a user
export const logoutController = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(400).json({ error: "No token provided" });
        }

        // Logout the user by setting the token in Redis with an expiry time
        await redisClient.set(token, "logout", "EX", 60 * 60 * 24); // 1 day expiry

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to get all users
export const getAllUsersController = async (req, res) => {
    try {
        const loggedInUser = await dbmodels.findOne({ email: req.user.email });
        if (!loggedInUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const allUsers = await userService.getAllUsers({ userId: loggedInUser._id });
        res.status(200).json({ users: allUsers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
