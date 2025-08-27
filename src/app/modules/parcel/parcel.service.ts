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

  // is parcel exists
  const isParcelExists = await Parcel.findById(parcelId);
  if (!isParcelExists) {
    throw new AppError(httpStatus.NOT_FOUND, "parcel doesn't exists");
  }

  // checking if ever it was dispatched
  const isDispatched = isParcelExists.statusLogs.some(
    (log) => log.status === ParcelStatus.DISPATCHED
  );

  if (isDispatched && statusLog?.status !== ParcelStatus.CONFIRMED) {
    throw new AppError(httpStatus.UNAUTHORIZED, "parcel already dispatched");
  }

  // checking one who is trying to cancel is actually the sender or not
  if (
    statusLog?.status === ParcelStatus.CANCELLED &&
    req.user.role !== Role.SENDER
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Only Sender can cancel parcel"
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
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Only Receiver can Confirm status"
    );
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

  const filters = {
    $and: [
      {
        $or: [{ sender: userId }, { receiver: userId }],
      },
      { trackingId: { $regex: query.searchTerm || "", $options: "i" } },
    ],
  };

  const total = await Parcel.countDocuments(filters);

  const allParcels = await Parcel.find(filters)
    .populate("sender", "name email")
    .populate("receiver", "name email")
    .populate("statusLogs.updatedBy", "name email role")
    .sort(query.sort === "OLDEST" ? "createdAt" : "-createdAt")
    .skip((parseInt(query.page) - 1) * parseInt(query.limit))
    .limit(parseInt(query.limit));

  return { data: allParcels, total };
};

const getAllParcelService = async (query: Record<string, string>) => {
  const { page, limit, searchTerm = "" } = query;
  const totalParcel = await Parcel.countDocuments();

  const result = await Parcel.find({
    trackingId: { $regex: searchTerm, $options: "i" },
  })
    .populate("receiver", "name email")
    .populate("sender", "name email")
    .populate("statusLogs.updatedBy", "name email role")
    .sort(query.sort === "OLDEST" ? "createdAt" : "-createdAt")
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit));

  return { result, totalParcel };
};

const trackParcelService = async (query: Record<string, string>) => {
  return await Parcel.find({
    trackingId: { $regex: query.trackingId, $options: "i" },
  })
    .populate("receiver", "name email")
    .populate("sender", "name email")
    .populate("statusLogs.updatedBy", "name email role");
};

const getParcelAnalyticsService = async () => {
  // 1️⃣ Total parcels by status
  const statusAggregation = await Parcel.aggregate([
    { $unwind: "$statusLogs" },
    { $sort: { "statusLogs.updatedAt": 1 } },
    {
      $group: {
        _id: "$statusLogs.status",
        count: { $sum: 1 },
      },
    },
  ]);

  // 2️⃣ Parcels per type
  const typeAggregation = await Parcel.aggregate([
    {
      $group: {
        _id: "$parcelType",
        count: { $sum: 1 },
      },
    },
  ]);

  // 3️⃣ Parcels created per day
  const dailyAggregation = await Parcel.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
        totalFee: { $sum: "$fee" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // 4️⃣ Total parcels sent vs received per user (optional)
  const userAggregation = await Parcel.aggregate([
    {
      $facet: {
        sent: [
          { $group: { _id: "$sender", count: { $sum: 1 } } },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          {
            $project: {
              _id: 0,
              name: "$user.name",
              email: "$user.email",
              count: 1,
            },
          },
        ],
        received: [
          { $group: { _id: "$receiver", count: { $sum: 1 } } },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          {
            $project: {
              _id: 0,
              name: "$user.name",
              email: "$user.email",
              count: 1,
            },
          },
        ],
      },
    },
  ]);

  return {
    status: statusAggregation,
    types: typeAggregation,
    daily: dailyAggregation,
    users: userAggregation[0],
  };
};

export const ParcelService = {
  createParcelService,
  updateParcelService,
  getMyParcelService,
  getAllParcelService,
  trackParcelService,
  getParcelAnalyticsService,
};
