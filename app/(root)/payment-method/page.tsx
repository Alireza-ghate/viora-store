import { auth } from "@/auth";
import PaymentMethodForm from "@/components/payment-method-form";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { getUserByID } from "@/lib/actions/user-actions";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Select Payment Method",
};
async function PaymentMethodPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("No user found");
  const user = await getUserByID(userId);
  return (
    <>
      <CheckoutSteps currentStep={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </>
  );
}

export default PaymentMethodPage;
