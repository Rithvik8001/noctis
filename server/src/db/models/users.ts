import type { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  userId: text("userId")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userName: text("userName").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type User = InferSelectModel<typeof usersTable>;
