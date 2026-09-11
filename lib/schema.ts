import { pgTable, serial, varchar, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

/**
 * Contact form submissions.
 * Every message sent through the Contact section is persisted here
 * so the studio never loses an inbound enquiry.
 */
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  projectType: varchar("project_type", { length: 80 }),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("new"), // new | read | responded
  ipHash: varchar("ip_hash", { length: 64 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

/**
 * Dynamic gallery items shown in the Gallery section.
 * Ordered by `order` ascending; `featured` items can be highlighted.
 */
export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  location: varchar("location", { length: 120 }),
  year: integer("year"),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  description: text("description"),
  featured: boolean("featured").notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type NewGalleryItem = typeof galleryItems.$inferInsert;

/**
 * Employees/Staff for the About page.
 */
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 100 }),
  imageUrl: varchar("image_url", { length: 500 }),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;

/**
 * Public testimonials & reviews.
 * Users can submit reviews via the contact page (default status 'pending').
 * Admins can approve ('approved') or create them directly.
 */
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  quote: text("quote").notNull(),
  author: varchar("author", { length: 120 }).notNull(),
  role: varchar("role", { length: 120 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending | approved
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

/**
 * Dynamic Home Carousel Items
 */
export const carouselItems = pgTable("carousel_items", {
  id: serial("id").primaryKey(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export type CarouselItem = typeof carouselItems.$inferSelect;
export type NewCarouselItem = typeof carouselItems.$inferInsert;

/**
 * Dynamic Awareness Programs (Masonry Layout)
 */
export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  title: varchar("title", { length: 160 }),
  description: text("description"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export type Program = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;

/**
 * Users and Authentication
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("USER"), // "ADMIN" or "USER"
  resetToken: varchar("reset_token", { length: 255 }),
  resetTokenExpiry: timestamp("reset_token_expiry", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
