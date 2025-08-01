import httpStatus from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { User } from "../user/user.model";
import { IParcel, ParcelStatus, ParcelUpdatePayload } from "./parcel.interface";
import { trackingIdGenerator } from "../../utils/trakingIdGenerator";
import { Parcel } from "./parcel.model";
import { Request } from "express";
import { Role } from "../user/user.interface";

const createParcelService = async (req: Request, payload: IParcel) => {
  const { sender, receiver, ...rest } = payload;

  if (sender === receiver) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Sender & Receiver must be different"
    );
  }

  const isSenderExists = await User.findById(sender);
  const isReceiverExists = await User.findById(receiver);

  if (!isSenderExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Sender doesn't Exists");
  }
  if (!isReceiverExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver doesn't Exists");
  }

  if (isSenderExists.role !== Role.SENDER) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User role is ${isSenderExists.role}, but you assigned him as ${Role.SENDER}`
    );
  }

  if (isReceiverExists.role !== Role.RECEIVER) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User role is ${isReceiverExists.role}, but you assigned him as ${Role.RECEIVER}`
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  let trackingId: string = "";
  let isUnique = false;

  while (!isUnique) {
    trackingId = trackingIdGenerator();
    const existing = await Parcel.findOne({ trackingId });
    if (!existing) {
      isUnique = true;
    }
  }

  const parcelPayload: Partial<IParcel> = {
    ...rest,
    sender,
    receiver,
    trackingId,
    statusLogs: [
      {
        status: ParcelStatus.REQUESTED,
      },
    ],
  };

  const newParcel = await Parcel.create(parcelPayload);

  await Promise.all([
    User.findByIdAndUpdate(sender, {
      $push: { sentParcels: newParcel._id },
    }),
    User.findByIdAndUpdate(receiver, {
      $push: { receivedParcels: newParcel._id },
    }),
  ]);

  return newParcel;
};

const updateParcelService = async (
  req: Request,
  parcelId: string,
  payload: ParcelUpdatePayload
) => {
  const { statusLog, ...restPayload } = payload;

  // is parcel exists?
  const isParcelExists = await Parcel.findById(parcelId);
  if (!isParcelExists) {
    throw new AppError(httpStatus.NOT_FOUND, "parcel doesn't exists");
  }

  // checking if ever it was dispatched
  const isDispatched = isParcelExists.statusLogs.some(
    (log) => log.status === ParcelStatus.DISPATCHED
  );

  // checking one who is trying to cancel is actually the sender
  if (
    statusLog?.status === ParcelStatus.CANCELLED &&
    req.user.role !== Role.SENDER
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Your Are not Authorized to cancel this parcel"
    );
  }

  if (isDispatched && statusLog?.status === ParcelStatus.CANCELLED) {
    // if dispatched cant cancel
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "parcel already dispatched you cant cancel it now"
    );
  }

  if (
    statusLog?.status === ParcelStatus.CONFIRMED &&
    isParcelExists.receiver.toString() != req.user._id.toString()
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
  }

  const updatedParcel = await Parcel.findByIdAndUpdate(parcelId, restPayload, {
    new: true,
    runValidators: true,
  });

  if (statusLog) {
    updatedParcel?.statusLogs.push({
      status: statusLog.status,
      updatedBy: req.user._id,
      updatedAt: new Date(),
      note: statusLog.note,
    });
    await updatedParcel?.save();
  }

  return updatedParcel;
};

const getMyParcelService = async (
  userId: string,
  query: Record<string, string>
) => {
  const isUserExists = await User.findById(userId);
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
  }
  const allParcels = await Parcel.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate("sender", "name email")
    .populate("receiver", "name email");

  let filteredParcels = allParcels;

  if (query.status) {
    filteredParcels = allParcels.filter((parcel) => {
      const logs = parcel.statusLogs;
      const latestStatus = logs?.[logs.length - 1]?.status;
      return latestStatus === query.status;
    });
  }

  if (!filteredParcels) {
    throw new AppError(httpStatus.NOT_FOUND, "No parcel Found");
  }

  return filteredParcels;
};

const getAllParcelService = async () => {
  return await Parcel.find();
};

export const ParcelService = {
  createParcelService,
  updateParcelService,
  getMyParcelService,
  getAllParcelService,
};
