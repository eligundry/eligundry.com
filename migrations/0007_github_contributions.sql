CREATE TABLE `github_contributions` (
	`date` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`level` integer DEFAULT 0 NOT NULL,
	`createdAt` integer DEFAULT (cast(strftime('%s', 'now') as int)),
	`updatedAt` integer DEFAULT (cast(strftime('%s', 'now') as int))
);
