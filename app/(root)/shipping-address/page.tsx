import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";
import ShippingAddressForm from "@/components/shipping-address-form";
import { getMyCart } from "@/lib/actions/cart-action";
import { getUserByID } from "@/lib/actions/user-actions";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Shipping Address",
};

async function ShippingAddressPage() {
  const cart = await getMyCart();

  // check if cart is empty redirect to somewhere else
  if (!cart || cart.items.length === 0) redirect("/cart");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("No user id");

  const user = await getUserByID(userId);
  console.log(user);

  return (
    <>
      <CheckoutSteps currentStep={1} />
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
}

export default ShippingAddressPage;
