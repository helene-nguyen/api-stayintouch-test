/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import jwt from 'jsonwebtoken';
import { ErrorApi } from '../../app/services/errorHandler.js';
import debug from 'debug';
const logger = debug('Jwt');
import { Request, Response, NextFunction } from 'express';

function validateToken(req: Request, res: Response, next: NextFunction) {
  try {
    //   get token from header
    const authHeader = req.headers['authorization'];

    if (authHeader === undefined) throw new ErrorApi(req, res, 400, 'No token found !');

    //header contains token "Bearer <token>", split the string and get the 2nd part of the array
    const accessToken = authHeader.split(' ')[1];

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, (err: unknown, user: any) => {
      if (err) {
        throw new ErrorApi(req, res, 403, 'The token is invalid!');
      }
      req.user = user.userExist;

      req.session.token = accessToken;

      next();
    });
  } catch (err) {
    if (err instanceof Error) logger(err.message);
  }
}

export { validateToken };
