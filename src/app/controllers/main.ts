//~ Import modules
import debug from 'debug';
const logger = debug('Controller');
import { Request, Response } from 'express';

//~ Controller methods
const renderHomePage = (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      message: 'Welcome to API StayInTouch',
    });
  } catch (err) {
    if (err instanceof Error) logger(err.message);
  }
};

export { renderHomePage };
