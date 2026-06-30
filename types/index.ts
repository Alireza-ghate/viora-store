import { insertProductSchema } from "@/lib/validators";

import z from "zod";

export type Product = {
  id: string;
  createdAt: Date;
  rating: string;
} & z.infer<typeof insertProductSchema>;
