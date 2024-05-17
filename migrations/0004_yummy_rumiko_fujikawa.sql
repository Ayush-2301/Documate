ALTER TABLE "documents" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "createdAt" SET NOT NULL;