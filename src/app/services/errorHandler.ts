import { errorLoggerHandling } from '../../app/services/errorLoggerHandling.js';
import { Request, Response } from 'express';

class ErrorApi extends Error {
  constructor(req: Request, res: Response, statusCode = 500, message: string) {
    super(message);
    res.status(statusCode).json({ message: message });

    //~ Log errors
    errorLoggerHandling(message, req, res);
  }
}

export { ErrorApi };
