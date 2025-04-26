import {
  pgTable,
  varchar,
  text,
  date,
  real,
  timestamp,
} from "drizzle-orm/pg-core";

export const surgeries = pgTable("surgeries", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 100 }),
  surgeryDate: date("surgery_date"),
  weight: real("weight"),
  surgeryType: varchar("surgery_type", {
    length: 20,
    enum: ["sleve", "bypass"],
  }),
  additionalInfo: text("additional_info"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});
