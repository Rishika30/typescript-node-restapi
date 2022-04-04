// eslint-disable-next-line import/prefer-default-export
export class AppError extends Error {
  readonly statusCode;

  constructor(message:string, statusCode) {
    super(<string>message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
