DROP TABLE "black_list";--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "email" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "password" varchar(256) NOT NULL;