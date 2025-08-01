import { model, Schema } from "mongoose";
import { IParcel, ParcelStatus, ParcelType } from "./parcel.interface";

const statusLogSchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    note: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const parcelSchema = new Schema<IParcel>(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
    },
    parcelType: {
      type: String,
      enum: Object.values(ParcelType),
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    statusLogs: {
      type: [statusLogSchema],
      required: true,
    },
  },
  { timestamps: true }
);

export const Parcel = model<IParcel>("Parcel", parcelSchema);
