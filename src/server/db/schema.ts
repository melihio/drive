import { int, text, singlestoreTable } from "drizzle-orm/singlestore-core";

export const users = singlestoreTable("users_table", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name"),
  age: int("age"),
});
