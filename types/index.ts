import {
  cartItemSchema,
  insertCartSchema,
  insertProductSchema,
} from "@/lib/validators";

import z from "zod";

export type Product = {
  id: string;
  createdAt: Date;
  rating: string;
} & z.infer<typeof insertProductSchema>;

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
