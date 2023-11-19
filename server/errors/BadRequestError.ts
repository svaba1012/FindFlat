import { SerializableError, StandardizedErrors } from "./SerializableError";

export class BadRequestError extends SerializableError {
  status = 400;

  constructor(public message: string, public field: string = "") {
    super("Bad request - " + message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeError(): StandardizedErrors {
    return [{ message: this.message, field: this.field }];
  }
}
