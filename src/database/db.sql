CREATE TABLE `users` (
	`id` INTEGER PRIMARY KEY,
	`username` VARCHAR(32),
	`password` TEXT(255)
);

CREATE TABLE `sites` (
	`id` INTEGER PRIMARY KEY,
	`url` VARCHAR(255),
	`name` VARCHAR(255),
	`description` TEXT(500),
	`logo_url` INT(20)
);

CREATE TABLE `config` (
	`url` VARCHAR(255),
	`name` VARCHAR(255),
	`description` TEXT(500),
	`logo_url` INT(20)
);