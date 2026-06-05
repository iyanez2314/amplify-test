import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { myFunction } from "./test-function/resource";
import { generateUploadLink } from "./generate-upload-link/resource";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
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

const linkResource = api.root.addResource("links");
linkResource.addMethod("POST", generateLinkIntegration);

const validateResource = api.root.addResource("validate");
validateResource.addMethod("GET", validateTokenIntegration);

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
