import {
  cartItemSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  insertProductSchema,
  shippingAddressSchema,
} from "@/lib/validators";

import z from "zod";

export type Product = {
  id: string;
  createdAt: Date;
  rating: string;
} & z.infer<typeof insertProductSchema>;

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivery: boolean;
  deliveredAt: Date | null;
  orderItems: OrderItem[];
  user: { name: string; email: string };
};
