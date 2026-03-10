'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  FlaskConical,
  CheckCircle2,
  XCircle,
  GitBranch,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Terminal,
  Clock,
  DollarSign,
} from 'lucide-react';

/* ─── Test Case Data for Animation ────────────────────────────────── */

interface TestCase {
  name: string;
  input: string;
  assertions: string[];
  results: ('pass' | 'fail')[];
  score: number;
}

const DEMO_CASES: TestCase[] = [
  {
    name: 'Password Reset',
    input: '"How do I reset my password?"',
    assertions: ['contains("reset link")', 'llm_judge(helpful)', 'latency < 3s'],
    results: ['pass', 'pass', 'pass'],
    score: 1.0,
  },
  {
    name: 'Billing Inquiry',
    input: '"Cancel my subscription"',
    assertions: ['contains("cancel")', 'llm_judge(accurate)', 'cost < $0.02'],
    results: ['pass', 'pass', 'pass'],
    score: 1.0,
  },
  {
    name: 'Complex Query',
    input: '"Explain the pricing tiers"',
    assertions: ['regex(/\\$\\d+/)', 'llm_judge(complete)', 'step_count(≤5)'],
    results: ['pass', 'fail', 'pass'],
    score: 0.67,
  },
  {
    name: 'Edge Case',
    input: '"<script>alert(1)</script>"',
    assertions: ['not_contains("script")', 'json_valid', 'llm_judge(safe)'],
    results: ['pass', 'pass', 'pass'],
    score: 1.0,
  },
];

/* ─── Animated Score Ring ─────────────────────────────────────────── */

function ScoreRing({ score, isActive }: { score: number; isActive: boolean }) {
  const circumference = 2 * Math.PI * 36;
  const filled = circumference * score;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle
          cx="44"
          cy="44"
          r="36"
          fill="none"
          stroke="hsl(var(--border) / 0.3)"
          strokeWidth="4"
        />
        <motion.circle
          cx="44"
          cy="44"
          r="36"
          fill="none"
          stroke={score >= 0.9 ? 'hsl(var(--success))' : score >= 0.7 ? 'hsl(25 95% 53%)' : 'hsl(var(--destructive))'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isActive ? { strokeDashoffset: circumference - filled } : {}}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <motion.span
        className="absolute font-mono text-lg font-bold text-foreground"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        {isActive ? `${Math.round(score * 100)}%` : '—'}
      </motion.span>
    </div>
  );
}

/* ─── Animated Test Case Row ──────────────────────────────────────── */

function TestCaseRow({
  testCase,
  index,
  phase,
}: {
  testCase: TestCase;
  index: number;
  phase: 'waiting' | 'running' | 'done';
}) {
  const baseDelay = index * 0.6;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.12 }}
      className="group relative"
    >
      {/* Case row */}
      <div
        className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all duration-500 ${
          phase === 'done'
            ? testCase.score === 1
              ? 'border-green-500/30 bg-green-500/[0.04]'
              : 'border-orange-500/30 bg-orange-500/[0.04]'
            : phase === 'running'
              ? 'border-primary/30 bg-primary/[0.04]'
              : 'border-border/30 bg-card/50'
        }`}
      >
        {/* Status indicator */}
        <div className="flex-shrink-0">
          {phase === 'done' ? (
            testCase.score === 1 ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: baseDelay + 1.8, stiffness: 300, damping: 15 }}
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: baseDelay + 1.8, stiffness: 300, damping: 15 }}
              >
                <XCircle className="h-4 w-4 text-orange-500" />
              </motion.div>
            )
          ) : phase === 'running' ? (
            <div className="h-4 w-4 rounded-full border-2 border-primary/60 border-t-primary animate-spin" />
          ) : (
            <div className="h-4 w-4 rounded-full border border-border/50" />
          )}
        </div>

        {/* Case name */}
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground/80">
          {testCase.name}
        </span>

        {/* Assertion results */}
        <div className="flex items-center gap-1">
          {testCase.assertions.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                phase === 'done'
                  ? testCase.results[i] === 'pass'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                  : phase === 'running'
                    ? 'bg-primary/40'
                    : 'bg-border/50'
              }`}
              initial={phase === 'done' ? { scale: 0 } : {}}
              animate={phase === 'done' ? { scale: 1 } : {}}
              transition={{ delay: baseDelay + 0.9 + i * 0.2 }}
            />
          ))}
        </div>

        {/* Score */}
        {phase === 'done' && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: baseDelay + 1.5 }}
            className={`font-mono text-xs font-medium ${
              testCase.score === 1 ? 'text-green-500' : 'text-orange-500'
            }`}
          >
            {testCase.score.toFixed(2)}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Live Eval Dashboard Visualization ──────────────────────────── */

function EvalDashboard({ isInView }: { isInView: boolean }) {
  const [phase, setPhase] = useState<'idle' | 'running' | 'scoring' | 'done'>('idle');
  const [activeCase, setActiveCase] = useState(-1);
  const hasRun = useRef(false);

  const runAnimation = useCallback(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Start running after initial reveal
    const t1 = setTimeout(() => setPhase('running'), 800);
    // Animate through cases
    const t2 = setTimeout(() => setActiveCase(0), 1000);
    const t3 = setTimeout(() => setActiveCase(1), 1600);
    const t4 = setTimeout(() => setActiveCase(2), 2200);
    const t5 = setTimeout(() => setActiveCase(3), 2800);
    // Scoring phase
    const t6 = setTimeout(() => {
      setPhase('scoring');
      setActiveCase(4);
    }, 3400);
    // Done
    const t7 = setTimeout(() => setPhase('done'), 4200);

    return () => {
      [t1, t2, t3, t4, t5, t6, t7].forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      return runAnimation();
    }
  }, [isInView, runAnimation]);

  const overallScore =
    DEMO_CASES.reduce((sum, c) => sum + c.score, 0) / DEMO_CASES.length;

  const getCasePhase = (index: number): 'waiting' | 'running' | 'done' => {
    if (phase === 'done' || (phase === 'scoring' && index < activeCase)) return 'done';
    if (index === activeCase) return 'running';
    if (index < activeCase) return 'done';
    return 'waiting';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm"
    >
      {/* Dashboard header */}
      <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            <FlaskConical className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="font-mono text-xs font-medium text-foreground">
            Customer Support Quality
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            className={`h-2 w-2 rounded-full ${
              phase === 'done'
                ? 'bg-green-500'
                : phase === 'running' || phase === 'scoring'
                  ? 'bg-primary'
                  : 'bg-border/60'
            }`}
            animate={
              phase === 'running' || phase === 'scoring'
                ? { opacity: [1, 0.3, 1] }
                : {}
            }
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {phase === 'done'
              ? 'Completed'
              : phase === 'running' || phase === 'scoring'
                ? 'Running...'
                : 'Ready'}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_auto] divide-y md:divide-x md:divide-y-0 divide-border/20">
        {/* Test cases panel */}
        <div className="space-y-1.5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Test Cases ({DEMO_CASES.length})
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/60">
              assertions
            </span>
          </div>
          {DEMO_CASES.map((tc, i) => (
            <TestCaseRow key={tc.name} testCase={tc} index={i} phase={getCasePhase(i)} />
          ))}
        </div>

        {/* Score panel */}
        <div className="flex flex-col items-center justify-center gap-4 p-6 md:w-40">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Suite Score
          </span>
          <ScoreRing score={overallScore} isActive={phase === 'done'} />
          <AnimatePresence>
            {phase === 'done' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1"
              >
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span className="font-mono text-[10px] font-medium text-green-500">
                  PASSED
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer — assertion type badges */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-border/20 px-4 py-2.5">
        {['contains', 'llm_judge', 'regex', 'latency_under', 'cost_under', 'json_valid'].map(
          (type, i) => (
            <motion.span
              key={type}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6 + i * 0.06 }}
              className="rounded bg-card px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground/70 ring-1 ring-border/30"
            >
              {type}
            </motion.span>
          )
        )}
      </div>
    </motion.div>
  );
}

/* ─── CI/CD Pipeline Visualization ───────────────────────────────── */

function CIPipeline({ isInView }: { isInView: boolean }) {
  const steps = [
    { icon: GitBranch, label: 'PR Opened', color: 'text-blue-400' },
    { icon: Terminal, label: 'Run Suite', color: 'text-primary' },
    { icon: FlaskConical, label: 'Score', color: 'text-primary' },
    { icon: Shield, label: 'Gate', color: 'text-green-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ delay: 0.8 }}
      className="flex items-center justify-center gap-0"
    >
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1 + i * 0.2, type: 'spring', stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/40 bg-card/80">
              <step.icon className={`h-4 w-4 ${step.color}`} />
            </div>
            <span className="font-mono text-[9px] text-muted-foreground">{step.label}</span>
          </motion.div>
          {i < steps.length - 1 && (
            <motion.div
              className="mx-1.5 flex items-center"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ delay: 1.1 + i * 0.2, duration: 0.3 }}
              style={{ transformOrigin: 'left' }}
            >
              <ArrowRight className="h-3 w-3 text-primary/40" />
            </motion.div>
          )}
        </div>
      ))}
    </motion.div>
  );
}

/* ─── Main Evals Section ─────────────────────────────────────────── */

export function EvalsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const capabilities = [
    {
      icon: Zap,
      title: '10 Assertion Types',
      desc: 'contains, regex, llm_judge, cost_under, latency_under, json_valid, and more.',
    },
    {
      icon: GitBranch,
      title: 'CI/CD Quality Gates',
      desc: 'Block merges on eval regressions. GitHub Actions integration in 5 minutes.',
    },
    {
      icon: BarChart3,
      title: 'LLM-as-Judge',
      desc: 'Grade subjective output quality with a rubric. Quantify what "good" means.',
    },
    {
      icon: Clock,
      title: 'Cost & Latency Guards',
      desc: 'Assert that every run stays under budget and within latency SLAs.',
    },
    {
      icon: DollarSign,
      title: 'Save from Production',
      desc: 'Click any dashboard execution → "Save as eval case". Real data, zero authoring.',
    },
    {
      icon: Shield,
      title: 'Fork & Replay Powered',
      desc: 'Each eval run replays your agent via fork — same infra, deterministic results.',
    },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden py-20 sm:py-28">
      {/* Background: subtle gradient bloom */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 30% 50%, hsl(25 95% 53% / 0.04) 0%, transparent 70%),
            radial-gradient(ellipse 40% 50% at 80% 60%, hsl(160 60% 45% / 0.03) 0%, transparent 70%)
          `,
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5"
          >
            <FlaskConical className="h-3 w-3 text-primary" />
            <span className="font-mono text-xs font-medium tracking-wider text-primary">
              EVAL PLATFORM
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Ship with Confidence.
            <br />
            <span className="text-primary">Test Every Change.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="max-w-lg text-base text-muted-foreground sm:text-lg"
          >
            Define test suites from real production inputs. Assert on outputs. Gate deployments
            on passing scores. Every eval run is a replay — powered by the same fork &amp;
            replay engine.
          </motion.p>
        </div>

        {/* Two-column: Dashboard + Capabilities */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          {/* Left: Live eval dashboard */}
          <div>
            <EvalDashboard isInView={isInView} />

            {/* CI/CD pipeline below the dashboard */}
            <div className="mt-6">
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.7 }}
                className="mb-4 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60"
              >
                Automated Pipeline
              </motion.p>
              <CIPipeline isInView={isInView} />
            </div>
          </div>

          {/* Right: Capability cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                className="group flex items-start gap-3 rounded-lg border border-border/30 bg-card/40 p-3.5 transition-all duration-300 hover:border-primary/20 hover:bg-card/60"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-primary/8 transition-colors duration-300 group-hover:bg-primary/15">
                  <cap.icon className="h-4 w-4 text-primary/70 transition-colors group-hover:text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="mb-0.5 font-mono text-xs font-medium text-foreground/90">
                    {cap.title}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground/70">
                    {cap.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
