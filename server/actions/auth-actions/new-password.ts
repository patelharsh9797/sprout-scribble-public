"use server";

import { NewPasswordSchema } from "@/types/zod-schema";
import { getPasswordResetTokenByToken } from "./tokens";
import { db, dbPool } from "@/server";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "@/server/schema";
import bcrypt from "bcrypt";
import { safeAction } from "../create-safe-action";

export const newPassword = safeAction(
  NewPasswordSchema,
  async ({ password, token }) => {
    //TO CHECK THE TOKEN
    if (!token) {
      return { error: "Missing Token" };
    }
    //HERE we need to check if the token is valid
    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
      return { error: "Token not found" };
    }
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Token has expired" };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });

    if (!existingUser) {
      return { error: "User not found" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbPool.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, existingUser.id));
      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
    });
    return { success: "Password updated" };
  },
);
