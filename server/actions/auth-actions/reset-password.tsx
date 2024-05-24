"use server";

import { ResetSchema } from "@/types/zod-schema";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { users } from "@/server/schema";
import { generatePasswordResetToken } from "./tokens";
import { sendPasswordResetEmail } from "./emails";
import { safeAction } from "../create-safe-action";

export const reset = safeAction(ResetSchema, async ({ email }) => {
  console.log("reset action running");
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!existingUser) {
    return { error: "User not found" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  if (!passwordResetToken) {
    return { error: "Token not generated" };
  }
  await sendPasswordResetEmail(
    passwordResetToken[0].email,
    passwordResetToken[0].token,
  );
  return { success: "Reset Email Sent" };
});
