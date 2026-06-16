import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { myFunction } from "./test-function/resource";
import { generateUploadLink } from "./generate-upload-link/resource";
import { Cors, CognitoUserPoolsAuthorizer, AuthorizationType, LambdaIntegration, RestApi, GatewayResponse, ResponseType } from "aws-cdk-lib/aws-apigateway";
import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { validateToken } from "./validate-token/resource";

const backend = defineBackend({
  auth,
  data,
  myFunction,
  generateUploadLink,
  validateToken,
});

const apiStack = backend.createStack("api-stack");

const api = new RestApi(apiStack, "DynamoMediaApi", {
  restApiName: "dynamo-media-api",
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS,
  },
});

const generateLinkIntegration = new LambdaIntegration(
  backend.generateUploadLink.resources.lambda,
);

const validateTokenIntegration = new LambdaIntegration(
  backend.validateToken.resources.lambda,
);

const authorizer = new CognitoUserPoolsAuthorizer(apiStack, "AdminAuthorizer", {
  cognitoUserPools: [backend.auth.resources.userPool],
});

const linkResource = api.root.addResource("links");
linkResource.addMethod("POST", generateLinkIntegration, {
  authorizer,
  authorizationType: AuthorizationType.COGNITO,
});

const validateResource = api.root.addResource("validate");
validateResource.addMethod("GET", validateTokenIntegration);

new GatewayResponse(apiStack, "CORSGatewayResponse4XX", {
  restApi: api,
  type: ResponseType.DEFAULT_4XX,
  responseHeaders: {
    "Access-Control-Allow-Origin": "'*'",
    "Access-Control-Allow-Headers": "'*'",
  },
});

new GatewayResponse(apiStack, "CORSGatewayResponse5XX", {
  restApi: api,
  type: ResponseType.DEFAULT_5XX,
  responseHeaders: {
    "Access-Control-Allow-Origin": "'*'",
    "Access-Control-Allow-Headers": "'*'",
  },
});

(backend.generateUploadLink.resources.lambda as LambdaFunction).addEnvironment(
  "UPLOAD_LINK_TABLE",
  backend.data.resources.tables["UploadLink"].tableName,
);

(backend.validateToken.resources.lambda as LambdaFunction).addEnvironment(
  "UPLOAD_LINK_TABLE",
  backend.data.resources.tables["UploadLink"].tableName,
);

backend.data.resources.tables["UploadLink"].grantWriteData(
  backend.generateUploadLink.resources.lambda,
);

backend.data.resources.tables["UploadLink"].grantReadData(
  backend.validateToken.resources.lambda,
);

(backend.validateToken.resources.lambda as LambdaFunction).addToRolePolicy(
  new PolicyStatement({
    actions: ["dynamodb:Query"],
    resources: [
      `${backend.data.resources.tables["UploadLink"].tableArn}/index/*`,
    ],
  }),
);
