-- AlterTable: Add hackathonSettingsId column to Score table
-- This migration handles existing data by assigning scores to the active hackathon

-- Step 1: Add the column as nullable first
ALTER TABLE "Score" ADD COLUMN "hackathonSettingsId" TEXT;

-- Step 2: Get the active hackathon ID and assign it to existing scores
-- If no active hackathon exists, assign to the most recent one
DO $$
DECLARE
  active_hackathon_id TEXT;
BEGIN
  -- Try to get active hackathon
  SELECT id INTO active_hackathon_id 
  FROM "HackathonSettings" 
  WHERE "isActive" = true 
  ORDER BY "createdAt" DESC 
  LIMIT 1;
  
  -- If no active hackathon, get the most recent one
  IF active_hackathon_id IS NULL THEN
    SELECT id INTO active_hackathon_id 
    FROM "HackathonSettings" 
    ORDER BY "createdAt" DESC 
    LIMIT 1;
  END IF;
  
  -- Update existing scores with the hackathon ID
  IF active_hackathon_id IS NOT NULL THEN
    UPDATE "Score" SET "hackathonSettingsId" = active_hackathon_id WHERE "hackathonSettingsId" IS NULL;
  END IF;
END $$;

-- Step 3: Make the column required (NOT NULL)
ALTER TABLE "Score" ALTER COLUMN "hackathonSettingsId" SET NOT NULL;

-- Step 4: Drop the old unique constraint on userId (if it exists)
ALTER TABLE "Score" DROP CONSTRAINT IF EXISTS "Score_userId_key";

-- Step 5: Create new composite unique constraint
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_hackathonSettingsId_key" UNIQUE ("userId", "hackathonSettingsId");

-- Step 6: Create index on hackathonSettingsId for better query performance
CREATE INDEX "Score_hackathonSettingsId_idx" ON "Score"("hackathonSettingsId");

-- Step 7: Add foreign key constraint
ALTER TABLE "Score" ADD CONSTRAINT "Score_hackathonSettingsId_fkey" FOREIGN KEY ("hackathonSettingsId") REFERENCES "HackathonSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

