import { Router } from "express";

import notificationController from "../controllers/notification-controller";
import { requireAuth } from "../middlewares/auth-middleware";
const notificationRouter = Router();

notificationRouter.get(
  "/",
  requireAuth,
  notificationController.getUserNotifications
);
notificationRouter.post(
  "/",
  requireAuth,
  notificationController.writeUserNotification
);

notificationRouter.delete(
  "/:id",
  requireAuth,
  notificationController.deleteUserNotification
);
notificationRouter.patch(
  "/:id",
  requireAuth,
  notificationController.editUserNotification
);

export { notificationRouter };
