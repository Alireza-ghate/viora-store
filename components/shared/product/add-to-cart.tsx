"use client";

import { Button } from "@/components/ui/button";
import {
  addToCartAction,
  removeItemFromCartAction,
} from "@/lib/actions/cart-action";
import { Cart, CartItem } from "@/types";
import { Plus, Minus } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import Spinner from "../spinner";

interface AddToCartProps {
  item: CartItem;
  cart?: Cart;
}

function AddToCart({ item, cart }: AddToCartProps) {
  const [isPending, startTransition] = useTransition();

  async function handleAddToCart() {
    startTransition(async () => {
      const res = await addToCartAction(item);

      if (!res?.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
    });
  }

  async function handleRemoveFromCart() {
    startTransition(async () => {
      const res = await removeItemFromCartAction(item.productId);

      if (!res?.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
    });
  }

  // check if item is in the cart
  const existItem =
    cart && cart?.items.find((i) => i.productId === item.productId);

  return existItem ? (
    <div className="flex items-center gap-x-2">
      <Button type="button" variant={"outline"} onClick={handleRemoveFromCart}>
        {isPending ? (
          <Spinner className="text-gray-700" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>

      <span className="px-2">{existItem.qty}</span>

      <Button type="button" variant={"outline"} onClick={handleAddToCart}>
        {isPending ? (
          <Spinner className="text-gray-700" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button onClick={handleAddToCart} type="button" className="w-full">
      {isPending ? <Spinner /> : <Plus />} Add To Cart
    </Button>
  );
}

export default AddToCart;
