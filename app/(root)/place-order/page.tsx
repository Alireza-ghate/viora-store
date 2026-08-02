import { auth } from "@/auth";
import PlaceOrderForm from "@/components/place-order-form";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyCart } from "@/lib/actions/cart-action";
import { getUserByID } from "@/lib/actions/user-actions";
import { formatCurrency } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Place Order",
};

async function PlaceOrderPage() {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("User not found");
  const user = await getUserByID(userId);
  // if cart is empty , redirect user to cart page
  if (!cart || cart.items.length === 0) redirect("/cart");
  if (!user.address) redirect("/shipping-address");
  if (!user.paymentMethod) redirect("/payment-method");

  const userAddress = user.address as ShippingAddress;
  return (
    <>
      <CheckoutSteps currentStep={3} />
      <h1 className="py-4 text-2xl">Place Order</h1>
      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4 p-0.5">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city}{" "}
                {userAddress.postalCode}, {userAddress.country}{" "}
              </p>
              <div className="mt-3">
                <Link href="/shipping-address">
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{user.paymentMethod}</p>
              <div className="mt-3">
                <Link href="/payment-method">
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
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
                  {cart.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Link
                          className="flex items-center gap-2"
                          href={`/product/${item.slug}`}
                        >
                          <Image
                            src={item.image}
                            width={48}
                            height={48}
                            alt={item.name}
                            priority
                          />
                          <span className="pr-6">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-6">{item.qty}</span>
                      </TableCell>
                      <TableCell>$ {item.price}</TableCell>
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
                <div className="">{formatCurrency(cart.itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div className="">{formatCurrency(cart.taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div className="">{formatCurrency(cart.shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div className="">{formatCurrency(cart.totalPrice)}</div>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default PlaceOrderPage;
