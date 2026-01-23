-- Script to insert a new hackathon as #1 and shift existing hackathons
-- Run this in your Neon database console

-- Step 1: Get your user ID (replace with actual ID after running the query below)
-- SELECT id, email FROM "User" WHERE role = 'SUPERADMIN' OR role = 'ADMIN';

-- Step 2: Update existing hackathon numbers (shift them up by 1)
UPDATE "HackathonSettings" 
SET "hackathonNumber" = "hackathonNumber" + 1;

-- Step 3: Insert the new hackathon as #1
-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with your actual user ID from Step 1
INSERT INTO "HackathonSettings" (
  id,
  "hackathonNumber",
  "questionLink",
  "startTime",
  "endTime",
  "isActive",
  "createdAt",
  "updatedAt",
  "createdById"
) VALUES (
  gen_random_uuid()::text,  -- Generate a random UUID for id
  1,  -- This will be Hackathon #1
  'https://docs.google.com/document/d/1ZMtkEN83twOTciMgBDSvpyrnkHG9-YahTywMPI-Hezo/edit?usp=sharing',
  '2026-01-10 10:00:00'::timestamp,
  '2026-01-10 13:00:00'::timestamp,
  false,  -- Not active
  NOW(),
  NOW(),
  'cmkh4yyeu0000i5l6l3xsi3vx'  -- Replace this with your user ID
);

-- Step 4: Reset the sequence to continue from the next number
SELECT setval(
  pg_get_serial_sequence('"HackathonSettings"', 'hackathonNumber'),
  (SELECT MAX("hackathonNumber") FROM "HackathonSettings") + 1,
  false
);

-- Step 5: Verify the results
SELECT "hackathonNumber", "questionLink", "startTime", "endTime", "isActive", "createdById"
FROM "HackathonSettings"
ORDER BY "hackathonNumber" ASC;

