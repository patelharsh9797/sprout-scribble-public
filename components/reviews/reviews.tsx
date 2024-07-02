import { db } from "@/server";
import Review from "./review";
import ReviewsForm from "./reviews-form";
import { desc, eq } from "drizzle-orm";
import { reviews } from "@/server/schema";
import ReviewChart from "./review-chart";

export default async function Reviews({ productID }: { productID: number }) {
  const data = await db.query.reviews.findMany({
    with: { user: true },
    where: eq(reviews.productID, productID),
    orderBy: [desc(reviews.created)],
  });

  return (
    <section className="py-8">
      <div className="flex flex-col justify-stretch gap-2 lg:flex-row lg:gap-12">
        <div className="flex-1">
          <h2 className="mb-4 text-2xl font-bold">Product Reviews</h2>
          <ReviewsForm />
          <Review reviews={data} />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <ReviewChart reviews={data} />
        </div>
      </div>
    </section>
  );
}
