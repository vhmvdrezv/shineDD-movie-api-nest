-- CreateTable
CREATE TABLE "ForgetPassword" (
    "email" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "ForgetPassword_pkey" PRIMARY KEY ("email")
);

-- AddForeignKey
ALTER TABLE "ForgetPassword" ADD CONSTRAINT "ForgetPassword_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
