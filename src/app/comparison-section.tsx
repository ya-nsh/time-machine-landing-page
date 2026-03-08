'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface FeatureRow {
  feature: string;
  others: boolean;
  timeMachine: boolean;
  exclusive?: boolean;
}

const features: FeatureRow[] = [
  { feature: 'Execution logging', others: true, timeMachine: true },
  { feature: 'Step-by-step traces', others: true, timeMachine: true },
  { feature: 'Cost tracking', others: true, timeMachine: true },
  { feature: 'Fork from any step', others: false, timeMachine: true, exclusive: true },
  { feature: 'Replay with modifications', others: false, timeMachine: true, exclusive: true },
  { feature: 'Visual diff comparison', others: false, timeMachine: true, exclusive: true },
  { feature: 'Claude Code integration', others: false, timeMachine: true, exclusive: true },
  { feature: 'Data drift detection', others: false, timeMachine: true, exclusive: true },
];

function StatusIcon({ supported, highlight }: { supported: boolean; highlight?: boolean }) {
  if (supported) {
    return (
      <div
        className={`flex items-center justify-center ${highlight ? 'text-primary' : 'text-green-500'}`}
      >
        <Check className="h-5 w-5" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center text-muted-foreground/40">
      <X className="h-5 w-5" />
    </div>
  );
}

export function ComparisonSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative py-24">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5"
          >
            <span className="font-mono text-xs font-medium tracking-wider text-primary">
              WHY TIME MACHINE
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          >
            Not Just Observability. <span className="text-primary">Debuggability.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mx-auto max-w-xl text-muted-foreground"
          >
            Most tools show you what happened. Time Machine lets you change what happened.
          </motion.p>
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="overflow-hidden rounded-lg border border-border/40 bg-card/50 backdrop-blur-sm"
        >
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_140px_140px] items-center border-b border-border/40 bg-card/80 px-6 py-4 md:grid-cols-[1fr_180px_180px]">
            <span className="text-sm font-medium text-muted-foreground">Feature</span>
            <span className="text-center text-sm font-medium text-muted-foreground">
              Others
              <span className="mt-0.5 block text-xs text-muted-foreground/60">
                LangSmith, Langfuse
              </span>
            </span>
            <span className="text-center text-sm font-bold text-primary">Time Machine</span>
          </div>

          {/* Table Rows */}
          {features.map((row, index) => (
            <motion.div
              key={row.feature}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.35 + index * 0.07 }}
              className={`grid grid-cols-[1fr_140px_140px] items-center border-b border-border/20 px-6 py-3.5 transition-colors md:grid-cols-[1fr_180px_180px] ${
                row.exclusive ? 'bg-primary/[0.03] hover:bg-primary/[0.06]' : 'hover:bg-card/80'
              }`}
            >
              <span
                className={`text-sm ${
                  row.exclusive ? 'font-medium text-foreground' : 'text-muted-foreground'
                }`}
              >
                {row.feature}
                {row.exclusive && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    Exclusive
                  </span>
                )}
              </span>
              <StatusIcon supported={row.others} />
              <StatusIcon supported={row.timeMachine} highlight={row.exclusive} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
