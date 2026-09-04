import UpdateProductForm from "@/components/admin/update-product-form";
import { getSingleProductById } from "@/lib/actions/product-actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "",
};

interface ProductUpdatePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function ProductUpdatePage({ params }: ProductUpdatePageProps) {
  const { id } = await params;

  // get product by id
  const product = await getSingleProductById(id);
  if (!product) return notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="h2-bold">Update Product</h1>
      <UpdateProductForm product={product} productId={product.id} />
    </div>
  );
}

export default ProductUpdatePage;
