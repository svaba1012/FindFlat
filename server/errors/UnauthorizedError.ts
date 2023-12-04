import { SerializableError, StandardizedErrors } from "./SerializableError";

export class UnauthorizedError extends SerializableError {
  status = 401;
  constructor() {
    super("Unauthorized request");
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
  serializeError(): StandardizedErrors {
    return [{ message: "Unauthorized request" }];
  }
}
