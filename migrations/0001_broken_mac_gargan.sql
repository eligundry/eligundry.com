PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_daylio_entries` (
	`time` integer PRIMARY KEY NOT NULL,
	`createdAt` integer DEFAULT (cast(strftime('%s', 'now') as int)),
	`updatedAt` integer DEFAULT (cast(strftime('%s', 'now') as int)),
	`publishedAt` integer,
	`mood` text NOT NULL,
	`notes` text
);
--> statement-breakpoint
INSERT INTO `__new_daylio_entries`("time", "createdAt", "updatedAt", "publishedAt", "mood", "notes") SELECT "time", "createdAt", "updatedAt", "publishedAt", "mood", "notes" FROM `daylio_entries`;--> statement-breakpoint
DROP TABLE `daylio_entries`;--> statement-breakpoint
ALTER TABLE `__new_daylio_entries` RENAME TO `daylio_entries`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_daylio_entry_activities` (
	`time` integer NOT NULL,
	`activity` text NOT NULL,
	`createdAt` integer DEFAULT (cast(strftime('%s', 'now') as int)),
	`updatedAt` integer DEFAULT (cast(strftime('%s', 'now') as int)),
	PRIMARY KEY(`time`, `activity`),
	FOREIGN KEY (`time`) REFERENCES `daylio_entries`(`time`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`activity`) REFERENCES `daylio_activities`(`activity`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_daylio_entry_activities`("time", "activity", "createdAt", "updatedAt") SELECT "time", "activity", "createdAt", "updatedAt" FROM `daylio_entry_activities`;--> statement-breakpoint
DROP TABLE `daylio_entry_activities`;--> statement-breakpoint
ALTER TABLE `__new_daylio_entry_activities` RENAME TO `daylio_entry_activities`;