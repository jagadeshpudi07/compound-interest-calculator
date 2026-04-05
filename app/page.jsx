'use client';

import { useState, useEffect } from 'react';
import { CalculatorForm } from '@/components/calculator-form';
import { CalculatorResults } from '@/components/calculator-results';
import { InvestmentChart } from '@/components/investment-chart';

const IntroScreen = ({ onComplete }) => {
  const [stage, setStage] = useState(0); // 0=bars, 1=arrow, 2=typing, 3=untyping, 4=fadeout
  const [typedText, setTypedText] = useState('');
  const [barHeights, setBarHeights] = useState([0, 0, 0, 0]);
  const [showArrow, setShowArrow] = useState(false);
  const fullText = "COMPOUND INTEREST CALCULATOR";

  // Bar targets (percentage of max height)
  const targetHeights = [25, 45, 65, 90];

  useEffect(() => {
    // Stage 0: Animate bars one by one
    const barTimers = targetHeights.map((target, i) =>
      setTimeout(() => {
        setBarHeights(prev => {
          const next = [...prev];
          next[i] = target;
          return next;
        });
      }, 200 + i * 300)
    );

    // Stage 1: Show arrow after bars (at ~1.5s)
    const arrowTimer = setTimeout(() => {
      setShowArrow(true);
      setStage(1);
    }, 1600);

    // Stage 2: Start typing (at ~2.2s)
    const typingTimer = setTimeout(() => setStage(2), 2200);

    // Stage 3: Start un-typing (at ~4.5s)
    const untypeTimer = setTimeout(() => setStage(3), 4500);

    return () => {
      barTimers.forEach(clearTimeout);
      clearTimeout(arrowTimer);
      clearTimeout(typingTimer);
      clearTimeout(untypeTimer);
    };
  }, [onComplete]);

  // Forward typing effect
  useEffect(() => {
    if (stage === 2) {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(fullText.slice(0, i + 1));
        i++;
        if (i >= fullText.length) {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // Reverse typing (un-typing) effect
  useEffect(() => {
    if (stage === 3) {
      let len = fullText.length;
      const interval = setInterval(() => {
        len--;
        setTypedText(fullText.slice(0, len));
        if (len <= 0) {
          clearInterval(interval);
          // Stage 4: fade out overlay
          setStage(4);
          setTimeout(() => onComplete(), 1000);
        }
      }, 35);
      return () => clearInterval(interval);
    }
  }, [stage, onComplete]);

  // The bar chart SVG dimensions
  const svgW = 260;
  const svgH = 180;
  const barW = 30;
  const gap = 14;
  const baseY = svgH - 15; // baseline Y
  const maxBarH = 95;
  const totalBarsW = 4 * barW + 3 * gap;
  const startX = (svgW - totalBarsW) / 2 + 5;

  // How far ABOVE each bar top the arrow peaks should be
  const peakGap = 22;

  // Build zig-zag arrow path:
  // Line starts bottom-left, peaks well ABOVE each bar, dips between bars 
  // (but stays above the next bar's top), then extends upper-right with arrowhead
  const zigZagPoints = [];

  // Start: bottom-left corner, before bar 1
  zigZagPoints.push({ x: startX - 18, y: baseY + 2 });

  targetHeights.forEach((h, i) => {
    const barLeftX = startX + i * (barW + gap);
    const barCenterX = barLeftX + barW / 2;
    const barRightX = barLeftX + barW;
    const barH = (h / 100) * maxBarH;
    const barTopY = baseY - barH;

    // PEAK: clearly above the bar top with visible gap
    zigZagPoints.push({ x: barCenterX, y: barTopY - peakGap });

    // VALLEY: dip down sharply to create a proper V-shaped zig-zag
    if (i < targetHeights.length - 1) {
      const nextBarLeftX = startX + (i + 1) * (barW + gap);
      const gapMidX = (barRightX + nextBarLeftX) / 2;
      
      // Dip to the level of the CURRENT bar's top (the shorter bar)
      // This creates sharp V-shapes because the peak is well above and
      // the valley drops back down near the bar top
      const dipY = barTopY - 5;
      zigZagPoints.push({ x: gapMidX, y: dipY });
    }
  });

  // Extend to arrow tip (upper-right past last bar)
  const lastBarCenterX = startX + 3 * (barW + gap) + barW / 2;
  const lastBarH = (targetHeights[3] / 100) * maxBarH;
  const lastBarTopY = baseY - lastBarH;
  
  const arrowTipX = lastBarCenterX + 30;
  const arrowTipY = lastBarTopY - peakGap - 25;

  // Replace last peak (bar 4) and add arrow tip
  zigZagPoints.pop();
  zigZagPoints.push({ x: lastBarCenterX, y: lastBarTopY - peakGap });
  zigZagPoints.push({ x: arrowTipX, y: arrowTipY });

  // Calculate angle for arrowhead
  const tipPt = zigZagPoints[zigZagPoints.length - 1];
  const beforeTipPt = zigZagPoints[zigZagPoints.length - 2];
  const arrowAngle = Math.atan2(tipPt.y - beforeTipPt.y, tipPt.x - beforeTipPt.x);

  // Build arrowhead triangle at the tip
  const headLen = 16;
  const headW = 9;
  const ax = tipPt.x + Math.cos(arrowAngle) * 3; // tip of arrowhead (slightly past line end)
  const ay = tipPt.y + Math.sin(arrowAngle) * 3;
  const bx = tipPt.x - Math.cos(arrowAngle) * headLen + Math.sin(arrowAngle) * headW;
  const by = tipPt.y - Math.sin(arrowAngle) * headLen - Math.cos(arrowAngle) * headW;
  const cx = tipPt.x - Math.cos(arrowAngle) * headLen - Math.sin(arrowAngle) * headW;
  const cy = tipPt.y - Math.sin(arrowAngle) * headLen + Math.cos(arrowAngle) * headW;

  // Shorten the line path so it ends at the BASE of the arrowhead, not the tip.
  // This prevents the rounded line cap from poking out behind the triangle.
  const shortenBy = headLen - 2; // pull back the line endpoint
  const lastIdx = zigZagPoints.length - 1;
  const shortenedEndX = zigZagPoints[lastIdx].x - Math.cos(arrowAngle) * shortenBy;
  const shortenedEndY = zigZagPoints[lastIdx].y - Math.sin(arrowAngle) * shortenBy;
  const linePoints = [...zigZagPoints];
  linePoints[lastIdx] = { x: shortenedEndX, y: shortenedEndY };

  const arrowLinePath = `M${linePoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L')}`;
  const arrowHeadPoints = `${ax.toFixed(1)},${ay.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)} ${cx.toFixed(1)},${cy.toFixed(1)}`;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-1000 ${
        stage === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Bar Chart with Arrow */}
      <div className="mb-8" style={{ width: 350, height: 220 }}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full overflow-visible">
          {/* Baseline */}
          <line
            x1={startX - 18}
            y1={baseY}
            x2={startX + totalBarsW + 18}
            y2={baseY}
            stroke="var(--primary)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Bars rendered FIRST so arrow draws ON TOP */}
          {barHeights.map((h, i) => {
            const barH = (h / 100) * maxBarH;
            const x = startX + i * (barW + gap);
            return (
              <rect
                key={i}
                x={x}
                y={baseY - barH}
                width={barW}
                height={barH}
                rx="2"
                fill="var(--primary)"
                style={{
                  transition: `y 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                }}
              />
            );
          })}

          {/* Zig-zag arrow line ON TOP of bars */}
          {showArrow && (
            <>
              <path
                d={arrowLinePath}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="400"
                strokeDashoffset="0"
                style={{
                  animation: 'drawArrowLine 0.8s ease-out forwards',
                }}
              />
              {/* Arrowhead triangle — properly angled */}
              <polygon
                points={arrowHeadPoints}
                fill="var(--primary)"
                style={{
                  opacity: 0,
                  animation: 'fadeInArrowHead 0.3s ease-out 0.7s forwards',
                }}
              />
            </>
          )}
        </svg>
      </div>

      {/* Typed Title */}
      <div className="h-12 flex items-center justify-center">
        {stage >= 2 && (
          <h1 className="text-xl md:text-3xl font-bold tracking-widest text-primary text-center uppercase">
            {typedText}
            <span className="animate-pulse">|</span>
          </h1>
        )}
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes drawArrowLine {
          from { stroke-dashoffset: 400; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeInArrowHead {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [results, setResults] = useState(null);

  const calculateCompoundInterest = (inputs) => {
    const { initialAmount, monthlyContribution, annualRate, years } = inputs;

    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;

    let balance = initialAmount;
    const chartData = [];
    let totalContributions = initialAmount;

    // Calculate for each month but only store yearly data for chart
    for (let month = 1; month <= totalMonths; month++) {
      // Apply monthly interest
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      totalContributions += monthlyContribution;

      // Store data for every 12 months (yearly)
      if (month % 12 === 0) {
        const year = Math.floor(month / 12);
        const growth = Math.max(0, balance - totalContributions);

        chartData.push({
          month,
          year,
          contributions: totalContributions,
          growth,
          total: balance,
        });
      }
    }

    // Ensure we have a final data point
    if (totalMonths % 12 !== 0) {
      const growth = Math.max(0, balance - totalContributions);
      chartData.push({
        month: totalMonths,
        year: years,
        contributions: totalContributions,
        growth,
        total: balance,
      });
    }

    const totalGain = Math.max(0, balance - totalContributions);

    setResults({
      totalContributions,
      totalGain,
      finalAmount: balance,
      chartData,
      inputs,
    });
  };

  // Set initial results on component mount
  useEffect(() => {
    const defaultInputs = {
      initialAmount: 10000,
      monthlyContribution: 500,
      annualRate: 7,
      years: 20,
    };
    calculateCompoundInterest(defaultInputs);
  }, []);

  return (
    <>
      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}
      
      <main className={`min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 transition-opacity duration-1000 ${showIntro ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Compound Interest Calculator
            </h1>
            <p className="text-lg text-muted-foreground">
              Watch your investments grow with the power of compound interest
            </p>
          </div>

          {/* Calculator Section */}
          <div className="mb-12">
            <CalculatorForm onCalculate={calculateCompoundInterest} />
          </div>

          {/* Results Section */}
          {results && (
            <div className="space-y-8">
              <CalculatorResults
                totalContributions={results.totalContributions}
                totalGain={results.totalGain}
                finalAmount={results.finalAmount}
                inputs={results.inputs}
              />

              {/* Chart Section */}
              <InvestmentChart data={results.chartData} />

              {/* Summary Section */}
              <div className="rounded-lg bg-card border border-border p-6 shadow-lg">
                <h2 className="text-xl text-foreground mb-4 font-extrabold">Summary</h2>
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-start">
                      <span className="text-muted-foreground font-semibold">Total Invested:</span>
                      <span className="tracking-normal mx-1.5 font-bold">
                        ₹{results.totalContributions.toLocaleString('en-IN', {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    <div className="flex tracking-normal flex-row items-stretch justify-start">
                      <span className="text-muted-foreground font-semibold">Interest Earned:</span>
                      <span className="text-accent tracking-normal my-0 mx-1.5 font-bold">
                        ₹{results.totalGain.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-start">
                      <span className="text-muted-foreground font-semibold">Final Amount:</span>
                      <span className="text-primary mx-1.5 font-bold">
                        ₹{results.finalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="flex justify-start">
                      <span className="text-muted-foreground font-semibold">Return on Investment:</span>
                      <span className="text-accent mx-1.5 font-bold">
                        {(
                          ((results.finalAmount - results.totalContributions) /
                            results.totalContributions) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
