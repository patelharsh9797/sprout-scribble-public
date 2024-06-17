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

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(8)),
    newPassword: z.optional(z.string().min(8)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    { message: "New password is required", path: ["newPassword"] },
  );

export type SettingsSchemaType = z.infer<typeof SettingsSchema>;

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, {
    message: "Title must be at least 5 characters long",
  }),
  description: z.string().min(40, {
    message: "Description must be at least 40 characters long",
  }),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive({ message: "Price must be a positive number" }),
});

export type ProductSchemaType = z.infer<typeof ProductSchema>;

export const VariantSchema = z.object({
  productID: z.number(),
  id: z.number().optional(),
  editMode: z.boolean(),
  productType: z
    .string()
    .min(3, { message: "Product type must be at least 3 characters long" }),
  color: z
    .string()
    .min(3, { message: "Color must be at least 3 characters long" }),
  tags: z.array(z.string()).min(1, {
    message: "You must provide at least one tag",
  }),
  variantImages: z
    .array(
      z.object({
        url: z.string().refine((url) => url.search("blob:") !== 0, {
          message: "Please wait for the image to upload",
        }),
        size: z.number(),
        key: z.string().optional(),
        id: z.number().optional(),
        name: z.string(),
      }),
    )
    .min(1, { message: "You must provide at least one image" }),
});

export type VariantSchemaType = z.infer<typeof VariantSchema>;
