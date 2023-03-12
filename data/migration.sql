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

--************************************************
-- Add fake data
--************************************************

INSERT INTO "role"("name") VALUES ('admin'),('user');

INSERT INTO "user"("first_name","last_name") 
    SELECT ('username ' || nb), ('userlastname ' || nb) 
    FROM generate_series(1,10) as nb;

-- Set admin for user 1
UPDATE "user"
SET "role_id" = 1
WHERE "id" = 1;

-- Checks
SELECT * FROM "user" WHERE "id" < 5 ORDER BY "id";


INSERT INTO user_tracking("user_id","lng","lat") 
VALUES 
('1','7.352464','48.075381'),
('2','7.331448','48.086377'),
('3','7.362862','48.080356'),
('4','7.396680','48.080414'),
('5','7.365008','48.070836'),
('6','7.337542','48.074622'),
('7','7.343207','48.087237'),
('8','7.364579','48.089358'),
('9','7.355567','48.080586'),
('10','7.387839','48.084657');


-- Checks
TABLE user_tracking;

--************************************************
-- Create functions
--************************************************

DROP TYPE nearby_users, all_users, identity CASCADE;

CREATE TYPE identity AS (
	"id" INT,
	"first_name" TEXT,
	"last_name" TEXT,
	"role" TEXT
);

CREATE
OR REPLACE FUNCTION user_identity(user_first_name TEXT) 
RETURNS SETOF identity AS $$ 

BEGIN 
RETURN QUERY (
    SELECT
        U."id",
        U."first_name",
        U."last_name",
        R."name" AS role
    FROM
        "role" AS R
        JOIN "user" AS U ON R."id" = U."role_id"
    WHERE
        U."first_name" = user_first_name :: TEXT
);

END

$$ LANGUAGE plpgsql VOLATILE;

-- Check
SELECT * FROM user_identity('username 1');

CREATE TYPE nearby_users AS (
"firstName" TEXT,
"lastName" TEXT,
"location" JSON	
);

CREATE OR REPLACE FUNCTION find_users_by_radius(userId INT, radius NUMERIC)
RETURNS SETOF nearby_users AS $$

DECLARE
_lng DOUBLE PRECISION := (SELECT lng FROM "user_tracking" AS UT
						  WHERE UT."user_id" = userId);
_lat DOUBLE PRECISION := (SELECT lat FROM "user_tracking" AS UT
						  WHERE UT."user_id" = userId);

BEGIN
RETURN QUERY (
	SELECT 
first_name, 
last_name,
json_build_object('lng',lng,'lat',lat) as location
FROM "user_tracking"
JOIN "user"
ON "user_tracking".user_id = "user".id
WHERE
  ST_DWithin(('POINT('|| _lng || ' ' || _lat ||')')::geography,
              ST_MakePoint(lng,lat),radius
			 * 1000)
AND "user_id" != userId
GROUP BY first_name, last_name, lng, lat 
);
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Check
SELECT * FROM find_users_by_radius(1,1);

CREATE TYPE all_users AS (
	"id" INT,
	"last_name" TEXT,
	"first_name" TEXT
);

CREATE
OR REPLACE FUNCTION find_all_users(limit_nb INT = NULL, offset_nb INT = 0) 
RETURNS SETOF all_users AS $$

BEGIN

RETURN QUERY (
    SELECT U."id", U."last_name", U."first_name" 
    FROM "user" AS U
    ORDER BY U."last_name" ASC
    LIMIT limit_nb::INT
    OFFSET offset_nb::INT);
    
END

$$ LANGUAGE plpgsql IMMUTABLE;

-- Check
SELECT * FROM find_all_users();
