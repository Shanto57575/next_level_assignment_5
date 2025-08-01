import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import { verifyToken } from "../utils/userTokens";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
    }

    const verifiedToken = verifyToken(
      accessToken,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;

    const isUserExists = await User.findById(verifiedToken._id);

    if (!isUserExists) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
    }

    if (isUserExists.isActive === IsActive.BLOCKED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `User is ${isUserExists.isActive}`
      );
    }

    if (isUserExists.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "USER IS DELETED!");
    }

    if (!authRoles.includes(verifiedToken.role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
    }

    req.user = verifiedToken;
    next();
  };
