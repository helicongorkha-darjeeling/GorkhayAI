// Shared by the contact form (client) and the lead schema (server).
export const interests = ["Website", "AI Booking Bot", "Monthly Management", "Training"] as const;
export type Interest = (typeof interests)[number];

export const propertyTypes = ["hotel", "homestay", "resort", "other"] as const;
export type PropertyType = (typeof propertyTypes)[number];

export const roomRanges = ["1–5", "6–15", "16–40", "40+"] as const;
export const contactMethods = ["WhatsApp", "Phone call", "Email"] as const;
export const timelines = ["As soon as possible", "In 1–3 months", "Just exploring"] as const;
