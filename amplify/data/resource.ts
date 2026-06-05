import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.guest()]),
  UploadLink: a
    .model({
      contractorName: a.string().required(),
      dropboxFolder: a.string().required(),
      token: a.string().required(),
      expiresAt: a.string().required(),
      maxUploads: a.integer().required(),
      uploadCount: a.integer().required(),
      status: a.enum(["active", "expired", "revoked"]),
    })
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
