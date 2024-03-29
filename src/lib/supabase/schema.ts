import {
  boolean,
  pgTable,
  uuid,
  text,
  index,
  timestamp,
} from "drizzle-orm/pg-core";

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userID: uuid("userID").notNull(),
    title: text("title").notNull(),
    isArchived: boolean("isArchived"),
    parentDocument: uuid("parentDocument").references(() => documents.id),
    content: text("content"),
    coverImage: text("coverImage"),
    icon: text("icon"),
    isPublished: boolean("isPublished"),
    createdAt: timestamp("createdAt", {
      withTimezone: true,
      mode: "string",
    }),
  },
  (table) => {
    return {
      by_user: index("by_user").on(table.userID),
      by_user_parent: index("by_user_parent").on(
        table.userID,
        table.parentDocument
      ),
    };
  }
);
