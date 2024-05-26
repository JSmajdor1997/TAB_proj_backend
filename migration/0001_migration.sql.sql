ALTER TABLE "borrowings" ALTER COLUMN "borrowing_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "borrowings" ADD COLUMN "return_date" date;