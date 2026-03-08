'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { DollarSign, Zap, Activity, Clock } from 'lucide-react';

function useCountUp(end: number, duration: number, isInView: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration, isInView]);

  return count;
}

interface StatItemProps {
  icon: React.ElementType;
  value: string | number;
  numericValue?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  isInView: boolean;
  index: number;
}

function StatItem({
  icon: Icon,
  value,
  numericValue,
  suffix = '',
  prefix = '',
  label,
  isInView,
  index,
}: StatItemProps) {
  const count = useCountUp(numericValue ?? 0, 1.5, isInView);
  const displayValue = numericValue !== undefined ? `${prefix}${count}${suffix}` : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="flex flex-col items-center gap-2 px-6 py-4"
    >
      <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <span className="text-3xl font-bold text-primary md:text-4xl">{displayValue}</span>
      <span className="text-center text-sm text-muted-foreground">{label}</span>
    </motion.div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats: Omit<StatItemProps, 'isInView' | 'index'>[] = [
    {
      icon: DollarSign,
      value: '75%',
      numericValue: 75,
      suffix: '%',
      label: 'Reduced debugging costs',
    },
    {
      icon: Zap,
      value: '85%',
      numericValue: 85,
      suffix: '%',
      label: 'Faster issue resolution',
    },
    {
      icon: Activity,
      value: '11',
      numericValue: 11,
      label: 'Hook events captured',
    },
    {
      icon: Clock,
      value: '< 2 min',
      prefix: '< ',
      numericValue: 2,
      suffix: ' min',
      label: 'Setup time',
    },
  ];

  return (
    <section ref={ref} className="relative border-y border-border/40 bg-card/30 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-0 md:divide-x md:divide-border/40">
          {stats.map((stat, index) => (
            <StatItem key={stat.label} {...stat} isInView={isInView} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
