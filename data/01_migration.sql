--************************************************
-- Start
--************************************************

\set ECHO ALL
-- Have the result in CLI

DROP DATABASE IF EXISTS stayintouch;

CREATE DATABASE stayintouch TEMPLATE template0;

\c stayintouch

--************************************************
-- Create extension geospatial extension
--************************************************

CREATE EXTENSION postgis;

\dx

--************************************************
-- Create tables
--************************************************

DROP TABLE "user", "user_tracking","role";

BEGIN;

CREATE TABLE IF NOT EXISTS "user"(
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "first_name" TEXT,
    "last_name" TEXT,
    "role_id" INTEGER NOT NULL DEFAULT 2
);

CREATE TABLE IF NOT EXISTS "role"
(
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- Add unique to user_id => a user can be at only one place
CREATE TABLE IF NOT EXISTS "user_tracking"(
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" INT NOT NULL UNIQUE,
    "lng" DOUBLE PRECISION NOT NULL,
	"lat" DOUBLE PRECISION NOT NULL
);

ALTER TABLE IF EXISTS "user"
    ADD FOREIGN KEY ("role_id")
    REFERENCES "role" ("id") 
    MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS "user_tracking"
    ADD FOREIGN KEY ("user_id")
    REFERENCES "user" ("id") 
    MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

COMMIT;

-- Check existence of tables and their constraints
\dt
\d user
\d user_tracking
\d role
