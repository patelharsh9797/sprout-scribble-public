import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid Email Address!",
  }),
  password: z.string().min(1, {
    message: "Password is required!",
  }),
  code: z.string().optional(),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  name: z
    .string()
    .min(4, { message: "Please add a name with at least 4 characters" }),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export const NewPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
  token: z.string().nullable().optional(),
});

export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export type ResetSchemaType = z.infer<typeof ResetSchema>;
