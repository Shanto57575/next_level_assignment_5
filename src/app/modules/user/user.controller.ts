/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { userService } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userInfo = await userService.createUserService(req.body);

    sendResponse(res, {
      success: true,
      message: "User created Successfully",
      statusCode: httpStatus.CREATED,
      data: userInfo,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const allUserInfo = await userService.getAllUserService(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      message: "all user retrieved Successfully",
      statusCode: httpStatus.OK,
      data: allUserInfo,
    });
  }
);

const getAllReceiver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const allReceiversInfo = await userService.getAllReceiverService();

    sendResponse(res, {
      success: true,
      message: "all receivers retrieved Successfully",
      statusCode: httpStatus.OK,
      data: allReceiversInfo,
    });
  }
);

const getProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const userInfo = await userService.getProfileService(decodedToken._id);

    sendResponse(res, {
      success: true,
      message: "user info retrieved successfully",
      statusCode: httpStatus.OK,
      data: userInfo,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedData = await userService.updateUserService(
      req.params.id,
      req.body
    );

    sendResponse(res, {
      success: true,
      message: "User Updated Successfully",
      statusCode: httpStatus.OK,
      data: updatedData,
    });
  }
);

export const userController = {
  createUser,
  getAllUsers,
  getAllReceiver,
  getProfile,
  updateUser,
};
