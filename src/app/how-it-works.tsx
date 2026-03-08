'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Radio, Play, GitBranch } from 'lucide-react';

// ---------------------------------------------------------------------------
// Mini visualizations for each step
// ---------------------------------------------------------------------------

function CaptureVisualization() {
  return (
    <div className="relative flex h-32 w-full items-center justify-center">
      {/* Central capture point */}
      <motion.div
        className="absolute z-10 h-5 w-5 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary)/0.6)]"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Flowing dots */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = i * 60 * (Math.PI / 180);
        const radius = 52;
        const startX = Math.cos(angle) * radius;
        const startY = Math.sin(angle) * radius;
        return (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-primary/70"
            initial={{ x: startX, y: startY, opacity: 0 }}
            animate={{
              x: [startX, startX * 0.3, 0],
              y: [startY, startY * 0.3, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.33,
              ease: 'easeInOut',
            }}
          />
        );
      })}

      {/* Outer ring pulse */}
      <motion.div
        className="absolute h-24 w-24 rounded-full border border-primary/20"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function ReplayVisualization() {
  return (
    <div className="relative flex h-32 w-full flex-col items-center justify-center gap-3">
      {/* Mini timeline track */}
      <div className="relative h-1.5 w-40 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-primary"
          animate={{ width: ['0%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Timeline nodes */}
      <div className="flex w-40 justify-between">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="h-2.5 w-2.5 rounded-full border-2 border-primary/40 bg-background"
            animate={{
              borderColor: [
                'hsl(var(--primary) / 0.4)',
                'hsl(var(--primary) / 1)',
                'hsl(var(--primary) / 0.4)',
              ],
              backgroundColor: [
                'hsl(var(--background))',
                'hsl(var(--primary))',
                'hsl(var(--background))',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Playback indicator */}
      <motion.div
        className="flex items-center gap-1.5 text-xs font-mono text-primary/60"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Play className="h-3 w-3 fill-current" />
        <span>replaying...</span>
      </motion.div>
    </div>
  );
}

function ForkVisualization() {
  return (
    <div className="relative flex h-32 w-full items-center justify-center">
      <svg viewBox="0 0 160 80" className="h-full w-40" fill="none">
        {/* Main branch line */}
        <motion.path
          d="M 10 40 L 80 40"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
        />
        {/* Original path (continues straight) */}
        <motion.path
          d="M 80 40 L 150 40"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 0.8,
            delay: 1,
            repeat: Infinity,
            repeatDelay: 2.2,
          }}
        />
        {/* Forked path (branches up) */}
        <motion.path
          d="M 80 40 C 100 40, 100 15, 150 15"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 0.8,
            delay: 1,
            repeat: Infinity,
            repeatDelay: 2.2,
          }}
        />
        {/* Fork point dot */}
        <motion.circle
          cx="80"
          cy="40"
          r="4"
          fill="hsl(var(--primary))"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{
            duration: 0.4,
            delay: 0.9,
            repeat: Infinity,
            repeatDelay: 2.6,
          }}
        />
        {/* End dot — original */}
        <motion.circle
          cx="150"
          cy="40"
          r="3"
          fill="hsl(var(--muted-foreground))"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1] }}
          transition={{
            duration: 0.3,
            delay: 1.8,
            repeat: Infinity,
            repeatDelay: 2.7,
          }}
        />
        {/* End dot — forked (primary) */}
        <motion.circle
          cx="150"
          cy="15"
          r="3"
          fill="hsl(var(--primary))"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1] }}
          transition={{
            duration: 0.3,
            delay: 1.8,
            repeat: Infinity,
            repeatDelay: 2.7,
          }}
        />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step data
// ---------------------------------------------------------------------------

const steps = [
  {
    number: '01',
    title: 'Capture',
    icon: Radio,
    description:
      'Install the SDK or connect Claude Code hooks. Every agent step — LLM calls, tool uses, decisions — is automatically recorded.',
    visualization: CaptureVisualization,
  },
  {
    number: '02',
    title: 'Replay',
    icon: Play,
    description:
      'Visualize every execution as an interactive timeline. Click any step to inspect inputs, outputs, tokens, and costs. Watch it unfold in real-time.',
    visualization: ReplayVisualization,
  },
  {
    number: '03',
    title: 'Fork & Fix',
    icon: GitBranch,
    description:
      'Found the bug? Fork from that exact step. Change one variable, replay the rest. Compare original vs. fixed side-by-side — at a fraction of the cost.',
    visualization: ForkVisualization,
  },
] as const;

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background py-16 sm:py-24 md:py-32">
      {/* Subtle background grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-mono text-xs font-medium tracking-widest text-primary">
            3 SIMPLE STEPS
          </span>
          <h2 className="mt-6 font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From first install to your first debugged agent — in minutes, not hours.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="relative mt-16 grid gap-8 md:grid-cols-3 lg:mt-20"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Connecting line — desktop only */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[5.5rem] z-0 hidden md:block"
          >
            <div className="mx-auto h-px w-[calc(100%-8rem)] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
          </div>

          {/* Connecting line — mobile only */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-0 block -translate-x-1/2 md:hidden"
          >
            <div className="h-full w-px bg-gradient-to-b from-transparent via-primary/25 to-transparent" />
          </div>

          {steps.map((step) => {
            const Icon = step.icon;
            const Visualization = step.visualization;
            return (
              <motion.div key={step.number} variants={cardVariants} className="group relative z-10">
                <div className="relative h-full overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-primary/30">
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
                  </div>

                  {/* Step number and icon row */}
                  <div className="relative flex items-center justify-between">
                    <span className="font-mono text-4xl font-bold text-primary/15 transition-colors duration-300 group-hover:text-primary/30">
                      {step.number}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="relative mt-4 font-mono text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>

                  {/* Visualization */}
                  <div className="relative mt-6">
                    <Visualization />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
