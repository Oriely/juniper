CREATE TABLE IF NOT EXISTS `users` (
	`id` INTEGER PRIMARY KEY,
	`username` VARCHAR(32),
	`password` TEXT(255)
);

CREATE TABLE IF NOT EXISTS `sites` (
	`id` INTEGER PRIMARY KEY,
	`url` VARCHAR(255),
	`name` VARCHAR(255),
	`description` TEXT(500),
	`logo` VARCHAR
);

CREATE TABLE IF NOT EXISTS `config` (
	`baseURL` VARCHAR(255)
);