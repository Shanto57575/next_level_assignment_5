import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import app from "./app";
import { SeedAdmin } from "./app/utils/seedAdmin";

let server: Server;
const PORT = envVars.PORT;

const startServer = async () => {
  try {
    const dbConnection = await mongoose.connect(envVars.DATABASE_URL);
    console.log(
      `MongoDB Connected! Connection Host: ${dbConnection.connection.host}`
    );
    server = app.listen(PORT, () => {
      console.log(`Server is running on PORT : ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
  await SeedAdmin();
})();

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... Server Shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received... Server Shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection received... Server Shutting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("uncaughtException received... Server Shutting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
