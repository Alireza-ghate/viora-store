"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { insertOrderSchema } from "../validators";
import { getMyCart } from "./cart-action";
import { getUserByID } from "./user-actions";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "../generated/prisma/client";
import { revalidatePath } from "next/cache";

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
      orderItems: true, // also get orderItems field
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

// get user's orders
export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  // get userId
  const session = await auth();
  if (!session) throw new Error("User is not authorized");
  const userId = session.user.id;

  // get all orders
  const data = await prisma.order.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: { userId: userId },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export type SalesDataType = {
  month: string;
  totalSales: number;
}[];

//  get sales data and order summary
export async function getOrderSummary() {
  // get counts for each resource
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();
  // calculate total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });
  // get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  // get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
    },
    take: 6, // only get 6 item
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    salesData,
    latestSales,
  };
}

//  get all orders
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const data = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      user: { select: { name: true } },
    },
  });

  const dataCount = await prisma.order.count();
  const totalPages = Math.ceil(dataCount / limit);

  return {
    data,
    totalPages,
  };
}

// delete a single order
export async function deleteOrder(orderId: string) {
  try {
    await prisma.order.delete({
      where: { id: orderId },
    });

    // after deletion of order, revalidate the page
    revalidatePath("/admin/orders");

    return { success: true, message: "Order successfully deleted" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// update cashOnDelivery orders to paid
export async function updateCodOrderToPaid(orderId: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { isPaid: true },
    });

    revalidatePath(`/order/${orderId}`);

    return { success: true, message: "Order marked as paid" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// update cashOnDelivery order to delivered
export async function deliverOrder(orderId: string) {
  try {
    // get the order itself
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");
    if (!order.isPaid) throw new Error("Order is not paid");

    // then update order
    await prisma.order.update({
      where: { id: orderId },
      data: { isDelivered: true, deliveredAt: new Date() },
    });

    revalidatePath(`/order/${orderId}`);

    return { success: true, message: "Order marked as delivered" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
