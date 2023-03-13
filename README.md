# Stay In Touch challenge

## Introduction

This API was made for personnal challenge in 8 hours of work.
This is a RESTful API let you find people around you.

I've built it to cover from database to deployment.

Work with NodeJS, Docker, PostgreSQL, Portainer & Nginx proxy Manager, and so on. For the details about all of the technologies I used, jump [here](#technologies) :)

Take it as an example and not as a finished work.

The basic instructions for the challenge are the followings :

- Create an API that you can log in using jwt
- List users with pagination response
- List users within specific geo radius

I really enjoyed doing this !

Hope it helps !

---

## Summary

- [Technologies](#technologies)
- [Requirements](#requirements)
- [Get started](#get-started)
- [User story](#user-story)
- [Some Rules](#rules)
- [Data Models](#data-models)
- [Endpoints](#endpoints)
- [Folder structure](#folder-structure)
- [Server configuration](#server-configuration)
- [Routes](#routes)
- [Controllers](#controllers)
- [Server launched](#server-launched)
- [Connect database PostgreSQL](#connect-database-postgresql)
- [Handle errors](#handle-errors)
- [Favorite part SQL](#favorite-part-sql)
- [Authentication JWT](#authentication-jwt)
- [API works](#api-works)
- [Cloud RaspberryPi](#cloud-raspberrypi)
- [Docker and docker compose](#docker-and-docker-compose)
- [Migration database in Docker](#migration-database-in-docker)
- [Portainer and Nginx Proxy Manager](#portainer-and-nginx-proxy-manager)
- [Domain name](#domain-name)
- [Firewall rules](#firewall-rules)
- [API online](#api-online)
- [Makefile usage](#makefile-usage)
- [Conclusion](#conclusion)
- [Sources](#sources)

---

## Technologies

You can find below the list of technologies I used for this, maybe you are using it too !

_Dependencies_

- Node JS v19.7.0

- Express v4.18.2
- Express-session v4.18.2
- Dotenv v16.0.3
- Helmet v6.0.1
- Json Web Token v9.0.0
- pg v8.10.0

_Dev dependencies_

- Typescript v4.9.5
- Concurrently v7.6.0
- Debug v4.3.4
- Eslint v8.36.0

_Deployment environment_

- RaspberryPi as a server
- Docker v23.0.1
- Docker compose v2
- Portainer v2.16.2
- Nginx Proxy Manager v2.9.19

_Domain name_

- Duckdns

_Database_

- PostgreSQL v15.1
- PostGis extension (PostgreSQL 11 to 15 versions only)

_Tools_

- pgAdmin4 v6.20
- Insomnia v2022.7.5
- Postman v10.11.1

_CLI terminal_

- Bash v5.1.4
- Make v4.3

_IDE_

- VSCodium v1.76.1

OOOOOK !! Once you know all of that, let's go !

[Link to summary](#summary)

## Requirements

If you want to install, deploy, use this repo, you need to have Node, Docker and Docker compose v2 installed.

For the deployment of your database you need to pull PostGis image as we want to work with spatial geometry.

You can find all the links in [Sources](#sources).

[Link to summary](#summary)

## Get started

In the next sections you'll find my work and reflections, thoughts and conclusions. You can add improvements, you can play with this repo.

If you find something that can help me improve my skills, you can contact me. I'm interested in any feedback.

My goal was to make it as easy as possible to work from a local startup server to deploy online, to create queries for some optimisations (because, you know, I love PostgreSQL and I need to practice!), and to see if I can improve it.

[Link to summary](#summary)

## User story

The story is as follows: As a user of the application, I want to find the nearest users around me.
I can access all users, set a limit on the page and find users around me with a filter that defines the distance radius where other users are.

I've made a super drawing (haha) .. Let's see this :

![map](./__docs/media/2023-03-11-test-technique-5.png)

[Link to summary](#summary)

## Rules

For the current API there is a list of some "rules" to consider:

- The unit is only in km
- There is no limit for the radius
- User 1 is the only one, he's the admin (you can change it)
- To login, we will use only the first name for simplicity
- Only the Admin has access to this information.

[Link to summary](#summary)

## Data Models

I have used the following table structure :

![DM](./__docs/media/DM.png)

[Link to summary](#summary)

## Endpoints

And here are the endpoints of the application:

### <u>User</u>

/api/v1/--

| Method | Route                    | Description                                   | Returns     |
| ------ | ------------------------ | --------------------------------------------- | ----------- |
| POST   | --/users/signin          | User authentication                           | json object |
| GET    | --/users                 | Fetch all users                               | json object |
| GET    | --/users/:id/nearbyusers | Fetch all nearby users with a specific radius | json object |

[Link to summary](#summary)

## Folder structure

You can find my folder structure here :

```sh
├── src
|  ├── app
|  |  ├── controllers
|  |  |  ├── main.ts
|  |  |  └── user.ts
|  |  ├── database
|  |  |  └── connexion.ts
|  |  ├── datamappers
|  |  |  ├── coreDataMapper.ts
|  |  |  ├── index.ts
|  |  |  └── user.ts
|  |  ├── middlewares
|  |  |  ├── auth.ts
|  |  |  └── validateToken.ts
|  |  ├── routes
|  |  |  ├── index.ts
|  |  |  ├── main.ts
|  |  |  └── user.ts
|  |  ├── services
|  |  |  ├── errorHandler.ts
|  |  |  ├── errorLoggerHandling.ts
|  |  |  └── jsonWebToken.ts
|  |  ├── Types
|  |  |  ├── custom.ts
|  |  |  └── express
|  |  |     └── module.d.ts
|  |  └── utils
|  |     └── formattedDate.ts
|  └── index.ts
├── docker-compose.yml
├── Dockerfile
├── logs
|  └── 2023-3-12.log
├── Makefile
├── package-lock.json
├── package.json
├── README.md
├── restClient.http
├── tsconfig.json
```

[Link to summary](#summary)

## Server configuration

You can find the details of the entrypoint here :

```js
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
  // Allow all connections for dev
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
```

[Link to summary](#summary)

## Routes

First route created to start the server:

./src/app/routes/main.ts

```js
//~ Import Router
import { Router } from 'express';
const router = Router();

import { renderHomePage } from '../controllers/main.js';

//~ Home
router.get('/', renderHomePage);

//~ Export router
export { router };
```

I have divided the routes according to "themes" :

- index of routes [here](./src/app/routes/index.ts)
- main (relative to home page) [here](./src/app/routes/main.ts)
- user (relative to the user) [here](./src/app/routes/user.ts)

[Link to summary](#summary)

## Controllers

For the main route :

./src/app/routes/main.ts

```js
import { renderHomePage } from '../controllers/main.js';

//~ Home
router.get('/', renderHomePage);
```

I send :

./src/app/index.ts

```js
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
```

[Link to summary](#summary)

## Server launched

The result of this :

![server launched gif](./__docs/media/server-launched.gif)

And tadaaa !

![server launched img](./__docs/media/server-launched.png)

[Link to summary](#summary)

## Connect database PostgreSQL

I have used my database in a Docker container that is running on my Raspberry Pi.

![postgres Raspberry Pi](./__docs/media/postgres-rasp.gif)

And connect it to pgAdmin4 :

![pgadmin](./__docs/media/pgsql-pgadmin.png)

In my Express server :

./src/app/database/connexion.ts

```js
import pg from 'pg';
const client = new pg.Pool();

client
  .connect()
  .then(() => logger('\x1b[1;32m DB connected\x1b[0m'))
  .catch((err: Error) => logger('\x1b[1;31m DB connection failed\x1b[0m', err));
```

You need to create your database :

```sql
DROP DATABASE IF EXISTS stayintouch;

CREATE DATABASE stayintouch;
```

The .env file must contain the correct parameters:

```
# PGHOST=''
# PGDATABASE='stayintouch'
# PGUSER=''
# PGPASSWORD=''
# PGPORT=5432
```

Otherwise the connection will fail :

![fail connection](./__docs/media/db-fail.png)

[Link to summary](#summary)

## Handle errors

For error handling, I extend the Error object to customise my message when throwing a new error :

./src/app/services/errorHandler.ts

```js
class ErrorApi extends Error {
  constructor(req: Request, res: Response, statusCode = 500, message: string) {
    super(message);
    res.status(statusCode).json({ message: message });

    //~ Log errors
    errorLoggerHandling(message, req, res);
  }
}
```

Use it :

```js
if (!userExist) throw new ErrorApi(req, res, 401, `Informations not valid !`);
```

You can see my "errorLoggerHandling", here I wanted to log error messages (I made it for the development environment):

```js
//~import modules
import { formattedDate } from '../utils/formattedDate.js';
import { Request, Response } from 'express';
import * as fs from 'fs';

//~ resolve __dirname
import { resolve } from 'path';
const __dirname = resolve(`.`);
// resolve will define your root file

//~ Logger
import debug from 'debug';
const logger = debug('ErrorHandling');
/**
 * Manage error
 */
function errorLoggerHandling(message: string, req: Request, res: Response) {
  const actualDate = new Date();

  // format error message : Date + url + message
  const logMessage = `${actualDate.toLocaleString()} - ${req.url} - ${message}\r`;

  // date format YYYY-MONTH-DD
  const fileName = `${formattedDate}.log`;

  // create a log and write it in your file
  fs.appendFile(`${__dirname}/logs/${fileName}`, logMessage, (error) => {
    if (error) logger(error);
  });
}

export { errorLoggerHandling };
```

Result :

![logger](./__docs/media/logger.png)

[Link to summary](#summary)

## Favorite part SQL

My favourite part : working with SQL and PostgreSQL !
I have so many things to explore, but I want to share this work with you.

### Discovering PostGis

PostGIS is a spatial database extender for PostgreSQL object-relational database. It adds support for geographic objects allowing location queries to be run in SQL. (that's the intro of official website)

In this case, I wanted to use PostGis to find the closest users who are within a radius of one kilometre from me.

I need to read some documentation, and test it.

- First, connect to the database

- Create tables and insert some data

- Create extension

```sql
CREATE EXTENSION postgis;
```

- And check that it is properly installed:

```sh
stayintouch=# \dx
                                List of installed extensions
  Name   | Version |   Schema   |                        Description
---------+---------+------------+------------------------------------------------------------
 plpgsql | 1.0     | pg_catalog | PL/pgSQL procedural language
 postgis | 3.3.2   | public     | PostGIS geometry and geography spatial types and functions
```

The Open Geospatial Consortium provide a model for geospatial data.

My use of PostGis :

- 2D spatial geography using ST_DWithin that returns true if the geometries are within a given distance
- Point, this is a 0-dimensional geometry that represents a single location in coordinate space

- Result I want :

```json
[
  {
    "firstName": "",
    "lastName": "",
    "location": {
      "lng": ,
      "lat":
    }
  },
  {
    "firstName": "",
    "lastName": "",
    "location": {
      "lng": ,
      "lat":
    }
  }
]
```

- If you want to use the database, I've created a migration file with all the necessary queries. To use the file :

     - on Windows

```sh
psql -U postgres -p PORT -h HOST -f ~/PATH/TO/Stayintouch/data/01_migration.sql
```

![win migration](./__docs/media/win-migration.gif)

[Link to summary](#summary)

## Authentication JWT

[Link to summary](#summary)

## API works

[Link to summary](#summary)

## Cloud RaspberryPi

[Link to summary](#summary)

## Docker and docker compose

[Link to summary](#summary)

## Migration database in Docker

[Link to summary](#summary)

## Portainer and Nginx Proxy Manager

[Link to summary](#summary)

## Domain name

[Link to summary](#summary)

## Firewall rules

[Link to summary](#summary)

## API online

[Link to the API online !](http://test-stayintouch.duckdns.org/)

[Link to summary](#summary)

## Makefile usage

[Link to summary](#summary)

## Conclusion

## [Link to summary](#summary)

## Sources

- Downloads
  - [NodeJS](https://nodejs.org/en/download/?utm_source=blog)
  - [Get Docker](https://docs.docker.com/get-docker/)
  - [Docker compose v2](https://docs.docker.com/compose/compose-v2/)
  - [PostGis image](https://registry.hub.docker.com/r/postgis/postgis/)
  - [PostGis image for RaspberryPi](https://hub.docker.com/r/tobi312/rpi-postgresql-postgis/)
  - [PostGis documentation](https://postgis.net/)
  - []()

[Link to summary](#summary)
