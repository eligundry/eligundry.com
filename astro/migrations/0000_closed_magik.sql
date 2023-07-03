CREATE TABLE `daylio_activities` (
	`activity` text PRIMARY KEY NOT NULL,
	`private` integer DEFAULT 0,
	`createdAt` integer DEFAULT (cast(strftime('%s', 'now') as int)),
	`updatedAt` integer DEFAULT (cast(strftime('%s', 'now') as int))
);
--> statement-breakpoint
CREATE TABLE `daylio_entries` (
	`time` integer PRIMARY KEY NOT NULL,
	`createdAt` integer DEFAULT (cast(strftime('%s', 'now') as int)),
	`updatedAt` integer DEFAULT (cast(strftime('%s', 'now') as int)),
	`mood` text,
	`notes` blob
);
--> statement-breakpoint
CREATE TABLE `daylio_entry_activities` (
	`time` integer,
	`activity` text,
	`createdAt` integer DEFAULT (cast(strftime('%s', 'now') as int)),
	`updatedAt` integer DEFAULT (cast(strftime('%s', 'now') as int)),
	PRIMARY KEY(`activity`, `time`),
	FOREIGN KEY (`time`) REFERENCES `daylio_entries`(`time`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`activity`) REFERENCES `daylio_activities`(`activity`) ON UPDATE cascade ON DELETE cascade
);
