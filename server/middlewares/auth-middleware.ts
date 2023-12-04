import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { UnauthorizedError } from "../errors/UnauthorizedError";

interface UserPayload {
  id: string;
  email: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session || !req.session.jwt) {
    next(new UnauthorizedError());
    return;
  }
  try {
    let curUser = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY
    ) as UserPayload;
    req.currentUser = curUser;
  } catch (err) {
    next(new UnauthorizedError());
    return;
  }

  next();
};
