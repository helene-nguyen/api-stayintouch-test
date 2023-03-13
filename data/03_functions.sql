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