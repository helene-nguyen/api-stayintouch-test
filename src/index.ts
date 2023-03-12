/* eslint-disable @typescript-eslint/no-non-null-assertion */
//~Import modules
// for environment variables
import 'dotenv/config';

// for the server
import express, { Request, Response } from 'express';
const app = express();

// for routes
import { router } from './app/routes/index.js';

// for handling errors
import { ErrorApi } from './app/services/errorHandler.js';

// protect the api
import helmet from 'helmet';
app.use(helmet());

// debug
import debug from 'debug';
const logger = debug('Entrypoint');

// Encoding parsing the body
//accept Content-type: application/json
app.use(express.json());
// accept Content-type: application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: false,
  })
);

//~ Cors
app.use((req : Request, res: Response, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  // Accept credentials (cookies) sent by the client

  next();
});

import session from 'express-session';
app.use(
  session({
    saveUninitialized: false,
    resave: true,
    proxy: true,
    secret: process.env.SESSION_SECRET!,
    cookie: {
      httpOnly: true,
      secure: true, // set to false if no jwt to test
      sameSite: 'lax', // or 'strict'
      maxAge: 24 * 60 * 60 * 1000, //24 hours
      expires: new Date(Date.now() + 60 * 60 * 1000), //1 hour
    },
  })
);

//~ Router
app.use(router);

//~ Error 404 NOT Found
app.use((req, res) => {
  throw new ErrorApi(req, res, 404, `Page not found !`);
});

//~ Launch Server
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  logger(`🚀\x1b[1;35m Launch server on http://localhost:${PORT}\x1b[0m`);
});
