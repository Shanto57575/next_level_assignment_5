"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatedParcelZodSchema = exports.createParcelZodSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = __importDefault(require("zod"));
const parcel_interface_1 = require("./parcel.interface");
const objectId = zod_1.default.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});
exports.createParcelZodSchema = zod_1.default.object({
    parcelType: zod_1.default.enum(parcel_interface_1.ParcelType),
    weight: zod_1.default.number().positive(),
    sender: objectId,
    receiver: objectId,
    address: zod_1.default.string().min(1, "Address is required"),
    fee: zod_1.default.number().nonnegative("Fee must be 0 or positive"),
    deliveryDate: zod_1.default.coerce.date(),
    statusLogs: zod_1.default
        .array(zod_1.default.object({
        status: zod_1.default.enum(parcel_interface_1.ParcelStatus),
        updatedAt: zod_1.default.coerce.date().optional(),
        updatedBy: objectId.optional(),
        note: zod_1.default.string().optional(),
    }))
        .optional(),
});
exports.updatedParcelZodSchema = zod_1.default.object({
    parcelType: zod_1.default.enum(parcel_interface_1.ParcelType).optional(),
    weight: zod_1.default.number().positive().optional(),
    sender: objectId.optional(),
    receiver: objectId.optional(),
    address: zod_1.default.string().min(1, "Address is required").optional(),
    fee: zod_1.default.number().nonnegative("Fee must be 0 or positive").optional(),
    deliveryDate: zod_1.default.coerce.date().optional(),
    statusLog: zod_1.default
        .object({
        status: zod_1.default.enum(parcel_interface_1.ParcelStatus),
        updatedAt: zod_1.default.coerce.date().optional(),
        updatedBy: objectId.optional(),
        note: zod_1.default.string().optional(),
    })
        .optional(),
});
