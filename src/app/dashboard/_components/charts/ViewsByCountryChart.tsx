"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCompactNumber } from "@/lib/formatter";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

export function ViewsByCountryChart({
  chartData,
}: {
  chartData: { views: number; countryCode: string; countryName: string }[];
}) {
  const chartConfig = {
    views: {
      label: "Visitors",
      color: "var(--accent)",
    },
  };
  if (chartData.length === 0) {
    return (
      <p className="flex items-center justify-center text-muted-foreground min-h-[150px] max-h-[250px]">
        No data available
      </p>
    );
  }
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[150px] max-h-p[250px] w-full"
    >
      <BarChart accessibilityLayer data={chartData}>
        <XAxis dataKey={"countryCode"} tickLine={false} tickMargin={10} />
        <YAxis
          tickLine={false}
          tickMargin={10}
          allowDecimals={false}
          tickFormatter={formatCompactNumber}
        />
        <ChartTooltip content={<ChartTooltipContent nameKey="countryName" />} />
        <Bar dataKey="views" fill="var(--color-views)" />
      </BarChart>
    </ChartContainer>
  );
}
