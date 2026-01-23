-- AlterTable
ALTER TABLE "HackathonSettings" ADD COLUMN "hackathonNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "HackathonSettings_hackathonNumber_key" ON "HackathonSettings"("hackathonNumber");

