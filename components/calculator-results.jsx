'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/animated-counter';
import { CalculationBreakdown } from './calculation-breakdown';
import { Info } from 'lucide-react';

export function CalculatorResults({
  totalContributions,
  totalGain,
  finalAmount,
  inputs,
}) {
  const [activeDetail, setActiveDetail] = useState(null); // 'contributions', 'gain', 'amount' or null
  const gainPercentage = totalContributions > 0 ? (totalGain / totalContributions) * 100 : 0;

  const cards = [
    {
      id: 'contributions',
      title: 'Total Contributions',
      value: totalContributions,
      subText: 'Amount invested',
      colorClass: 'text-foreground',
      accentColor: 'primary',
      hoverGlow: 'hover:shadow-primary/20',
    },
    {
      id: 'gain',
      title: 'Total Gain',
      value: totalGain,
      subText: `+${gainPercentage.toFixed(1)}% return`,
      colorClass: 'text-accent',
      accentColor: 'accent',
      hoverGlow: 'hover:shadow-accent/20',
    },
    {
      id: 'amount',
      title: 'Final Amount',
      value: finalAmount,
      subText: 'Total portfolio value',
      colorClass: 'text-primary',
      accentColor: 'primary',
      hoverGlow: 'hover:shadow-primary/30',
      isProminent: true,
    }
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Card 
            key={card.id}
            onClick={() => setActiveDetail(card.id)}
            className={`group relative overflow-hidden transition-all duration-300 ease-out hover:shadow-lg ${card.hoverGlow} hover:-translate-y-1 cursor-pointer shadow-xl ${card.isProminent ? 'border-2 border-primary bg-primary/5' : ''}`}
          >
            {/* Hover Effect Bar */}
            <div 
              className={`absolute bottom-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left 
                ${card.accentColor === 'accent' ? 'bg-accent' : 'bg-primary'}`} 
            />
            
            {/* Info Icon on Hover */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className={`p-1.5 rounded-full 
                ${card.accentColor === 'accent' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                <Info className="w-3.5 h-3.5" />
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-baseline gap-1">
                <CardTitle className="text-sm font-medium text-muted-foreground truncate mr-2">
                  {card.title}
                </CardTitle>
                <span className={`text-2xl font-bold ${card.colorClass}`}>
                  <AnimatedCounter value={card.value} duration={1500} />
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex justify-between items-end">
              <p className="text-xs text-muted-foreground">{card.subText}</p>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/30 group-hover:text-primary transition-colors">
                View Detail
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeDetail && (
        <CalculationBreakdown 
          type={activeDetail} 
          inputs={inputs} 
          results={{ totalContributions, totalGain, finalAmount }} 
          onClose={() => setActiveDetail(null)} 
        />
      )}
    </>
  );
}
