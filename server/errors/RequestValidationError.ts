import { ValidationError } from "express-validator";
import { SerializableError, StandardizedErrors } from "./SerializableError";

export class RequestValidationError extends SerializableError {
  status = 400;
  constructor(public errors: ValidationError[]) {
    super("Request validation error");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError(): StandardizedErrors {
    return this.errors.map((err: ValidationError) => {
      if (err.type == "field") {
        return { message: err.msg, field: err.path };
      }
      return { message: err.msg };
    });
  }
}
