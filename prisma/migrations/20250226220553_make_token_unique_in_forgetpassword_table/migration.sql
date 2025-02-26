/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `ForgetPassword` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ForgetPassword_token_key" ON "ForgetPassword"("token");
