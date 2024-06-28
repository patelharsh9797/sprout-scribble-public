"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
export default function ProductPick({
  id,
  color,
  productType,
  title,
  price,
  productID,
  image,
}: {
  id: number;
  color: string;
  productType: string;
  title: string;
  price: number;
  productID: number;
  image: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get("type" || productType);

  return (
    <div
      title={color}
      style={{
        background: color,
        // @ts-ignore
        "--tw-ring-color": selectedColor === productType ? color : undefined,
      }}
      className={cn(
        `h-8 w-8 cursor-pointer rounded-full ring-[1px] ring-transparent ring-offset-2 ring-offset-background transition-all duration-300 ease-in-out hover:opacity-75`,
        selectedColor === productType ? `opacity-100` : `opacity-50`,
      )}
      onClick={() =>
        router.push(
          `/products/${id}?id=${id}&productID=${productID}&price=${price}&title=${title}&type=${productType}&image=${image}`,
          { scroll: false },
        )
      }
    ></div>
  );
}
