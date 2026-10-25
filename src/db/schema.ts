import { pgTable, text, integer, boolean, timestamp, serial, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  plan: text("plan").notNull().default("Free"),
  credits: integer("credits").notNull().default(120),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  prompt: text("prompt").notNull().default(""),
  type: text("type").notNull().default("text-to-video"), // text-to-video, image-to-video, video-to-video, avatar, script
  style: text("style").notNull().default("Cinematic"),
  duration: integer("duration").notNull().default(10),
  aspectRatio: text("aspect_ratio").notNull().default("16:9"),
  resolution: text("resolution").notNull().default("1080p"),
  status: text("status").notNull().default("generating"), // generating, completed, failed
  progress: integer("progress").notNull().default(5),
  thumbnail: text("thumbnail").notNull().default(""),
  videoUrl: text("video_url").notNull().default(""),
  voice: text("voice").notNull().default("Ayesha (Urdu Female)"),
  language: text("language").notNull().default("English"),
  avatar: text("avatar").notNull().default(""),
  creditsUsed: integer("credits_used").notNull().default(10),
  isFavorite: boolean("is_favorite").notNull().default(false),
  folder: text("folder").notNull().default("All Projects"),
  ownerEmail: text("owner_email").notNull().default("demo@mirai.app"),
  scenes: jsonb("scenes").$type<any[]>().default([]),
  subtitles: boolean("subtitles").notNull().default(true),
  seed: text("seed").notNull().default(""),
  tags: text("tags").notNull().default(""),
  deleted: boolean("deleted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projectVersions = pgTable("project_versions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull().default("completed"),
  videoUrl: text("video_url").notNull().default(""),
  snapshot: jsonb("snapshot").$type<any>(),
  note: text("note").notNull().default("Auto-save"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  author: text("author").notNull().default("Demo Creator"),
  body: text("body").notNull(),
  timecode: text("timecode").notNull().default(""),
  resolved: boolean("resolved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  event: text("event").notNull().default("render.completed"),
  email: text("email").notNull().default("demo@mirai.app"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  email: text("email").notNull().default("demo@mirai.app"),
  status: text("status").notNull().default("open"),
  reply: text("reply").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const creditTx = pgTable("credit_tx", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().default("demo@mirai.app"),
  label: text("label").notNull(),
  amount: integer("amount").notNull(),
  type: text("type").notNull().default("usage"), // usage, purchase, bonus
  createdAt: timestamp("created_at").defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  keyValue: text("key_value").notNull(),
  email: text("email").notNull().default("demo@mirai.app"),
  lastUsed: text("last_used").notNull().default("Never"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("Editor"),
  status: text("status").notNull().default("Active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const renders = pgTable("renders", {
  id: text("id").primaryKey(),
  mime: text("mime").notNull().default("video/webm"),
  data: text("data").notNull(),
  size: integer("size").notNull().default(0),
  email: text("email").notNull().default("demo@mirai.app"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const brandKits = pgTable("brand_kits", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().default("demo@mirai.app"),
  brandName: text("brand_name").notNull().default("My Brand"),
  primaryColor: text("primary_color").notNull().default("#7C3AED"),
  font: text("font").notNull().default("Inter"),
  watermark: text("watermark").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
});
