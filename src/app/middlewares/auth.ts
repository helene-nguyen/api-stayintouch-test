//~ Import module
import { ErrorApi } from '../services/errorHandler.js';
import { Request, Response, NextFunction } from 'express';

//~ Authentication
function auth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) throw new ErrorApi(req, res, 401, `User not connected !`);

  next();
}

function admin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') throw new ErrorApi(req, res, 403, `You cannot access this info, you're not admin, go away !`);
  next();
}

export { auth, admin };
