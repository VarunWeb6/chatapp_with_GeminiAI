import projectModel from '../models/projectModel.js';
import projectService from '../service/projectService.js';
import { validationResult } from 'express-validator';

export const createProject = async (req, res) => { 

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name} = req.body;
    const userId = req.user._id;

    try {
        const project = await projectService.createProject(req.body);
        res.status(201).json({ project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}