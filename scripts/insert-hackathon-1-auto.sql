-- Script to insert a new hackathon as #1 and shift existing hackathons
-- This version automatically gets your user ID
-- Run this in your Neon database console

DO $$
DECLARE
  user_id TEXT;
BEGIN
  -- Get the first SUPERADMIN or ADMIN user ID
  SELECT id INTO user_id 
  FROM "User" 
  WHERE role IN ('SUPERADMIN', 'ADMIN')
  ORDER BY "createdAt" ASC
  LIMIT 1;

  -- Check if we found a user
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'No ADMIN or SUPERADMIN user found';
  END IF;

  -- Step 1: Update existing hackathon numbers (shift them up by 1)
  UPDATE "HackathonSettings" 
  SET "hackathonNumber" = "hackathonNumber" + 1;

  -- Step 2: Insert the new hackathon as #1
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
    gen_random_uuid()::text,
    1,
    'https://docs.google.com/document/d/1ZMtkEN83twOTciMgBDSvpyrnkHG9-YahTywMPI-Hezo/edit?usp=sharing',
    '2026-01-10 10:00:00'::timestamp,
    '2026-01-10 13:00:00'::timestamp,
    false,
    NOW(),
    NOW(),
    user_id
  );

  -- Step 3: Reset the sequence
  PERFORM setval(
    pg_get_serial_sequence('"HackathonSettings"', 'hackathonNumber'),
    (SELECT MAX("hackathonNumber") FROM "HackathonSettings") + 1,
    false
  );

  RAISE NOTICE 'Successfully inserted hackathon #1 with creator ID: %', user_id;
END $$;

-- Verify the results
SELECT "hackathonNumber", "questionLink", "startTime", "endTime", "isActive", "createdById"
FROM "HackathonSettings"
ORDER BY "hackathonNumber" ASC;

