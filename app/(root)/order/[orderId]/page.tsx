import { auth } from "@/auth";
import OrderDetailsTable from "@/components/order-details-table";
import { getOrderByID } from "@/lib/actions/order-action";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Order Details",
};

interface OrderPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

async function OrderDetailsPage({ params }: OrderPageProps) {
  const { orderId } = await params;
  const order = await getOrderByID(orderId);
  const session = await auth();
  // if there is no order redirects user to notFound page
  if (!order) notFound();
  return (
    <div>
      <OrderDetailsTable
        isAdmin={session?.user?.role === "admin" || false}
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
      />
    </div>
  );
}

export default OrderDetailsPage;
