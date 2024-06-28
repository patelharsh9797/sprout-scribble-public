import type { Metadata, ResolvingMetadata } from "next";
import ProductType from "@/components/products/product-type";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/lib/format-price";
import ProductPick from "@/components/products/product-pick";
import ProductShowcase from "@/components/products/product-showcase";
// import Reviews from "@/components/reviews/reviews";
// import { getReviewAverage } from "@/lib/review-avarage";
// import Stars from "@/components/reviews/stars";
// import AddCart from "@/components/cart/add-cart";

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  if (data) {
    const slugID = data.map((variant) => ({ slug: variant.id.toString() }));
    return slugID;
  }
  return [];
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      product: true,
    },
  });

  const oldTitle = (await parent).title || ""

  return {
    title: variant ? variant.product.title : oldTitle,
  };
}

export default async function Page({ params }: Props) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      product: {
        with: {
          reviews: true,
          productVariants: {
            with: { variantImages: true, variantTags: true },
          },
        },
      },
    },
  });

  if (variant) {
    // const reviewAvg = getReviewAverage(
    //   variant?.product.reviews.map((r) => r.rating),
    // );

    return (
      <main>
        <section className="flex flex-col gap-4 lg:flex-row lg:gap-12">
          <div className="flex-1">
            <ProductShowcase variants={variant.product.productVariants} />
          </div>
          <div className="flex  flex-1 flex-col">
            <h2 className="text-2xl font-bold">{variant?.product.title}</h2>
            <div>
              <ProductType variants={variant.product.productVariants} />
              {/* <Stars */}
              {/*   rating={reviewAvg} */}
              {/*   totalReviews={variant.product.reviews.length} */}
              {/* /> */}
            </div>
            <Separator className="my-2" />
            <p className="py-2 text-2xl font-medium">
              {formatPrice(variant.product.price)}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: variant.product.description }}
            ></div>
            <p className="my-2 font-medium text-secondary-foreground">
              Available Colors
            </p>
            <div className="flex gap-4 ">
              {variant.product.productVariants.map((prodVariant) => (
                <ProductPick
                  key={prodVariant.id}
                  productID={variant.productID}
                  productType={prodVariant.productType}
                  id={prodVariant.id}
                  color={prodVariant.color}
                  price={variant.product.price}
                  title={variant.product.title}
                  image={prodVariant.variantImages[0].url}
                />
              ))}
            </div>
            {/* <AddCart /> */}
          </div>
        </section>
        {/* <Reviews productID={variant.productID} /> */}
      </main>
    );
  }
}
