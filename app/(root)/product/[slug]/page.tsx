import AddToCart from "@/components/shared/product/add-to-cart";
import ProductImages from "@/components/shared/product/product-images";
import ProductPrice from "@/components/shared/product/product-price";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getMyCart } from "@/lib/actions/cart-action";
import { getSingleProductAction } from "@/lib/actions/product-actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "test",
};

type ProductDetailsPageProps = {
  params: Promise<{ slug: string }>;
};
// based on ID or Slug of products in URL we gonna fetch that data

async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { slug } = await params;
  const singleProduct = await getSingleProductAction(slug);

  if (!singleProduct) notFound(); // if there is no data send user to notFound page

  const cart = await getMyCart();

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* images coloum */}
          <div className="col-span-2">
            <ProductImages images={singleProduct.images} />
          </div>

          {/* details coloum */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-y-6">
              <p>
                {singleProduct.brand} {singleProduct.category}
              </p>
              <h1 className="h3-bold">{singleProduct.name}</h1>
              <p>
                {singleProduct.rating} of {singleProduct.numReviews} reviews
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <ProductPrice
                  value={Number(singleProduct.price)}
                  className="bg-green-100 text-green-700 px-5 py-2 rounded-full w-24"
                />
              </div>
            </div>

            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p className="mt-2">{singleProduct.description}</p>
            </div>
          </div>

          {/* Action coloum */}
          <div className="col-span-1">
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between items-center">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(singleProduct.price)} />
                  </div>
                </div>

                <div className="mb-4 flex justify-between items-center">
                  <div>Status</div>
                  {singleProduct.stock > 0 ? (
                    <Badge variant={"outline"}>In Stock</Badge>
                  ) : (
                    <Badge variant={"destructive"}>Out Of Stock</Badge>
                  )}
                </div>

                {singleProduct.stock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: singleProduct.id,
                        name: singleProduct.name,
                        slug: singleProduct.slug,
                        qty: 1,
                        image: singleProduct.images![0],
                        price: singleProduct.price,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductDetailsPage;
