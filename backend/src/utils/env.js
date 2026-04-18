import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),

  MONGO_URI: z.string().min(1),

  JWT_SECRET: z.string().min(20),
  JWT_EXPIRES_IN: z.string().min(1).default("7d"),

  ADMIN_BOOTSTRAP_ENABLED: z.coerce.boolean().default(false),
  ADMIN_BOOTSTRAP_EMAIL: z.preprocess((val) => (val === "" ? undefined : val), z.string().email().optional()),
  ADMIN_BOOTSTRAP_PASSWORD: z.preprocess((val) => (val === "" ? undefined : val), z.string().min(8).optional()),
  ADMIN_BOOTSTRAP_EMAIL_2: z.preprocess((val) => (val === "" ? undefined : val), z.string().email().optional()),
  ADMIN_BOOTSTRAP_PASSWORD_2: z.preprocess((val) => (val === "" ? undefined : val), z.string().min(8).optional()),

  WEB_ORIGIN: z.string().url().optional(),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_SECURE: z.coerce.boolean().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().optional(),
  MAIL_TO: z.string().optional(),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  GA_MEASUREMENT_ID: z.string().optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment");
}

export const env = parsed.data;

