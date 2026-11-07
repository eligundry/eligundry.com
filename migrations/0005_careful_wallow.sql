ALTER TABLE `daylio_entries` ADD `legacyTime` integer;--> statement-breakpoint
-- Imports that ran in UTC (the 2025-02-12 bulk import and the Netlify uploads)
-- stored each entry early by twice New York's UTC offset, 8 or 10 hours, and
-- later imports added the entry again at the right time. Keep the wrong time on
-- the right entry, so links to its old anchor still work, then drop the copy.
UPDATE `daylio_entries` SET `legacyTime` = (
  SELECT `copy`.`time` FROM `daylio_entries` AS `copy`
  WHERE `daylio_entries`.`time` - `copy`.`time` IN (28800, 36000)
    AND `copy`.`mood` = `daylio_entries`.`mood`
    AND `copy`.`notes` IS `daylio_entries`.`notes`
)
WHERE EXISTS (
  SELECT 1 FROM `daylio_entries` AS `copy`
  WHERE `daylio_entries`.`time` - `copy`.`time` IN (28800, 36000)
    AND `copy`.`mood` = `daylio_entries`.`mood`
    AND `copy`.`notes` IS `daylio_entries`.`notes`
);--> statement-breakpoint
DELETE FROM `daylio_entry_activities` WHERE `time` IN (
  SELECT `legacyTime` FROM `daylio_entries` WHERE `legacyTime` IS NOT NULL
);--> statement-breakpoint
DELETE FROM `daylio_entries` WHERE `time` IN (
  SELECT `legacyTime` FROM `daylio_entries` WHERE `legacyTime` IS NOT NULL
);
