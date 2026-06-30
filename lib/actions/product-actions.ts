"use server";

import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { prisma } from "@/db/prisma";

// get products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT, // how many data we want to fetch
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data); // this data is a prisma object we have to convert it to javascript object
}
