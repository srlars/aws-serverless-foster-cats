// apiId can be found after running the service deployments using sls
const apiId = "e3alh9qjp1";
const region = "us-east-1";
const stage = "dev";
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/${stage}`;

// Auth0 Configuration
export const authConfig = {
  domain: "dev--or3ih3p.auth0.com", // Auth0 domain
  clientId: "eTxu2M6RDAIhRy2xt6wsMVlWuUfV5N5n", // Auth0 client id
  callbackUrl: "/callback",
};
