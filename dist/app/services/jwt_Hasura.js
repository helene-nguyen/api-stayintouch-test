import * as jwt from "jsonwebtoken";
const HASURA_GRAPHQL_JWT_SECRET = {
    type: process.env.HASURA_JWT_SECRET_TYPE || "HS256",
    key: process.env.HASURA_JWT_SECRET_KEY ||
        "secretkey",
};
const JWT_CONFIG = {
    algorithm: HASURA_GRAPHQL_JWT_SECRET.type,
    expiresIn: "10h",
};
export function generateJWT(params) {
    const payload = {
        "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": params.allowedRoles,
            "x-hasura-default-role": params.defaultRole,
            ...params.otherClaims,
        },
    };
    return jwt.sign(payload, HASURA_GRAPHQL_JWT_SECRET.key, JWT_CONFIG);
}
//# sourceMappingURL=jwt_Hasura.js.map