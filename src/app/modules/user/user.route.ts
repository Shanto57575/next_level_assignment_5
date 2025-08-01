import { Router } from "express";
import { userController } from "./user.controller";
import { ZodValidation } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/create-user",
  ZodValidation(createUserZodSchema),
  userController.createUser
);

router.get("/all-users", checkAuth(Role.ADMIN), userController.getAllUsers);

router.patch("/:id", checkAuth(Role.ADMIN), userController.updateUser);

export const userRoutes = router;
