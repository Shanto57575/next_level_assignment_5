"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: zod_1.default.email(),
    password: zod_1.default
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%!^&*?])[A-Za-z\d@#$%!^&*?]{8,}$/, {
        error: "Password must be 8+ characters with at least one lowercase, uppercase, digit, and special character (@#$%!^&*?).",
    }),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+8801|8801|01)[3-9]\d{8}$/)
        .optional(),
    role: zod_1.default.enum(user_interface_1.Role).optional(),
    address: zod_1.default.string().optional(),
    isDeleted: zod_1.default.boolean().optional(),
    isVerified: zod_1.default.boolean().optional(),
});
