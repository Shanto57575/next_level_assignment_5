/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { ParcelService } from "./parcel.service";

const createParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parcelInfo = await ParcelService.createParcelService(req, req.body);

    sendResponse(res, {
      success: true,
      message: "parcel created Successfully",
      statusCode: httpStatus.CREATED,
      data: parcelInfo,
    });
  }
);

const updateParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parcelInfo = await ParcelService.updateParcelService(
      req,
      req.params.id,
      req.body
    );

    sendResponse(res, {
      success: true,
      message: "parcel Status updated Successfully",
      statusCode: httpStatus.OK,
      data: parcelInfo,
    });
  }
);

const getMyParcels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const myAllParcels = await ParcelService.getMyParcelService(
      req.params.id,
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      message: "my parcels retrieved Successfully",
      statusCode: httpStatus.OK,
      data: myAllParcels,
    });
  }
);

const getAllParcels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const AllParcels = await ParcelService.getAllParcelService(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      message: "All parcels retrieved Successfully",
      statusCode: httpStatus.OK,
      data: AllParcels,
    });
  }
);

const trackParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const AllParcels = await ParcelService.trackParcelService(
      query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      message: "parcel retrieved Successfully",
      statusCode: httpStatus.OK,
      data: AllParcels,
    });
  }
);

export const ParcelController = {
  createParcel,
  updateParcel,
  getMyParcels,
  getAllParcels,
  trackParcel,
};
