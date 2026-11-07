-- Entries are stored the way the original Netlify importer stored them, 8 or
-- 10 hours before the real time (see processCSV in src/lib/daylio.ts). Some
-- imports stored the real time instead, so those entries are in the table
-- twice. Drop the real-time copy, keeping the timestamp every link uses.
DELETE FROM `daylio_entry_activities` WHERE `time` IN (
  SELECT `entry`.`time` FROM `daylio_entries` AS `entry`
  WHERE EXISTS (
    SELECT 1 FROM `daylio_entries` AS `kept`
    WHERE `entry`.`time` - `kept`.`time` IN (28800, 36000)
      AND `kept`.`mood` = `entry`.`mood`
      AND `kept`.`notes` IS `entry`.`notes`
  )
);--> statement-breakpoint
DELETE FROM `daylio_entries` WHERE EXISTS (
  SELECT 1 FROM `daylio_entries` AS `kept`
  WHERE `daylio_entries`.`time` - `kept`.`time` IN (28800, 36000)
    AND `kept`.`mood` = `daylio_entries`.`mood`
    AND `kept`.`notes` IS `daylio_entries`.`notes`
);
