import { defineFunction } from "@aws-amplify/backend";

export const validateToken = defineFunction({
  name: "validateToken",
  entry: "./handler.ts",
});
