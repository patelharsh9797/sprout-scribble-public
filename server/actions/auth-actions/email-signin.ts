"use server";
import { LoginSchema } from "@/types/zod-schema";
import { safeAction } from "@/server/actions/create-safe-action";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { twoFactorTokens, users } from "@/server/schema";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "./tokens";
import { sendTwoFactorTokenByEmail, sendVerificationEmail } from "./emails";
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

      if (existingUser.twoFactorEnabled && existingUser.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email,
          );
          if (!twoFactorToken) return { error: "Invalid Token" };
          if (twoFactorToken.token !== code) return { error: "Invalid Token" };

          const hasExpired = new Date(twoFactorToken.expires) < new Date();

          if (hasExpired) return { error: "Token has expired." };

          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));
        } else {
          const token = await generateTwoFactorToken(existingUser.email);

          if (!token) {
            return { error: "Token not generated!" };
          }

          await sendTwoFactorTokenByEmail(token[0].email, token[0].token);
          return { twoFactor: "Two Factor Token Sent!" };
        }
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
