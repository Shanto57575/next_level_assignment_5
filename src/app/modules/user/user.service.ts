import bcrypt from "bcrypt";
import { User } from "./user.model";
import { envVars } from "../../config/env";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";

const createUserService = async (payload: Partial<IUser>) => {
  const { email, password, role, ...rest } = payload;

  if (role === Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `You cannot assign yourself to be ${role}`
    );
  }

  const isUserExists = await User.findOne({ email });

  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists!");
  }

  // password hashing
  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUNDS)
  );

  // auth type
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const userInfo = {
    ...rest,
    email,
    role,
    password: hashedPassword,
    auths: authProvider,
  };

  const userData = await User.create(userInfo);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...restData } = userData.toObject();

  return restData;
};

const getAllUserService = async (query: Record<string, string>) => {
  const { page, limit, searchTerm = "" } = query;

  const totalUser = await User.countDocuments();
  const result = await User.find({
    $or: [
      { name: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
    ],
  })
    .select("-password")
    .sort("-createdAt")
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit));
  return { result, totalUser };

  // * 5 4
};

const getAllReceiverService = async () => {
  return await User.find({ role: "RECEIVER" })
    .select("-password")
    .sort("-createdAt");
};

const updateUserService = async (userId: string, payload: Partial<IUser>) => {
  const updatedData = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  if (!updatedData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not Found");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...restData } = updatedData.toObject();

  return restData;
};

const getProfileService = async (userId: string) => {
  const data = await User.findById(userId).select("-password");
  return data;
};

export const userService = {
  createUserService,
  getAllUserService,
  getAllReceiverService,
  updateUserService,
  getProfileService,
};
