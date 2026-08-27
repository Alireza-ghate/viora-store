"use client";

import { Product } from "@/types";
import CreateProductForm from "./create-product-form";
import UpdateProductForm from "./update-product-form";

interface ProductFormProps {
  type: "Create" | "Update";
  product: Product; // if type === 'update', we need tp know which product will update
  productId: string;
}

// we use this for create/update a product
function ProductForm({ type, product, productId }: ProductFormProps) {
  if (type === "Create") return <CreateProductForm />;

  return <UpdateProductForm product={product} productId={productId} />;
}

export default ProductForm;
