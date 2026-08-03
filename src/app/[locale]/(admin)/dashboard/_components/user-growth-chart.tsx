"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  users: {
    label: "Users Joined",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function UserGrowthChart({
  data,
}: {
  data: { date: string; users: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="text-muted-foreground flex min-h-[300px] w-full items-center justify-center rounded-lg border border-dashed text-sm">
        No data available for the last 14 days
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-users)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-users)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          allowDecimals={false}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="users"
          stroke="var(--color-users)"
          fillOpacity={1}
          fill="url(#fillUsers)"
          strokeWidth={3}
        />
      </AreaChart>
    </ChartContainer>
  );
}
