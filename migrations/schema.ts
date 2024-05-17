import { pgTable, index, foreignKey, pgEnum, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const keyStatus = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const keyType = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const factorType = pgEnum("factor_type", ['totp', 'webauthn'])
export const factorStatus = pgEnum("factor_status", ['unverified', 'verified'])
export const aalLevel = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['s256', 'plain'])


export const documents = pgTable("documents", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("userID").notNull(),
	title: text("title").notNull(),
	isArchived: boolean("isArchived").notNull(),
	content: text("content"),
	coverImage: text("coverImage"),
	icon: text("icon"),
	isPublished: boolean("isPublished").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }),
	parentDocument: uuid("parentDocument"),
},
(table) => {
	return {
		byUser: index("by_user").on(table.userId),
		byUserParent: index("by_user_parent").on(table.userId, table.parentDocument),
		documentsParentDocumentDocumentsIdFk: foreignKey({
			columns: [table.parentDocument],
			foreignColumns: [table.id],
			name: "documents_parentDocument_documents_id_fk"
		}),
	}
});