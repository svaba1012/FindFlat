import { SerializableError, StandardizedErrors } from "./SerializableError";

export class NotFoundError extends SerializableError {
  status = 404;

  constructor(public msg: string) {
    super(msg);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeError(): StandardizedErrors {
    return [{ message: this.msg }];
  }
}
