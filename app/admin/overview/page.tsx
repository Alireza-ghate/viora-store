import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrderSummary } from "@/lib/actions/order-action";
import { requireAdmin } from "@/lib/auth-guard";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import { BadgeDollarSign, Barcode, CreditCardIcon, Users } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import Charts from "./charts";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

async function OverviewPage() {
  const {
    latestSales,
    ordersCount,
    productsCount,
    usersCount,
    salesData,
    totalSales,
  } = await getOrderSummary();

  // show dashboard when user.role is only Admin
  await requireAdmin();

  return (
    <div className="space-y-4">
      <h1 className="h2-bold">Dashboard</h1>
      {/* row num 1 */}
      <div className="grid md:grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalSales._sum.totalPrice?.toString() || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCardIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(ordersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(usersCount)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(productsCount)}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* row num 2 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-7 gap-4">
        {/* overview column */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardContent>
              <Charts data={{ salesData }} />
            </CardContent>
          </CardHeader>
        </Card>
        {/* recent sales column */}
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BUYER</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>TOTAL</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order?.user?.name ? order.user.name : "Deleted user"}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(order.createdAt).dateOnly}
                    </TableCell>
                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                    <TableCell>
                      <Link href={`/order/${order.id}`}>
                        <span className="px-2">Details</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default OverviewPage;
