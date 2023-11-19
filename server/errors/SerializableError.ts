export type StandardizedErrors = {
  message: string;
  field?: string;
}[];

export abstract class SerializableError extends Error {
  abstract status: number;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, SerializableError.prototype);
  }
  abstract serializeError(): StandardizedErrors;
}
