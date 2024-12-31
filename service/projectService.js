import projectModel from '../models/projectModel.js';
import dbModel from '../models/dbModels.js';
import mongoose from 'mongoose';

export const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error('Project name is required');
  }
  if (!userId) {
    throw new Error('User ID is required');
  }
  try {
    const project = await projectModel.create({
      name,
      users: [userId],
    });
    return project;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Project name already exists');
    }
    throw error;
  }
};

export const getAllProjectsByUserId = async ({ userId }) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid User ID');
  }

  const allUserProjects = await projectModel.find({ users: userId });

  if (!allUserProjects.length) {
    throw new Error('No projects found for this user');
  }

  return { project: allUserProjects }; // Wrap the array in an object with a key `project`
};

// export const addUsersToProject = async ({ projectId, users, userId }) => {
//   if (!projectId) {
//     throw new Error('Project ID is required');
//   }
//   if (!mongoose.Types.ObjectId.isValid(projectId)) {
//     throw new Error('Invalid Project ID');
//   }
//   if (!users || !Array.isArray(users)) {
//     throw new Error('Users must be an array');
//   }
//   if (!userId) {
//     throw new Error('User ID is required');
//   }
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     throw new Error('User is not authorized to add users to the project');
//   }

//   // Validate all user IDs in the `users` array
//   for (const user of users) {
//     if (!mongoose.Types.ObjectId.isValid(user)) {
//       throw new Error(`Invalid User ID in array: ${user}`);
//     }
//   }

//   // Check if the requesting user belongs to the project
//   const project = await projectModel.findOne({ _id: projectId, users: userId });
//   if (!project) {
//     throw new Error('You are not authorized to modify this project');
//   }

//   // Add users to the project if they are not already present
//   const updatedProject = await projectModel.findOneAndUpdate(
//     { _id: projectId },
//     { $addToSet: { users: { $each: users } } },
//     { new: true }
//   );

//   return updatedProject;
// };

export const addUsersToProject = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error('Project ID is required');
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error('Invalid Project ID');
  }
  if (!users || !Array.isArray(users)) {
    throw new Error('Users must be an array');
  }
  if (!userId) {
    throw new Error('User ID is required');
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('User is not authorized to add users to the project');
  }

  // Validate all user IDs in the `users` array and check if they exist
  for (const user of users) {
    if (!mongoose.Types.ObjectId.isValid(user)) {
      throw new Error(`Invalid User ID in array: ${user}`);
    }
    const userExists = await dbModel.findById(user);
    if (!userExists) {
      throw new Error(`User not found with ID: ${user}`);
    }
  }

  // Check if the requesting user belongs to the project
  const project = await projectModel.findOne({ _id: projectId, users: userId });
  if (!project) {
    throw new Error('You are not authorized to modify this project');
  }

  // Add users to the project if they are not already present
  const updatedProject = await projectModel.findOneAndUpdate(
    { _id: projectId },
    { $addToSet: { users: { $each: users } } },
    { new: true }
  );

  return updatedProject;
};


export const getProjectById = async ({projectId}) => {
  if (!projectId) {
    throw new Error("projectId is required");
  }

  // Validate the projectId format (if not valid, return early)
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      console.log("Invalid projectId format:", projectId);  // Log invalid ID
      throw new Error("Invalid projectId");
    }

  console.log("Looking for project with ID:", projectId); // Log projectId

  // Attempt to find the project in the database
  const project = await projectModel.findOne({ _id: projectId }).populate('users');

  // If no project found, log the error and throw
  if (!project) {
    console.log("Project not found for ID:", projectId);  // Log if not found
    throw new Error("Project not found");
  }

  console.log("Project found:", project); // Log project if found
  return project;
};



