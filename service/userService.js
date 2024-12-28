import dbmodels from "../models/dbmodels.js";

export const createUser = async ({ email, password }) => {
  if (!email || password) {
    throw new error("email and password required!");
  }

  const hashPassword = await dbmodels.hashPassword(password);

  const user = await dbmodels.create({
    email,
    password: hashPassword,
  });

  return user;
};

