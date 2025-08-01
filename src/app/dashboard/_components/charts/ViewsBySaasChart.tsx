"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatCompactNumber } from "@/lib/formatter";
import { Bar, BarChart, XAxis, YAxis } from "recharts"

export function ViewsBySaasChart({
  chartData,
}: {
  chartData: { saasName: string; views: number }[]
}) {
  const chartConfig = {
    views: {
      label: "Visitors",
      color: "var(--accent)",
    },
  }

  if (chartData.length === 0) {
    return (
      <p className="flex items-center justify-center text-muted-foreground min-h-[150px] max-h-[250px]">
        No data available
      </p>
    )
  }

  const data = chartData.map(d => ({
    ...d,
    saasName: d.saasName.replace("Parity Group: ", ""),
  }))

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[150px] max-h-[250px] w-full"
    >
      <BarChart accessibilityLayer data={data}>
        <XAxis dataKey="saasName" tickLine={false} tickMargin={10} />
        <YAxis
          tickLine={false}
          tickMargin={10}
          allowDecimals={false}
          tickFormatter={formatCompactNumber}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="views" fill="var(--color-views)" />
      </BarChart>
    </ChartContainer>
  )
}