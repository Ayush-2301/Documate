CREATE TABLE IF NOT EXISTS "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userID" uuid NOT NULL,
	"title" text NOT NULL,
	"isArchived" boolean,
	"parentDocument" uuid,
	"content" text,
	"coverImage" text,
	"icon" text,
	"isPublished" boolean,
	"createdAt" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "by_user" ON "documents" ("userID");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "by_user_parent" ON "documents" ("userID","parentDocument");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_parentDocument_documents_id_fk" FOREIGN KEY ("parentDocument") REFERENCES "documents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
