'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CalculatorForm({ onCalculate }) {
  const [initialAmount, setInitialAmount] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate calculation time with a small delay for animation effect
    setTimeout(() => {
      onCalculate({
        initialAmount: Number(initialAmount),
        monthlyContribution: Number(monthlyContribution),
        annualRate: Number(annualRate),
        years: Number(years),
      });
      setIsLoading(false);
    }, 600);
  };

  return (
    <Card className="w-full border-slate-700 shadow-lg">
      <CardHeader>
        <CardTitle>Investment Parameters</CardTitle>
        <CardDescription>Set your investment details to calculate growth</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="initial" className="text-sm font-bold">
                Initial Amount (₹)
              </Label>
              <Input
                id="initial"
                type="number"
                min="0"
                step="100"
                value={initialAmount}
                onChange={(e) => setInitialAmount(Number(e.target.value))}
                className="w-full border-slate-700 shadow-md border-solid"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly" className="text-sm font-bold">
                Monthly Contribution (₹)
              </Label>
              <Input
                id="monthly"
                type="number"
                min="0"
                step="50"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full border-slate-700 shadow-md border-solid"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate" className="text-sm font-bold">
                Annual Interest Rate (%)
              </Label>
              <Input
                id="rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="w-full border-slate-700 shadow-md border-solid"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years" className="text-sm font-bold">
                Time Period (Years)
              </Label>
              <Input
                id="years"
                type="number"
                min="1"
                max="50"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full border-slate-700 shadow-md border-solid"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full md:w-auto gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-loading-spinner h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Calculating...</span>
              </>
            ) : (
              'Calculate'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
