/*
  Warnings:

  - A unique constraint covering the columns `[providerId,accountId]` on the table `account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "account"("providerId", "accountId");
INSERT INTO "account" (
  id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt"
)
SELECT
  'cred_' || u.id, u.email, 'credential', u.id, u.password, NOW(), NOW()
FROM "users" u
LEFT JOIN "account" a
  ON a."userId"  = u.id AND a."providerId" = 'credential'
WHERE u.password IS NOT NULL
  AND a.id IS NULL;
