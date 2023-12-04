import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieSession from "cookie-session";
import dotenv from "dotenv";

import { authRouter } from "./routes/auth-routes";
import { errorHandler } from "./middlewares/error-handler";
import { flatRouter } from "./routes/flat-routes";

dotenv.config();
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      JWT_KEY: string;
      JWT_TEMP_KEY: string;
      EMAIL_JWT_KEY: string;
      DATABASE_URL: string;
      EMAIL_PASS: string;
      EMAIL_ADDRESS: string;
      // add more environment variables and their types here
    }
  }
}

const app = express();

app.set("trust proxy", 1); // trust first proxy

app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(
  cookieSession({
    name: "session",
    path: "/",
    signed: false,
    // maxAge: 15 * 60 * 1000, // 15 minutes
  })
);

app.use("/api/users", authRouter);
app.use("/api/flats", flatRouter);

app.use(errorHandler);

export { app };
