"use server";

import { db } from "@/server";
import { auth } from "@/server/auth";
import { safeAction } from "../create-safe-action";
import { ReviewSchema } from "@/types/zod-schema";
import { and, eq } from "drizzle-orm";
import { reviews } from "@/server/schema";
import { revalidatePath } from "next/cache";

export const addReview = safeAction(
  ReviewSchema,
  async ({ productID, rating, comment }) => {
    try {
      const session = await auth();
      if (!session) return { error: "Please sign in" };

      const reviewExists = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productID, productID),
          eq(reviews.userID, session.user.id),
        ),
      });
      if (reviewExists)
        return { error: "You have already reviewed this product" };
      const newReview = await db
        .insert(reviews)
        .values({
          productID,
          rating,
          comment,
          userID: session.user.id,
        })
        .returning();
      revalidatePath(`/products/${productID}`);
      return { success: newReview[0] };
    } catch (err) {
      return { error: JSON.stringify(err) };
    }
  },
);
