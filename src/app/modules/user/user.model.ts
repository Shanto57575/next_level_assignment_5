import { model, Schema, Types } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  { _id: false, versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.RECEIVER,
    },
    auths: authProviderSchema,
    sentParcels: [
      {
        type: Types.ObjectId,
        ref: "Parcel",
      },
    ],
    receivedParcels: [
      {
        type: Types.ObjectId,
        ref: "Parcel",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export const User = model<IUser>("User", userSchema);
