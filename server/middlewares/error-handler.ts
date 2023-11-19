import { NextFunction, Response, Request } from "express";

import { SerializableError } from "../errors/SerializableError";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof SerializableError) {
    res.status(error.status).send({ errors: error.serializeError() });
    return;
  }
  console.log("Something went wrong");
  res.status(400).send({ msg: error.message });
};
