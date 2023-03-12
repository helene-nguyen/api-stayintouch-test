/* eslint-disable @typescript-eslint/no-non-null-assertion */
//~ Import modules
import { ErrorApi } from '../services/errorHandler.js';
import { Request, Response } from 'express';
import { User } from '../datamappers/index.js';
//~ Authorization
import { generateAccessToken, generateRefreshToken } from '../services/jsonWebToken.js';
//~ Import Debug
import debug from 'debug';
const logger = debug('Controller');

//& -------- doSignIn
const doSignIn = async (req: Request, res: Response) => {
  try {
    const { first_name } = req.body;

    const userExist = await User.findOne(first_name);
    if (!userExist) throw new ErrorApi(req, res, 401, `Informations not valid !`);

    //~ Authorization JWT
    const accessToken = generateAccessToken({ userExist });
    const refreshToken = generateRefreshToken({ userExist }, req);
    const userIdentity = { ...userExist, accessToken, refreshToken };

    //~ Result
    return res.status(200).json(userIdentity);
  } catch (err) {
    if (err instanceof Error) logger(err.message);
  }
};

const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    const { limit, start } = req.body;

    const users = await User.findAll(limit, start);
    //~ Result
    return res.status(200).json(users);
  } catch (err) {
    if (err instanceof Error) logger(err.message);
  }
};

const fetchNearbyUsers = async (req: Request, res: Response) => {
  try {
    const userId = +req.params.userId;
    const { radius } = req.body;
    if (!radius) throw new ErrorApi(req, res, 401, `Add a radius if you want to find someone near by you!`);

    const users = await User.findAllNearbyUsers(userId, radius);

    //~ Result
    return res.status(200).json(users);
  } catch (err) {
    if (err instanceof Error) logger(err.message);
  }
};


export { doSignIn, fetchAllUsers, fetchNearbyUsers };
