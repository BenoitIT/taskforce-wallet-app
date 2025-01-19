/*
  Warnings:

  - A unique constraint covering the columns `[accountnumber]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountnumber` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "accountnumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_accountnumber_key" ON "Account"("accountnumber");
