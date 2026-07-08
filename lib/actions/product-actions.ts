"use server";

import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { prisma } from "@/db/prisma";

// get products
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
