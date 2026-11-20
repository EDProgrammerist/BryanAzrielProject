import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import { ENV } from "@/config/env";
import routes from "@/routes/index";
import { errorHandler } from "@/middlewares/errorHandler";

const app = express();

app.use(helmet());
app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(hpp());

app.get("/", (_req, res) => {
  res.json({
    status: "success",
    message: "SMS API is running",
    timestamp: new Date().toISOString()
  });
});

app.use("/api", routes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

export default app;