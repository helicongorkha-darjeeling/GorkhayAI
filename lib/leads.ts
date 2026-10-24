import { z } from "zod";
import { interests, propertyTypes } from "./leadOptions";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional();

export const leadSchema = z
  .object({
    name: z.string().trim().min(1, "Please tell us your name").max(120),
    email: optionalText(200).refine((v) => !v || z.email().safeParse(v).success, "Please check your email"),
    phone: optionalText(40).refine((v) => !v || /^[+\d][\d\s-]{6,}$/.test(v), "Please check your phone number"),
    property_name: optionalText(160),
    property_type: z.enum(propertyTypes).nullable().optional(),
    interest: z.array(z.enum(interests)).max(4).default([]),
    message: optionalText(2000),
    // Honeypot: real people never fill this in.
    company_website: z.string().max(500).optional(),
  })
  .refine((v) => v.email || v.phone, { message: "Add an email or a phone number so we can reply", path: ["phone"] });

export type LeadInput = z.input<typeof leadSchema>;
