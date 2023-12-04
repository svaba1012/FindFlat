import { Router } from "express";
import { body } from "express-validator";

import userController from "../controllers/user-controller";
import { validateRequest } from "../middlewares/request-validation-middleware";
import { requireAuth } from "../middlewares/auth-middleware";

const authRouter = Router();

authRouter.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be betwean 4 and 20 chars"),
    // body("password")
    //   .trim()
    //   .contains("/^[0-9]*$/")
    //   .withMessage("Password must contain at least 1 digit"),
    body("username")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Username must be betwean 4 and 20 chars"),
    body("username")
      .trim()
      .isAlphanumeric()
      .withMessage("Username can contain only alphanumeric chars"),
  ],
  validateRequest,
  userController.signup
);
authRouter.post(
  "/signin",
  [
    body("emailOrUsername")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Invalid email, username or password"),
    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Invalid email, username or password"),
  ],
  validateRequest,
  userController.signin
);
authRouter.post("/signout", requireAuth, userController.signout);
authRouter.get("/confirm/:id", userController.confirmEmail);

export { authRouter };
