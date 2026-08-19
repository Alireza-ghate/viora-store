import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteProduct, getProducts } from "@/lib/actions/product-actions";
import { formatCurrency, formatId } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products",
};

interface ProductsPageProps {
  searchParams: Promise<{
    query: string;
    page: string;
    category: string;
  }>;
}

async function ProductsPage({ searchParams }: ProductsPageProps) {
  const searchParam = await searchParams;
  const page = Number(searchParam.page) || 1;
  const query = searchParam.query || "";
  const category = searchParam.category || "";

  const products = await getProducts({ query, page, category });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
        <Button asChild className="h-10">
          <Link href={"/admin/products/create"}>
            Create Product <PlusIcon />
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className="text-right">PRICE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead className="w-25">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="p-4">{formatId(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.rating}</TableCell>
              <TableCell className="flex items-center gap-x-2">
                <Button asChild variant={"outline"} size={"sm"}>
                  <Link href={`/admin/products/${product.id}`}>Edit</Link>
                </Button>
                <DeleteDialog action={deleteProduct} id={product.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {products?.totalPages && products.totalPages > 1 && (
        <Pagination totalPages={products.totalPages} page={page} />
      )}
    </div>
  );
}

export default ProductsPage;
