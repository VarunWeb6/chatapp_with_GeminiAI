import projectModel from '../models/projectModel.js';
import dbModel from '../models/dbModels.js';
import * as projectService from '../service/projectService.js';
import { validationResult } from 'express-validator';

export const createProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        const { name } = req.body;

        // Find the user by email
        const loggedInUser = await dbModel.findOne({ email: req.user.email });
        if (!loggedInUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userId = loggedInUser._id;
        
        // Create new project
        const newProject = await projectService.createProject({ name, userId });

        res.status(201).json(newProject);
    } 
    catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
};
