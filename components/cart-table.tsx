"use client";

import { Cart, CartItem } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  addToCartAction,
  removeItemFromCartAction,
} from "@/lib/actions/cart-action";
import Spinner from "./shared/spinner";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "@/lib/utils";

interface CartTableProps {
  cart?: Cart;
}

function CartTable({ cart }: CartTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleAddToCart(item: CartItem) {
    startTransition(async () => {
      const res = await addToCartAction(item);

      if (!res?.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
    });
  }
  async function handleRemoveFromCart(item: CartItem) {
    startTransition(async () => {
      const res = await removeItemFromCartAction(item.productId);

      if (!res?.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
    });
  }

  if (!cart || cart.items.length === 0)
    return (
      <div>
        Cart is empty{" "}
        <Link className="" href={"/"}>
          Go Shopping
        </Link>
      </div>
    );

  return (
    <div className="grid md:grid-cols-4 md:gap-5">
      <div className="md:col-span-3 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {cart.items.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>
                  <Link
                    className="flex items-center"
                    href={`/product/${item.slug}`}
                  >
                    <Image
                      priority
                      src={item.image}
                      height={50}
                      width={50}
                      alt={item.name}
                    />
                    <span className="px-2">{item.name}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-center flex-center gap-x-2">
                  <Button
                    disabled={isPending}
                    variant={"outline"}
                    onClick={() => handleRemoveFromCart(item)}
                    type="button"
                  >
                    {isPending ? (
                      <Spinner className="text-gray-700" />
                    ) : (
                      <Minus className="w-4 h-4" />
                    )}
                  </Button>
                  <span>{item.qty}</span>
                  <Button
                    disabled={isPending}
                    variant={"outline"}
                    onClick={() => handleAddToCart(item)}
                    type="button"
                  >
                    {isPending ? (
                      <Spinner className="text-gray-700" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="text-right">{item.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* subtotal part */}
      <Card>
        <CardContent className="p-4 gap-4">
          <div className="pb-3 text-xl">
            Subtotal ({cart.items.reduce((acc, item) => item.qty + acc, 0)}):
            <span className="font-bold">{formatCurrency(cart.itemsPrice)}</span>
          </div>
          <Button
            className="w-full"
            disabled={isPending}
            onClick={() =>
              startTransition(() => {
                router.push("/shipping-address");
              })
            }
          >
            {isPending ? <Spinner /> : <ArrowRight className="h-4 w-4" />}{" "}
            Proceed to checkout
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // return (
  //   <>
  //     {!cart || cart.items.length === 0 ? (
  //       <div>
  //         Cart is empty{" "}
  //         <Link className="" href={"/"}>
  //           Go Shopping
  //         </Link>
  //       </div>
  //     ) : (
  //       <div className="grid md:grid-cols-4 md:gap-5">
  //         <div className="md:col-span-3 overflow-x-auto"></div>
  //       </div>
  //     )}
  //   </>
  // );
}

export default CartTable;
