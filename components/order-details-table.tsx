"use client";

import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { deliverOrder, updateCodOrderToPaid } from "@/lib/actions/order-action";
import Spinner from "./shared/spinner";
import { toast } from "sonner";

interface OrderDetailsTableProps {
  order: Order;
  isAdmin: boolean;
}

function OrderDetailsTable({ order, isAdmin }: OrderDetailsTableProps) {
  const {
    itemsPrice,
    deliveredAt,
    id,
    isDelivered,
    isPaid,
    orderItems,
    paidAt,
    paymentMethod,
    shippingAddress,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = order;
  const [isPending, startTransition] = useTransition();

  function handlePaid() {
    startTransition(async () => {
      const res = await updateCodOrderToPaid(id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  }

  function handleDelivered() {
    startTransition(async () => {
      const res = await deliverOrder(id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatId(id)}</h1>
      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4 overflow-x-auto p-0.5">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p className="mb-2">{paymentMethod}</p>
              {isPaid ? (
                <Badge variant={"secondary"}>
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant={"destructive"}>Not paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p className="mb-2">
                {shippingAddress.streetAddress}, {shippingAddress.city}{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge variant={"secondary"}>
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant={"destructive"}>Not delivered</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orderItems.map((orderItem, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Link
                          className="flex items-center gap-2"
                          href={`/product/${orderItem.slug}`}
                        >
                          <Image
                            src={orderItem.image}
                            width={48}
                            height={48}
                            alt={orderItem.name}
                            priority
                          />
                          <span className="pr-6">{orderItem.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-6">{orderItem.qty}</span>
                      </TableCell>
                      <TableCell>$ {orderItem.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="space-y-4 gap-4 p-4">
              <div className="flex justify-between">
                <div>Items</div>
                <div className="">{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div className="">{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div className="">{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div className="">{formatCurrency(totalPrice)}</div>
              </div>
              <div className="flex items-center gap-2">
                {/* cash on delivery */}
                {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
                  <Button disabled={isPending} onClick={handlePaid}>
                    Mark As Paid {isPending && <Spinner />}
                  </Button>
                )}
                {isAdmin &&
                  isPaid &&
                  !isDelivered &&
                  paymentMethod === "CashOnDelivery" && (
                    <Button disabled={isPending} onClick={handleDelivered}>
                      Mark As Delivered {isPending && <Spinner />}
                    </Button>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default OrderDetailsTable;
