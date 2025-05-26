import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string(), //TODO: Add password validation
  username: z
    .string()
    .min(3, "Username must be atleast of 3 characters")
    .max(63, "Username must be atmax of 63 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username can only contain lowercase letters, digits and hyphens. It must start and end with a letter or number."
    )
    .refine(
      (val) => !val.includes("--"),
      "Username cannot contain consecutive hyphens"
    )
    .transform((val) => val.toLowerCase()),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
