"use server";

import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma/client";

// calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
  );

  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addToCartAction(data: CartItem) {
  try {
    // check for sessionCartId cookie exists or not
    // get value of cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // get session and user id
    const session = await auth();
    // make sure if session?.user?.id does not exist dont throw error just set it as undefined
    const userId = session?.user?.id
      ? (session?.user?.id as string)
      : undefined;

    //  get cart
    const cart = await getMyCartAction();

    // parse and validate item we got with zod schema for insert items into cart
    const item = cartItemSchema.parse(data);

    // find product in database FOR CHECK IF ITEM ADDED TO CART IS IN OUR PRODUCT DATABSE OR NOT!
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not found");

    if (!cart) {
      // create new cart obj
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // add cart to cart table in database
      await prisma.cart.create({
        data: newCart,
      });

      // after adding item to cart, revalidate product detail page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      //  check if item is already in the cart
      const existItem = (cart.items as CartItem[]).find(
        (i) => i.productId === product.id,
      );

      if (existItem) {
        // first check stock is enough
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }

        // increase qty
        (cart.items as CartItem[]).find(
          (i) => product.id === i.productId,
        )!.qty = existItem.qty + 1;
      } else {
        // if item in cart doesnt exist
        // check stock again if is enough
        if (product.stock < 1) throw new Error("Not enough stock");

        // add item to cart.items
        cart.items.push(item);
      }

      // save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[], // update items property
          ...calcPrice(cart.items as CartItem[]), // update all prices based on added new items to cart.temes array
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${existItem ? "updated in" : "added to"} cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCartAction() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");
  const session = await auth();
  const userId = session?.user?.id ? (session?.user?.id as string) : undefined;
  // get user cart from database by sesssionCartId or userID
  const cart = await prisma.cart.findFirst({
    // GET USER CART IF USER ALREADY LOGGED IN BY ITS USERID IF DIDNT LOGGED IN AND ITS A GUEST USER, USER SESSIONCARTID TO GET ITS CART
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // convert prisma obj to regular plain js obj:
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
