import z from "zod";
import { Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  email: z.email(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%!^&*?])[A-Za-z\d@#$%!^&*?]{8,}$/,
      {
        error:
          "Password must be 8+ characters with at least one lowercase, uppercase, digit, and special character (@#$%!^&*?).",
      }
    ),
  phone: z
    .string()
    .regex(/^(?:\+8801|8801|01)[3-9]\d{8}$/)
    .optional(),
  role: z.enum(Role).optional(),
  address: z.string().optional(),
  isDeleted: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});
