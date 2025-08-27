import { Router } from "express";
import { ZodValidation } from "../../middlewares/validateRequest";
import { ParcelController } from "./parcel.controller";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import {
  createParcelZodSchema,
  updatedParcelZodSchema,
} from "./parcel.validation";

const router = Router();

router.post(
  "/create-parcel",
  checkAuth(Role.SENDER),
  ZodValidation(createParcelZodSchema),
  ParcelController.createParcel
);

router.get(
  "/all-parcels",
  checkAuth(Role.ADMIN),
  ParcelController.getAllParcels
);

router.get(
  "/analytics",
  checkAuth(Role.ADMIN),
  ParcelController.getParcelAnalytics
);

router.get("/parcel-tracker", ParcelController.trackParcel);

router.get(
  "/my-parcels/:id",
  checkAuth(...Object.values(Role)),
  ParcelController.getMyParcels
);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  ZodValidation(updatedParcelZodSchema),
  ParcelController.updateParcel
);

export const parcelRoutes = router;
