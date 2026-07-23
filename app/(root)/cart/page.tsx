import CartTable from "@/components/cart-table";
import { getMyCart } from "@/lib/actions/cart-action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
};

async function CartPage() {
  // get cart obj
  const cart = await getMyCart();

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      <CartTable cart={cart} />
    </>
  );
}

export default CartPage;
