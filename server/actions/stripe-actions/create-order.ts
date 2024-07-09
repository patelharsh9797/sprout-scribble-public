"use server";

import { createOrderSchema } from "@/types/zod-schema";
import { auth } from "@/server/auth";
import { db } from "@/server";
import { orders, orderProduct } from "@/server/schema";
import { safeAction } from "../create-safe-action";

export const createOrder = safeAction(
  createOrderSchema,
  async ({ products, status, total, paymentIntentID }) => {
    const user = await auth();
    if (!user) return { error: "user not found" };

    const order = await db
      .insert(orders)
      .values({
        status,
        paymentIntentID,
        total,
        userID: user.user.id,
      })
      .returning();
    const orderProducts = products.map(
      async ({ productID, quantity, variantID }) => {
        const newOrderProduct = await db.insert(orderProduct).values({
          quantity,
          orderID: order[0].id,
          productID: productID,
          productVariantID: variantID,
        });
      },
    );
    return { success: "Order has been added" };
  },
);
