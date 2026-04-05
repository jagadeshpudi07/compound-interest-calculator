'use client';

import { useEffect } from 'react';
import { X, Info, TrendingUp, Wallet, Landmark } from 'lucide-react';

export function CalculationBreakdown({ type, inputs, results, onClose }) {
  if (!inputs) return null;

  const { initialAmount, monthlyContribution, annualRate, years } = inputs;
  const { totalContributions, totalGain, finalAmount } = results;

  const getDetails = () => {
    switch (type) {
      case 'contributions':
        return {
          title: 'Total Contributions',
          icon: <Wallet className="w-10 h-10 text-primary" />,
          color: 'primary',
          formula: 'Initial Amount + (Monthly Contribution × Months)',
          steps: [
            { label: 'Initial Investment', value: `₹${Math.round(initialAmount).toLocaleString()}` },
            { label: 'Monthly Investment', value: `₹${Math.round(monthlyContribution).toLocaleString()}` },
            { label: 'Duration', value: `${years} Years (${years * 12} Months)` },
            { 
              label: 'Calculation', 
              value: `${Math.round(initialAmount).toLocaleString()} + (${Math.round(monthlyContribution).toLocaleString()} × ${years * 12})` 
            },
            { label: 'Total Invested', value: `₹${Math.round(totalContributions).toLocaleString()}`, highlight: true }
          ]
        };
      case 'gain':
        return {
          title: 'Total Gain',
          icon: <TrendingUp className="w-10 h-10 text-accent" />,
          color: 'accent',
          formula: 'Final Balance - Total Contributions',
          steps: [
            { label: 'Final Portfolio Value', value: `₹${Math.round(finalAmount).toLocaleString()}` },
            { label: 'Total Amount Invested', value: `₹${Math.round(totalContributions).toLocaleString()}` },
            { 
              label: 'Calculation', 
              value: `₹${Math.round(finalAmount).toLocaleString()} - ₹${Math.round(totalContributions).toLocaleString()}` 
            },
            { label: 'Profit Earned', value: `₹${Math.round(totalGain).toLocaleString()}`, highlight: true }
          ]
        };
      case 'amount':
        return {
          title: 'Final Amount',
          icon: <Landmark className="w-10 h-10 text-primary" />,
          color: 'primary',
          formula: 'Compound Interest Formula',
          description: 'Your wealth grows through the power of compounding—where you earn interest on your interest.',
          steps: [
            { label: 'Principal (P)', value: `₹${Math.round(initialAmount).toLocaleString()}` },
            { label: 'Interest Rate (r)', value: `${annualRate}% annually` },
            { label: 'Monthly Contribution (PMT)', value: `₹${Math.round(monthlyContribution).toLocaleString()}` },
            { label: 'Time (t)', value: `${years} Years` },
            { label: 'Total Interest Accrued', value: `₹${Math.round(totalGain).toLocaleString()}`, highlight: true }
          ]
        };
      default:
        return null;
    }
  };

  // Lock body scroll when breakdown is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const details = getDetails();
  if (!details) return null;

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto">
      {/* Backdrop with Blur - truly covering the full screen regardless of content height */}
      <div 
        className="fixed inset-0 bg-background/40 backdrop-blur-xl transition-opacity animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Scrollable Container to center the card */}
      <div className="flex min-h-screen items-center justify-center p-4 pointer-events-none">
        {/* Detail Card - Glassmorphism */}
        <div className="relative w-full max-w-lg bg-card/60 backdrop-blur-2xl border border-border/50 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 slide-in-from-bottom-10 duration-300 overflow-hidden pointer-events-auto">
          {/* Glow effect */}
          <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 
            ${details.color === 'accent' ? 'bg-accent' : 'bg-primary'}`} 
          />
          
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl bg-background/50 border border-border/50 shadow-inner`}>
                {details.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">{details.title}</h3>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Breakdown</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors cursor-pointer relative z-50"
              aria-label="Close detail"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Formula Used</p>
              <p className="text-sm font-bold tracking-wide italic">{details.formula}</p>
            </div>

            {details.description && (
              <p className="text-sm text-balance text-muted-foreground">
                {details.description}
              </p>
            )}

            <div className="space-y-4">
              {details.steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`flex justify-between items-center py-3 border-b border-border/50 last:border-0 ${step.highlight ? 'mt-4 pt-4 border-t-2 border-primary/20' : ''}`}
                >
                  <span className={`text-sm ${step.highlight ? 'font-bold' : 'text-muted-foreground font-medium'}`}>
                    {step.label}
                  </span>
                  <span className={`text-sm ${step.highlight ? 'text-lg font-black text-foreground' : 'font-semibold'}`}>
                    {step.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="w-full mt-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg active:scale-[0.98]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
