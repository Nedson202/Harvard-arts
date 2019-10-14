import { Request, Response, NextFunction } from 'express';
import { stackLogger } from 'info-logger';

const errorHandler = (error, req: Request, res: Response, next: NextFunction) => {
  stackLogger(error);
  return res.sendStatus(error.httpStatusCode).json({
    error: true,
    message: error.message,
  });
};

export default errorHandler;
