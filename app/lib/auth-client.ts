import { createAuthClient } from 'better-auth/react';
import {
  usernameClient,
  inferAdditionalFields,
} from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  basePath: '/api/auth',
  fetchOptions: {
    credentials: 'include',
  },
  plugin: [
    usernameClient(),
    inferAdditionalFields({
      user: {
        departmentName: {
          type: 'string',
          required: true,
        },
      },
    }),
  ],
});
