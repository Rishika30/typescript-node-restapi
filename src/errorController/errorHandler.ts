import { Request, Response } from 'express';
import { AppError } from './appError';

interface Error {
    statusCode?: number;
    message: string;
    stack: string;
}

const errorHandler = (err:Error, req:Request, res:Response) => {
  if (err instanceof AppError) {
    const { statusCode } = err;
    res.status(statusCode).json({
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

export default errorHandler;
