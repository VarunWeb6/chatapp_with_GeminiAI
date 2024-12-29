import dbmodels from "../models/dbmodels.js";

export const createUser = async ({ email, password }) => {
  if (!email || !password) { // Fix the condition
    throw new Error("Email and password are required!"); // Use `Error` instead of `error`
  }

  const hashPassword = await dbmodels.hashPassword(password);

  const user = await dbmodels.create({
    email,
    password: hashPassword,
  });

  return user;
};

export const getAllUsers= async ({userId}) => {
  const users = await dbmodels.find({
    _id: { $ne: userId },
  });
  return users;
}
