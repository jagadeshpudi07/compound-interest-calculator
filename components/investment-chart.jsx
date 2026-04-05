'use client';

import React, { useState, useEffect } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useScrollObserver } from '@/hooks/use-scroll-observer';

const chartConfig = {
  contributions: {
    label: 'Total Contributions',
    color: 'var(--color-chart-1)',
  },
  growth: {
    label: 'Investment Growth',
    color: 'var(--color-chart-2)',
  },
};

export function InvestmentChart({ data }) {
  const { ref, isVisible } = useScrollObserver();
  const [animationDelay, setAnimationDelay] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setAnimationDelay(1);
    }
  }, [isVisible]);

  const colors = {
    contributions: 'oklch(0.42 0.15 241)',
    growth: 'oklch(0.45 0.12 150)',
  };

  const chartData = data.map((point) => ({
    ...point,
    year: `Year ${point.year}`,
  }));

  return (
    <div ref={ref}>
      <Card className={isVisible ? 'animate-slide-up' : 'opacity-0'}>
        <CardHeader>
          <CardTitle className="font-extrabold">Investment Growth Over Time</CardTitle>
          <CardDescription>
            Breakdown of contributions vs. compound interest earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.contributions} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={colors.contributions} stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.growth} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={colors.growth} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="year"
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                />
                <ChartTooltip 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
                          <p className="text-sm font-semibold text-foreground">{payload[0]?.payload?.year}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-xs" style={{ color: entry.color }}>
                              {entry.name}: ₹{Number(entry.value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  contentStyle={{
                    color: 'var(--color-foreground)',
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="contributions"
                  stroke={colors.contributions}
                  fillOpacity={1}
                  fill="url(#colorContributions)"
                  name="Total Contributions"
                  stackId="1"
                  style={
                    isVisible
                      ? {
                          animation: 'chartLineGrow 2.5s ease-out forwards',
                          strokeDasharray: 1000,
                        }
                      : { opacity: 0 }
                  }
                />
                <Area
                  type="monotone"
                  dataKey="growth"
                  stroke={colors.growth}
                  fillOpacity={1}
                  fill="url(#colorGrowth)"
                  name="Investment Growth"
                  stackId="1"
                  style={
                    isVisible
                      ? {
                          animation: 'chartLineGrow 2.5s ease-out 0.3s forwards',
                          strokeDasharray: 1000,
                        }
                      : { opacity: 0 }
                  }
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
