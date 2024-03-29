ALTER TABLE "documents" DROP CONSTRAINT "documents_parentDocument_documents_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "by_user_parent";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "parentDocument";