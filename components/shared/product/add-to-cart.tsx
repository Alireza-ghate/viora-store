"use client";

import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/lib/actions/cart-action";
import { CartItem } from "@/types";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface AddToCartProps {
  item: CartItem;
}

function AddToCart({ item }: AddToCartProps) {
  async function handleAddToCart() {
    const res = await addToCartAction(item);

    if (!res?.success) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
    }
  }

  return (
    <Button onClick={handleAddToCart} type="button" className="w-full">
      <Plus /> Add To Cart
    </Button>
  );
}

export default AddToCart;
