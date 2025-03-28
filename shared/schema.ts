import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Profile schema
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  university: text("university").notNull(),
  bio: text("bio").notNull(),
  photoUrl: text("photo_url"),
  linkedin: text("linkedin"),
  github: text("github"),
  twitter: text("twitter"),
  email: text("email"),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
});

// Projects schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  technologies: text("technologies").array().notNull(),
  projectUrl: text("project_url"),
  githubUrl: text("github_url"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

// Education schema
export const educations = pgTable("educations", {
  id: serial("id").primaryKey(),
  degree: text("degree").notNull(),
  institution: text("institution").notNull(),
  dateRange: text("date_range").notNull(),
  gpa: text("gpa"),
  description: text("description"),
});

export const insertEducationSchema = createInsertSchema(educations).omit({
  id: true,
});

// Skills schema
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  items: text("items").array().notNull(),
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
});

// Experience schema
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  position: text("position").notNull(),
  company: text("company").notNull(),
  dateRange: text("date_range").notNull(),
  responsibilities: text("responsibilities").notNull(),
});

export const insertExperienceSchema = createInsertSchema(experiences).omit({
  id: true,
});

// Achievement schema
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

// Contact schema
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  linkedin: text("linkedin"),
  github: text("github"),
  twitter: text("twitter"),
  instagram: text("instagram"),
  formEmail: text("form_email"),
  successMessage: text("success_message"),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
});

// Types
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Education = typeof educations.$inferSelect;
export type InsertEducation = z.infer<typeof insertEducationSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

// Message schema for contact form submissions
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
