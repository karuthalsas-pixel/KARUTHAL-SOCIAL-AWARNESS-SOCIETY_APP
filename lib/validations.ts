import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(200, "Email is too long."),
  phone: z
    .string()
    .trim()
    .max(40, "Phone number is too long.")
    .optional()
    .or(z.literal("")),
  projectType: z
    .string()
    .trim()
    .max(80, "Project type is too long.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(4000, "Message is too long."),
  // Honeypot field — real users never fill this in.
  company: z.string().max(0, "Spam detected.").optional().or(z.literal(""))
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
