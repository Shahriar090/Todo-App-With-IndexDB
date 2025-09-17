import { z } from 'zod'

export const registerUserValidationSchema = z.object({
   email: z.email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be at most 50 characters long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be at most 50 characters long"),
})

// inferring type
export type RegisterUserFormData = z.infer<typeof registerUserValidationSchema>