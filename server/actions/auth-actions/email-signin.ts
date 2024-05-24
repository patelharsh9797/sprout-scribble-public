"use server";
import { LoginSchema } from "@/types/zod-schema";
import { safeAction } from "@/server/actions/create-safe-action";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { users } from "@/server/schema";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./emails";
import { signIn } from "@/server/auth";
import { AuthError } from "next-auth";

export const emailSignIn = safeAction(
  LoginSchema,
  async ({ email, password, code }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email !== email) {
        return { error: "Email Not Found" };
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);

        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token,
        );

        return {
          success:
            "Your email is not verified. New confirmation email has been sent.",
        };
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: email };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Password Is Incorrect!" };
          case "AccessDenied":
            return { error: error.message };
          case "OAuthSignInError":
            return { error: error.message };
          default:
            return { error: "Something went wrong!" };
        }
      }
      throw error;
    }
  },
);
