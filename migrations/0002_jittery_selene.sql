ALTER TABLE "documents" ADD COLUMN "parentDocument" uuid;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "by_user_parent" ON "documents" ("userID","parentDocument");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_parentDocument_documents_id_fk" FOREIGN KEY ("parentDocument") REFERENCES "documents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
