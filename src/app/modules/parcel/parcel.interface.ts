import { Types } from "mongoose";

export enum ParcelStatus {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  DISPATCHED = "DISPATCHED",
  CANCELLED = "CANCELLED",
  CONFIRMED = "CONFIRMED",
}

export enum ParcelType {
  DOCUMENT = "DOCUMENT",
  PACKAGE = "PACKAGE",
  FRAGILE = "FRAGILE",
  OVERSIZED = "OVERSIZED",
}

export interface IStatus {
  status: ParcelStatus;
  updatedAt?: Date;
  updatedBy?: Types.ObjectId;
  note?: string;
}

export interface IParcel {
  trackingId: string;
  parcelType: ParcelType;
  weight: number;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  address: string;
  fee: number;
  deliveryDate: Date;
  statusLogs: IStatus[];
}

export interface ParcelUpdatePayload {
  parcelType?: ParcelType;
  weight?: number;
  sender?: Types.ObjectId;
  receiver?: Types.ObjectId;
  address?: string;
  fee?: number;
  deliveryDate?: Date;
  statusLog?: IStatus;
}
