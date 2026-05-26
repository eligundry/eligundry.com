ALTER TABLE `daylio_entries` RENAME COLUMN `notes` TO `old_notes`;--> statement-breakpoint
ALTER TABLE `daylio_entries` ADD `notes` text;--> statement-breakpoint
UPDATE `daylio_entries` SET `notes` = (
  SELECT group_concat('- ' || j.value, char(10))
  FROM json_each(`old_notes`) AS j
);--> statement-breakpoint
ALTER TABLE `daylio_entries` DROP COLUMN `old_notes`;
