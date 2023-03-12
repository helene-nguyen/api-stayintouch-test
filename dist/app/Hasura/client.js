import { GraphQLClient } from "graphql-request";
export const client = new GraphQLClient("http://localhost:4300/api/v1/graphql", {
    headers: { "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET },
});
//# sourceMappingURL=client.js.map