import express from "express";

import { requireAuth } from "../middlewares/auth-middleware";
import {
  getFlats,
  setFlatEmainNotification,
} from "../controllers/flat-controller";

let flatRouter = express.Router();

flatRouter.get("/", getFlats);

export { flatRouter };
