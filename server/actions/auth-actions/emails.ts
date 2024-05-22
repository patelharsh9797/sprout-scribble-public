"use server";

import { Resend } from "resend";
import { env } from "@/env.mjs";
import { getBaseURL } from "@/lib/utils";

const resend = new Resend(env.RESEND_API_KEY);
const domain = getBaseURL();

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${domain}/auth/new-verification?token=${token}`;
};
