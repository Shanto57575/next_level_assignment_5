/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";
import { SetAuthCookie } from "../../utils/setAuthCookie";

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInInfo = await authService.loginService(req.body);

    SetAuthCookie(res, loggedInInfo.userTokens);

    sendResponse(res, {
      success: true,
      message: "logged in Successfully",
      statusCode: httpStatus.OK,
      data: loggedInInfo,
    });
  }
);

export const authController = {
  login,
};
