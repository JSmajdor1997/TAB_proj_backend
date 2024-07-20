ALTER TABLE "borrowings" ALTER COLUMN "return_date" SET DEFAULT NULL;--> statement-breakpoint
ALTER TABLE "borrowings" ALTER COLUMN "paid_fee" SET DEFAULT NULL;--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'active';