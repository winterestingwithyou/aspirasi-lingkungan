import { betterAuth } from 'better-auth';
import { getPrisma } from '~/db';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import type { Env } from 'workers/types';
import { username } from 'better-auth/plugins/username';
import { PrismaClient } from '~/generated/prisma/client';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  secret: import.meta.env.BETTER_AUTH_SECRET!,
  emailAndPassword: { enabled: true },
  advanced: { database: { useNumberId: true, generateId: false } },
  user: {
    additionalFields: {
      departmentName: {
        type: 'string',
        required: true,
      },
    },
  },
  plugins: [username()],
});

export async function makeAuth(env: Env) {
  const prisma = await getPrisma(env.DATABASE_URL);

  return betterAuth({
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    secret: env.BETTER_AUTH_SECRET,
    emailAndPassword: { enabled: true },
    advanced: {
      database: { useNumberId: true, generateId: false },
    },
    user: {
      additionalFields: {
        departmentName: {
          type: 'string',
          required: true,
        },
      },
    },
    plugins: [username()],
  });
}
