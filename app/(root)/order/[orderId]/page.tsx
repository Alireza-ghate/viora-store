import OrderDetailsTable from "@/components/order-details-table";
import { getOrderByID } from "@/lib/actions/order-action";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
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
  // if there is no order redirects user to notFound page
  if (!order) notFound();
  return (
    <div>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
      />
    </div>
  );
}

export default OrderDetailsPage;
