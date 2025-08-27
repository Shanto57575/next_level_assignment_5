import express, { Request, Response } from "express";
import { notFound } from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { router } from "./app/router";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://parcel-delivery-system-frontend-phi.vercel.app",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: `Parcel Delivery system is running Fine` });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);
export default app;
