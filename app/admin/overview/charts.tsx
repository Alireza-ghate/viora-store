"use client";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { SalesDataType } from "@/lib/actions/order-action";

interface ChartsProps {
  data: {
    salesData: SalesDataType;
  };
}

function Charts({ data }: ChartsProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data.salesData}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          // axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          // axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />

        <Bar
          dataKey="totalSales"
          fill="currentColor"
          radius={[10, 10, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default Charts;
