CREATE TABLE `goodreads_reviews` (
	`bookId` text PRIMARY KEY NOT NULL,
	`reviewId` text,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`cover` text,
	`shelf` text NOT NULL,
	`rating` integer DEFAULT 0 NOT NULL,
	`review` text,
	`spoiler` integer DEFAULT false NOT NULL,
	`dateRead` text,
	`dateAdded` text,
	`ratedAt` text,
	`isbn13` text,
	`pages` integer,
	`yearPublished` integer,
	`createdAt` integer DEFAULT (cast(strftime('%s', 'now') as int)),
	`updatedAt` integer DEFAULT (cast(strftime('%s', 'now') as int))
);
