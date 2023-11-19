import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieSession from "cookie-session";
import dotenv from "dotenv";

import { authRouter } from "./routes/auth-route";
import { errorHandler } from "./middlewares/error-handler";

dotenv.config();
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      JWT_KEY: string;
      DATABASE_URL: string;
      // add more environment variables and their types here
    }
  }
}

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(
  cookieSession({
    signed: false,
    maxAge: 15 * 60 * 1000, // 15 minutes
  })
);

app.use("/api/users", authRouter);

app.use(errorHandler);

export { app };
