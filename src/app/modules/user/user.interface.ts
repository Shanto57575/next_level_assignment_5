import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IAuthProvider {
  provider: "credentials";
  providerId: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  isDeleted?: boolean;
  isVerified?: boolean;
  isActive?: IsActive;
  role: Role;
  auths: IAuthProvider;
  sentParcels?: Types.ObjectId[];
  receivedParcels?: Types.ObjectId[];
}
