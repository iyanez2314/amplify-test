import { defineFunction } from "@aws-amplify/backend";

export const generateUploadLink = defineFunction({
  name: "generateUploadLink",
  entry: "./handler.ts",
});
