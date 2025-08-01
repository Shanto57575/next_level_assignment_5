import { Types } from "mongoose";
import z from "zod";
import { ParcelStatus, ParcelType } from "./parcel.interface";

const objectId = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId",
});

export const createParcelZodSchema = z.object({
  parcelType: z.enum(ParcelType),
  weight: z.number().positive(),
  sender: objectId,
  receiver: objectId,
  address: z.string().min(1, "Address is required"),
  fee: z.number().nonnegative("Fee must be 0 or positive"),
  deliveryDate: z.coerce.date(),
  statusLogs: z
    .array(
      z.object({
        status: z.enum(ParcelStatus),
        updatedAt: z.coerce.date().optional(),
        updatedBy: objectId.optional(),
        note: z.string().optional(),
      })
    )
    .optional(),
});

export const updatedParcelZodSchema = z.object({
  parcelType: z.enum(ParcelType).optional(),
  weight: z.number().positive().optional(),
  sender: objectId.optional(),
  receiver: objectId.optional(),
  address: z.string().min(1, "Address is required").optional(),
  fee: z.number().nonnegative("Fee must be 0 or positive").optional(),
  deliveryDate: z.coerce.date().optional(),
  statusLog: z
    .object({
      status: z.enum(ParcelStatus),
      updatedAt: z.coerce.date().optional(),
      updatedBy: objectId.optional(),
      note: z.string().optional(),
    })
    .optional(),
});
