import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product-actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};
// DELETE LATER
// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

async function HomePage() {
  // await delay(2000);
  const latestProducts = await getLatestProducts();
  return (
    <>
      <ProductList data={latestProducts} title="Newest Arrival" />
    </>
  );
}

export default HomePage;
