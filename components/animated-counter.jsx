'use client';

import { useEffect, useState } from 'react';
import { useScrollObserver } from '@/hooks/use-scroll-observer';

export function AnimatedCounter({
  value,
  duration = 1500,
  prefix = '₹',
  suffix = '',
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const { ref, isVisible } = useScrollObserver();

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    let animationFrameId;

    const animate = (currentTime) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(progress * value);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, value, duration]);

  return (
    <div ref={ref}>
      {prefix}
      {displayValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
      {suffix}
    </div>
  );
}
