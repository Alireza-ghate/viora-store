"use server";

import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

// get latest products
export async function getLatestProductsAction() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT, // how many data we want to fetch
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data); // this data is a prisma object we have to convert it to javascript object
}

// get single product by its slug
export async function getSingleProductAction(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}

// get all products
interface getProductsProps {
  query: string;
  page: number;
  limit?: number;
  category?: string;
}
export async function getProducts({
  query,
  page,
  limit = PAGE_SIZE,
  category,
}: getProductsProps) {
  const data = await prisma.product.findMany({
    skip: (page - 1) * limit, // when using pagination
    take: limit, // how many data will fetch
  });

  if (!data) throw new Error("Products not found");

  const dataCount = await prisma.product.count();

  return {
    data,
    dataCount,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// delete single product
export async function deleteProduct(productId: string) {
  try {
    // first check product exist
    const existProduct = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!existProduct) throw new Error("Product not found");

    await prisma.product.delete({
      where: { id: productId },
    });

    // after deletion a product, revalidate the page
    revalidatePath("/admin/products");

    return { success: true, message: "Product successfully deleted" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
