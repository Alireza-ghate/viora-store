import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};
// DELETE LATER
// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

function HomePage() {
  // await delay(2000);
  return (
    <>
      <ProductList data={sampleData.products} title="Newest Arrival" />
    </>
  );
}

export default HomePage;
