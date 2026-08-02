"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { insertOrderSchema } from "../validators";
import { getMyCart } from "./cart-action";
import { getUserByID } from "./user-actions";

// create order and create orderItem
// export async function createOrderAction() {
//   try {
//     // get session
//     const session = await auth();
//     if (!session) throw new Error("User is not authenticated");

//     // get cart
//     const cart = await getMyCart();
//     const userId = session.user.id;
//     // get user
//     const user = await getUserByID(userId);

//     // check if user.address or user.paymentMethod is falsy then redirect user not from action but from client to their pages
//     if (!cart || cart.items.length === 0)
//       return {
//         success: false,
//         message: "Your cart is empty",
//         redirectTo: "/cart",
//       };

//     if (!user.address)
//       return {
//         success: false,
//         message: "No shipping address",
//         redirectTo: "/shipping-address",
//       };

//     if (!user.paymentMethod)
//       return {
//         success: false,
//         message: "No payment method",
//         redirectTo: "/payment-method",
//       };

//     // create Order object and validate it with its schema
//     const order = insertOrderSchema.parse({
//       userId: user.id,
//       itemsPrice: cart.itemsPrice,
//       shippingPrice: cart.shippingPrice,
//       taxPrice: cart.taxPrice,
//       totalPrice: cart.totalPrice,
//       paymentMethod: user.paymentMethod,
//       shippingAddress: user.address,
//     });

//     // create a transction to create order and orderItem in database
//     const insertedOrderId = await prisma.$transaction(async (tx) => {
//       // create order in order table in database
//       const insertedOrder = await tx.order.create({
//         data: order,
//       });
//       // create orderItem for every item inside cart.items[]
//       for (const item of cart.items as CartItem[]) {
//         await tx.orderItem.create({
//           data: {
//             ...item,
//             orderId: insertedOrder.id,
//             price: item.price,
//           },
//         });
//       }

//       // clear cart after order is created transaction is done
//       await tx.cart.update({
//         where: { id: cart.id },
//         data: {
//           items: [],
//           shippingPrice: 0,
//           taxPrice: 0,
//           totalPrice: 0,
//           itemsPrice: 0,
//         },
//       });

//       return insertedOrder.id;
//     });

//     if (!insertedOrderId) throw new Error("Order not created");

//     return {
//       success: true,
//       message: "Order successfully created",
//       redirectTo: `/order/${insertedOrderId}`,
//     };
//   } catch (error) {
//     if (isRedirectError(error)) throw error;

//     return { success: false, message: formatError(error) };
//   }
// }
// Create order and create the order items
export async function createOrderAction() {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found");

    const user = await getUserByID(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }

    if (!user.address) {
      return {
        success: false,
        message: "No shipping address",
        redirectTo: "/shipping-address",
      };
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No payment method",
        redirectTo: "/payment-method",
      };
    }

    // Create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    // Create a transaction to create order and order items in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Create order
      const insertedOrder = await tx.order.create({ data: order });
      // Create order items from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }
      // Clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order not created");

    return {
      success: true,
      message: "Order created",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}

// fetch single order based on orderId
export async function getOrderByID(orderId: string) {
  const data = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      OrderItems: true, // also get OrderItems field
      user: {
        select: {
          name: true,
          email: true,
        },
      }, // from user table only get name and email fields
    },
  });

  // if (!data) throw new Error("Order not found");

  return convertToPlainObject(data);
}
