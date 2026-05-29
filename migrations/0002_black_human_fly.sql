CREATE TABLE `standard_site_documents` (
	`path` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`documentUri` text NOT NULL,
	`documentRkey` text NOT NULL,
	`documentCid` text NOT NULL,
	`bskyPostUri` text,
	`bskyPostCid` text,
	`contentHash` text NOT NULL,
	`publishedAt` integer DEFAULT (cast(strftime('%s', 'now') as int)),
	`updatedAt` integer DEFAULT (cast(strftime('%s', 'now') as int))
);
