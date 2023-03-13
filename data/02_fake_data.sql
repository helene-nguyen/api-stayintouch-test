--************************************************

-- Add fake data

--************************************************

INSERT INTO "role"("name") VALUES ('admin'),('user');

INSERT INTO
    "user"("first_name", "last_name")
SELECT
    ('username ' || nb),
    ('userlastname ' || nb)
FROM
    generate_series(1, 10) as nb;

-- Set admin for user 1

UPDATE "user" SET "role_id" = 1 WHERE "id" = 1;

-- Checks

SELECT * FROM "user" WHERE "id" < 5 ORDER BY "id";

INSERT INTO
    user_tracking("user_id", "lng", "lat")
VALUES
    ('1', '7.352464', '48.075381'),
    ('2', '7.331448', '48.086377'),
    ('3', '7.362862', '48.080356'),
    ('4', '7.396680', '48.080414'),
    ('5', '7.365008', '48.070836'),
    ('6', '7.337542', '48.074622'),
    ('7', '7.343207', '48.087237'),
    ('8', '7.364579', '48.089358'),
    ('9', '7.355567', '48.080586'),
    ('10', '7.387839', '48.084657');

-- Checks

TABLE user_tracking;