"use server";

import * as z from "zod";
import { db } from "@/server";
import { products } from "@/server/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { safeAction } from "../create-safe-action";

export const deleteProduct = safeAction(
  z.object({ id: z.number() }),
  async ({ id }) => {
    try {
      const data = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();
      revalidatePath("/dashboard/products");
      return { success: `Product ${data[0].title} has been deleted` };
    } catch (error) {
      return { error: "Failed to delete product" };
    }
  },
);
