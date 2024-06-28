import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import ProductForm from "./product-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Product",
};

export default async function AddProduct() {
  const session = await auth();
  if (session?.user.role !== "admin") return redirect("/dashboard/settings");

  return <ProductForm />;
}
