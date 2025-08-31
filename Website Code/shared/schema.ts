import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const energyData = pgTable("energy_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  solarGeneration: real("solar_generation").notNull().default(0),
  windGeneration: real("wind_generation").notNull().default(0),
  batteryLevel: real("battery_level").notNull().default(0),
  batteryHealth: real("battery_health").notNull().default(100),
  batteryTemperature: real("battery_temperature").notNull().default(25),
  batteryCycles: integer("battery_cycles").notNull().default(0),
  gridStatus: boolean("grid_status").notNull().default(true),
  gridLoad: real("grid_load").notNull().default(0),
  gridFrequency: real("grid_frequency").notNull().default(50),
  householdConsumption: real("household_consumption").notNull().default(0),
  totalGeneration: real("total_generation").notNull().default(0),
  totalConsumption: real("total_consumption").notNull().default(0),
  efficiency: real("efficiency").notNull().default(0),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // info, warning, error, success
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  isRead: boolean("is_read").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEnergyDataSchema = createInsertSchema(energyData).omit({
  id: true,
  timestamp: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  timestamp: true,
  isRead: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type EnergyData = typeof energyData.$inferSelect;
export type InsertEnergyData = z.infer<typeof insertEnergyDataSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
