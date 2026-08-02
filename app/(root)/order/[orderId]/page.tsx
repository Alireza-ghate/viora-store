import { getOrderByID } from "@/lib/actions/order-action";
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
  return <div>{order.paymentMethod}</div>;
}

export default OrderDetailsPage;
