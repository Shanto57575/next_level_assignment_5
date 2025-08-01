import express, { Request, Response } from "express";
import { notFound } from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { router } from "./app/router";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: `Parcel Delivery system is running Fine` });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);
export default app;
