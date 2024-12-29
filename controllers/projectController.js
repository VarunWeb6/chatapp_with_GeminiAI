import projectModel from "../models/projectModel.js";
import dbModel from "../models/dbModels.js";
import * as projectService from "../service/projectService.js";
import { validationResult } from "express-validator";

export const createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const loggedInUser = await dbModel.findOne({ email: req.user?.email });
    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = loggedInUser._id;

    const newProject = await projectService.createProject({ name, userId });

    return res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const loggedInUser = await dbModel.findOne({ email: req.user?.email });
    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const allUserProjects = await projectService.getAllProjectsByUserId({
      userId: loggedInUser._id,
    });

    // Return the projects wrapped in an object with a `project` key
    return res.status(200).json(allUserProjects); // allUserProjects is already { project: [...] }
  } catch (error) {
    console.error("Error fetching all projects:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const addUserToProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, users } = req.body;

    if (!projectId || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        message: "Project ID and a list of users are required",
      });
    }

    const loggedInUser = await dbModel.findOne({ email: req.user?.email });
    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = await projectService.addUsersToProject({
      projectId,
      users,
      userId: loggedInUser._id,
    });

    return res.status(200).json(project);
  } catch (error) {
    console.error("Error adding users to project:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const project = await projectService.getProjectById({ projectId }) ;

    return res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return res.status(500).json({ error: error.message });
  }
}

