import bcrypt from "bcrypt";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { createUserTokens } from "../../utils/userTokens";

const loginService = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExists = await User.findOne({ email });

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
  }

  const isPasswordMatched = await bcrypt.compare(
    password as string,
    isUserExists.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid Credentials!");
  }

  if (
    isUserExists.isActive === IsActive.INACTIVE ||
    isUserExists.isActive === IsActive.BLOCKED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You are ${isUserExists.isActive}`
    );
  }

  if (isUserExists.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User Is Deleted");
  }

  const jwtPayload = {
    email: isUserExists.email,
    role: isUserExists.role,
    _id: isUserExists._id,
  };

  const userTokens = createUserTokens(jwtPayload);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExists.toObject();

  return {
    userTokens,
    user: rest,
  };
};

export const authService = {
  loginService,
};
