import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else {
    // For other errors, use the error message
    message = err.message || 'Internal Server Error';
  }

  // Log error with full details
  console.error('\n=== ERROR DETAILS ===');
  console.error(`URL: ${req.method} ${req.url}`);
  console.error(`Status: ${statusCode}`);
  console.error(`Message: ${message}`);
  console.error(`Error Name: ${err.name}`);
  console.error('Full Error:', err);
  if (err.stack) {
    console.error('Stack:', err.stack);
  }
  console.error('===================\n');

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.name,
      ...(process.env.NODE_ENV === 'development' && {
        details: err.message,
        stack: err.stack,
      }),
    },
  });
};
