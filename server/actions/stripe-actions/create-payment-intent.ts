"use server";

import { paymentIntentSchema } from "@/types/zod-schema";
import Stripe from "stripe";
import { auth } from "@/server/auth";
import { safeAction } from "../create-safe-action";
import { env } from "@/env.mjs";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const createPaymentIntent = safeAction(
  paymentIntentSchema,
  async ({ amount, cart, currency }) => {
    const user = await auth();
    if (!user) return { error: "Please login to continue" };
    if (!amount) return { error: "No Product to checkout" };

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },

      metadata: {
        cart: JSON.stringify(cart),
      },
    });
    return {
      success: {
        paymentIntentID: paymentIntent.id,
        clientSecretID: paymentIntent.client_secret,
        user: user.user.email,
      },
    };
  },
);
