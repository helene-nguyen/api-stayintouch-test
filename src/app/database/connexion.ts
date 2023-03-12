//~ Import Debug
import debug from 'debug';
const logger = debug('Pool');

//~ Import pg
import pg from 'pg';
const client = new pg.Pool();

client
  .connect()
  .then(() => logger('\x1b[1;32m DB connected\x1b[0m'))
  .catch((err : Error) => logger('\x1b[1;31m DB connection failed\x1b[0m', err));

export default client;
