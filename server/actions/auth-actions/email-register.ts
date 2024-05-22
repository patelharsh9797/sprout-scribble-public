"use server";
import { RegisterSchema } from "@/types/zod-schema";
import { safeAction } from "@/server/actions/create-safe-action";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { users } from "@/server/schema";
import bcrypt from "bcrypt";

export const emailRegister = safeAction(
  RegisterSchema,
  async ({ email, name, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      // if(!existingUser.emailVerified) {
      //
      // }

      return { error: "Email already in use!" };
    }
    return { success: "Yay" };
  },
);
