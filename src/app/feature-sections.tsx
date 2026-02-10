'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  GitBranch,
  Layers,
  GitCompareArrows,
  MessageSquareText,
  CheckCircle2,
  ChevronRight,
  Terminal,
  Play,
  ArrowRight,
  Zap,
  Activity,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Hook to detect when element enters viewport
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold: 0.2, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

// Reusable feature capability bullet
function Capability({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
      <span className="text-muted-foreground">{children}</span>
    </div>
  );
}

// Reusable section wrapper with alternating layout
interface FeatureSectionProps {
  badge: string;
  title: string;
  description: string;
  capabilities: string[];
  visual: React.ReactNode;
  reverse?: boolean;
}

function FeatureSection({
  badge,
  title,
  description,
  capabilities,
  visual,
  reverse,
}: FeatureSectionProps) {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className={`relative py-24 transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`grid items-center gap-12 md:grid-cols-2 md:gap-16 ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}
        >
          {/* Text content */}
          <div className="flex flex-col">
            <span className="mb-4 inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-xs text-primary">
              {badge}
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{description}</p>
            <div className="flex flex-col gap-4">
              {capabilities.map((cap, i) => (
                <Capability key={i}>{cap}</Capability>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isInView
                ? 'opacity-100 translate-x-0'
                : `opacity-0 ${reverse ? '-translate-x-8' : 'translate-x-8'}`
            }`}
          >
            {visual}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FORK & REPLAY VISUAL — Rich animated execution timeline with fork
// ============================================================================

// Step icons by type
function StepIcon({ type, className }: { type: string; className?: string }) {
  const baseClass = `h-3.5 w-3.5 ${className || ''}`;
  switch (type) {
    case 'llm':
      return <Zap className={baseClass} />;
    case 'tool':
      return <Terminal className={baseClass} />;
    case 'decision':
      return <GitBranch className={baseClass} />;
    case 'output':
      return <Play className={baseClass} />;
    default:
      return <Layers className={baseClass} />;
  }
}

function ForkReplayVisual() {
  const [phase, setPhase] = useState<'building' | 'forking' | 'replaying' | 'done'>('building');
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [replayProgress, setReplayProgress] = useState(0);
  const { ref, isInView } = useInView();

  const originalSteps = [
    { id: 1, type: 'llm', label: 'LLM Call', detail: 'gpt-4o', meta: '1,234 tok', cost: 0.02 },
    { id: 2, type: 'tool', label: 'Tool: search_db', detail: 'query users', meta: '45ms', cost: 0.00 },
    { id: 3, type: 'decision', label: 'Route Decision', detail: 'confidence: 0.72', meta: 'fork point', cost: 0.01 },
    { id: 4, type: 'llm', label: 'LLM Call', detail: 'generate response', meta: '892 tok', cost: 0.015 },
    { id: 5, type: 'output', label: 'Final Output', detail: 'sent to user', meta: '$0.03', cost: 0.005 },
  ];

  const forkedSteps = [
    { id: 'f3', type: 'decision', label: 'Route Decision', detail: 'confidence: 0.95', meta: 'modified' },
    { id: 'f4', type: 'llm', label: 'LLM Call', detail: 'new prompt', meta: '1,102 tok' },
    { id: 'f5', type: 'output', label: 'New Output', detail: 'improved result', meta: '$0.02' },
  ];

  useEffect(() => {
    if (!isInView) return;

    const stepTimers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i <= originalSteps.length; i++) {
      stepTimers.push(setTimeout(() => setVisibleSteps(i), i * 200));
    }

    stepTimers.push(setTimeout(() => setPhase('forking'), originalSteps.length * 200 + 400));

    stepTimers.push(setTimeout(() => {
      setPhase('replaying');
      setReplayProgress(0);
    }, originalSteps.length * 200 + 1000));

    for (let i = 1; i <= 3; i++) {
      stepTimers.push(setTimeout(() => setReplayProgress(i), originalSteps.length * 200 + 1000 + i * 500));
    }

    stepTimers.push(setTimeout(() => setPhase('done'), originalSteps.length * 200 + 3000));

    return () => stepTimers.forEach(clearTimeout);
  }, [isInView]);

  const forkActive = phase === 'forking' || phase === 'replaying' || phase === 'done';

  return (
    <div ref={ref} className="relative">
      <div
        className="relative rounded-lg p-[1px]"
        style={{
          background:
            'linear-gradient(135deg, hsl(25 95% 53% / 0.4), transparent 50%, hsl(25 95% 53% / 0.2))',
        }}
      >
        <div className="rounded-lg bg-card/90 p-5 backdrop-blur-sm">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">execution_7f3a</span>
            </div>
            <div className="flex items-center gap-2">
              {forkActive && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary transition-all duration-300">
                  forked at step 3
                </span>
              )}
              <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                5 steps
              </span>
            </div>
          </div>

          {/* Two-column layout: original + forked */}
          <div className="grid grid-cols-2 gap-3">
            {/* Original execution column */}
            <div className="space-y-1.5">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                Original
              </div>
              {originalSteps.map((step, i) => {
                const isVisible = i < visibleSteps;
                const isReused = forkActive && i < 2;
                const isDimmed = forkActive && i > 2;
                const isForkPoint = forkActive && i === 2;

                return (
                  <div
                    key={step.id}
                    className={`relative flex items-center gap-2.5 rounded-md border px-2.5 py-2 transition-all duration-400 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    } ${
                      isForkPoint
                        ? 'border-primary/50 bg-primary/5'
                        : isReused
                          ? 'border-green-500/30 bg-green-500/5'
                          : isDimmed
                            ? 'border-border/20 bg-card/30 opacity-40'
                            : 'border-border/40 bg-card/50'
                    }`}
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    {i < originalSteps.length - 1 && (
                      <div
                        className={`absolute -bottom-1.5 left-[17px] h-1.5 w-px ${
                          isDimmed ? 'bg-border/20' : isReused ? 'bg-green-500/30' : 'bg-border/40'
                        }`}
                      />
                    )}

                    <div
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                        isReused
                          ? 'bg-green-500/20 text-green-400'
                          : isForkPoint
                            ? 'bg-primary/20 text-primary'
                            : isDimmed
                              ? 'bg-muted/30 text-muted-foreground/40'
                              : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isReused ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <StepIcon type={step.type} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`truncate font-mono text-[11px] ${
                            isReused ? 'text-green-400' : isForkPoint ? 'text-primary' : isDimmed ? 'text-muted-foreground/40' : 'text-foreground'
                          }`}
                        >
                          {step.label}
                        </span>
                        <span className={`flex-shrink-0 font-mono text-[9px] ${
                          isReused ? 'text-green-400/60' : isDimmed ? 'text-muted-foreground/30' : 'text-muted-foreground/60'
                        }`}>
                          {isReused ? 'reused' : step.meta}
                        </span>
                      </div>
                      <span className={`font-mono text-[9px] ${
                        isReused ? 'text-green-400/50' : isDimmed ? 'text-muted-foreground/30' : 'text-muted-foreground/60'
                      }`}>
                        {isReused ? 'not re-executed' : step.detail}
                      </span>
                    </div>

                    {isForkPoint && (
                      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 translate-x-full">
                        <div className="flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-medium text-primary-foreground shadow-lg shadow-primary/20">
                          <GitBranch className="h-2.5 w-2.5" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Forked execution column */}
            <div className="space-y-1.5">
              <div className={`mb-2 font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${forkActive ? 'text-primary/60' : 'text-transparent'}`}>
                Forked
              </div>

              {/* Reused steps indicator */}
              <div className={`flex items-center gap-2.5 rounded-md border border-dashed px-2.5 py-2 transition-all duration-400 ${forkActive ? 'border-green-500/20 bg-green-500/5 opacity-100' : 'border-transparent opacity-0'}`}>
                <CheckCircle2 className={`h-3.5 w-3.5 transition-colors ${forkActive ? 'text-green-400/60' : 'text-transparent'}`} />
                <span className="font-mono text-[10px] text-green-400/50">steps 1-2 reused instantly</span>
              </div>

              {/* Forked steps */}
              {forkedSteps.map((step, i) => {
                const isVisible = phase === 'replaying' ? replayProgress > i : phase === 'done';

                return (
                  <div
                    key={step.id}
                    className={`relative flex items-center gap-2.5 rounded-md border px-2.5 py-2 transition-all duration-400 ${
                      isVisible
                        ? 'border-primary/40 bg-primary/5 opacity-100 translate-x-0'
                        : 'border-transparent bg-transparent opacity-0 translate-x-3'
                    }`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    {i < forkedSteps.length - 1 && isVisible && (
                      <div className="absolute -bottom-1.5 left-[17px] h-1.5 w-px bg-primary/30" />
                    )}

                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <StepIcon type={step.type} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate font-mono text-[11px] text-primary">
                          {step.label}
                        </span>
                        <span className="flex-shrink-0 font-mono text-[9px] text-primary/50">
                          {step.meta}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-primary/50">
                        {step.detail}
                      </span>
                    </div>

                    {phase === 'replaying' && replayProgress === i + 1 && (
                      <div className="absolute inset-0 rounded-md border border-primary/50" style={{ animation: 'glow-pulse 1s ease-in-out infinite' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Replay progress bar */}
          <div className={`mt-4 transition-all duration-500 ${phase === 'replaying' || phase === 'done' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] text-muted-foreground">
                {phase === 'done' ? 'Replay complete — only 3 of 5 steps re-executed' : 'Replaying from step 3 (skipping steps 1-2)...'}
              </span>
              <span className="font-mono text-[10px] text-primary">
                {Math.min(replayProgress, 3)}/3 steps
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-muted/50">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(Math.min(replayProgress, 3) / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Cost savings callout */}
          <div className={`mt-3 flex items-center justify-between rounded-md border px-3 py-2 transition-all duration-500 ${
            phase === 'done'
              ? 'border-green-500/20 bg-green-500/5 opacity-100 translate-y-0'
              : 'border-transparent bg-transparent opacity-0 translate-y-2'
          }`}>
            <span className="font-mono text-[10px] text-green-400">
              2 steps skipped &middot; 40% faster
            </span>
            <span className="font-mono text-[10px] text-green-400/70">
              $0.02 saved vs full re-run
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STEP TRACKING VISUAL — Expanding step cards
// ============================================================================

function StepTrackingVisual() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const { ref, isInView } = useInView();

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setExpandedStep(1), 800);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const steps = [
    {
      id: 1,
      type: 'LLM Call',
      model: 'gpt-4o',
      tokens: '1,234',
      cost: '$0.02',
      input: 'Analyze user request...',
      output: 'The user wants to...',
    },
    {
      id: 2,
      type: 'Tool Use',
      tool: 'search_db',
      duration: '45ms',
      input: '{ "query": "..." }',
      output: '{ "results": [...] }',
    },
    {
      id: 3,
      type: 'Decision',
      result: 'continue',
      confidence: '0.95',
      input: 'context_state',
      output: 'proceed_with_action',
    },
  ];

  return (
    <div ref={ref} className="relative">
      <div
        className="relative rounded-lg p-[1px]"
        style={{
          background:
            'linear-gradient(135deg, hsl(25 95% 53% / 0.4), transparent 50%, hsl(25 95% 53% / 0.2))',
        }}
      >
        <div className="rounded-lg bg-card/90 p-4 backdrop-blur-sm">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">Execution Steps</span>
            </div>
            <span className="rounded-full bg-success/10 px-2 py-0.5 font-mono text-[10px] text-success">
              completed
            </span>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className={`overflow-hidden rounded-lg border transition-all duration-500 ${
                  expandedStep === step.id
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border/50 bg-card/50 hover:border-border'
                } ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
                onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
              >
                {/* Step header */}
                <div className="flex cursor-pointer items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted font-mono text-xs">
                      {step.id}
                    </span>
                    <span className="font-mono text-sm text-foreground">{step.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {step.model && (
                      <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {step.model}
                      </span>
                    )}
                    {step.tool && (
                      <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {step.tool}
                      </span>
                    )}
                    {step.tokens && (
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {step.tokens} tok
                      </span>
                    )}
                    <ChevronRight
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        expandedStep === step.id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded content */}
                <div
                  className={`grid transition-all duration-300 ${
                    expandedStep === step.id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-border/50 p-3 pt-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground">
                            Input
                          </span>
                          <code className="block rounded bg-muted/50 p-2 font-mono text-xs text-foreground">
                            {step.input}
                          </code>
                        </div>
                        <div>
                          <span className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground">
                            Output
                          </span>
                          <code className="block rounded bg-muted/50 p-2 font-mono text-xs text-foreground">
                            {step.output}
                          </code>
                        </div>
                      </div>
                      {step.cost && (
                        <div className="mt-2 flex items-center gap-4 font-mono text-[10px] text-muted-foreground">
                          <span>Cost: {step.cost}</span>
                          <span>Latency: 320ms</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXECUTION TIMELINE VISUAL — Gantt chart mockup
// ============================================================================

function ExecutionTimelineVisual() {
  const { ref, isInView } = useInView();
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const timelineSteps = [
    { id: 1, label: 'LLM: Analyze', type: 'llm', start: 0, duration: 45, tokens: '1,234', color: 'bg-blue-500' },
    { id: 2, label: 'Tool: search_db', type: 'tool', start: 45, duration: 12, tokens: '—', color: 'bg-green-500' },
    { id: 3, label: 'Tool: fetch_api', type: 'tool', start: 45, duration: 28, tokens: '—', color: 'bg-green-500' },
    { id: 4, label: 'LLM: Synthesize', type: 'llm', start: 73, duration: 62, tokens: '2,891', color: 'bg-blue-500' },
    { id: 5, label: 'Decision: Route', type: 'decision', start: 135, duration: 8, tokens: '—', color: 'bg-yellow-500' },
    { id: 6, label: 'LLM: Generate', type: 'llm', start: 143, duration: 55, tokens: '1,567', color: 'bg-blue-500' },
  ];

  const totalDuration = 200;
  const ticks = [0, 50, 100, 150, 200];

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setSelectedStep(4), 1200);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <div ref={ref} className="relative">
      <div
        className="relative rounded-lg p-[1px]"
        style={{
          background:
            'linear-gradient(135deg, hsl(25 95% 53% / 0.4), transparent 50%, hsl(25 95% 53% / 0.2))',
        }}
      >
        <div className="rounded-lg bg-card/90 p-4 backdrop-blur-sm">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">Execution Timeline</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="rounded-l bg-primary/20 px-2 py-0.5 font-mono text-[10px] text-primary">
                Gantt
              </span>
              <span className="rounded-r bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                Tree
              </span>
            </div>
          </div>

          {/* Time axis */}
          <div className="mb-1 flex items-end pl-[100px]">
            {ticks.map((tick) => (
              <div
                key={tick}
                className="font-mono text-[9px] text-muted-foreground/50"
                style={{ position: 'absolute', left: `calc(100px + ${(tick / totalDuration) * (100 - 25)}%)` }}
              >
                {tick}ms
              </div>
            ))}
          </div>

          {/* Timeline rows */}
          <div className="relative mt-5 space-y-1">
            {/* Grid lines */}
            <div className="pointer-events-none absolute inset-0 pl-[100px]">
              {ticks.map((tick) => (
                <div
                  key={tick}
                  className="absolute top-0 bottom-0 w-px bg-border/20"
                  style={{ left: `${(tick / totalDuration) * 100}%` }}
                />
              ))}
            </div>

            {timelineSteps.map((step, i) => {
              const isSelected = selectedStep === step.id;
              const isHovered = hoveredStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-0 transition-all duration-500 ${
                    isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                  onClick={() => setSelectedStep(step.id)}
                >
                  {/* Label */}
                  <div className={`w-[100px] flex-shrink-0 truncate pr-2 font-mono text-[10px] transition-colors ${
                    isSelected ? 'text-primary' : isHovered ? 'text-foreground' : 'text-muted-foreground/70'
                  }`}>
                    {step.label}
                  </div>

                  {/* Bar area */}
                  <div className="relative h-6 flex-1">
                    <div
                      className={`absolute top-0.5 h-5 rounded-sm transition-all duration-300 ${step.color} ${
                        isSelected ? 'opacity-90 ring-1 ring-primary ring-offset-1 ring-offset-card' : isHovered ? 'opacity-70' : 'opacity-50'
                      }`}
                      style={{
                        left: `${(step.start / totalDuration) * 100}%`,
                        width: `${(step.duration / totalDuration) * 100}%`,
                        minWidth: '8px',
                      }}
                    >
                      {/* Duration label inside bar */}
                      {step.duration > 20 && (
                        <span className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-white/80">
                          {step.duration}ms
                        </span>
                      )}
                    </div>

                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div
                        className="absolute -top-8 z-10 rounded bg-card border border-border/50 px-2 py-1 font-mono text-[9px] text-foreground shadow-lg whitespace-nowrap"
                        style={{ left: `${(step.start / totalDuration) * 100 + (step.duration / totalDuration) * 50}%`, transform: 'translateX(-50%)' }}
                      >
                        {step.duration}ms {step.tokens !== '—' ? `· ${step.tokens} tok` : ''}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected step detail */}
          <div className={`mt-3 rounded-md border px-3 py-2 transition-all duration-300 ${
            selectedStep
              ? 'border-primary/30 bg-primary/5 opacity-100'
              : 'border-transparent opacity-0'
          }`}>
            {selectedStep && (() => {
              const step = timelineSteps.find(s => s.id === selectedStep);
              if (!step) return null;
              return (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-primary">{step.label}</span>
                  <div className="flex items-center gap-3 font-mono text-[9px] text-muted-foreground">
                    <span>{step.duration}ms</span>
                    {step.tokens !== '—' && <span>{step.tokens} tokens</span>}
                    <span className="text-primary/60">{step.type}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center justify-center gap-4 font-mono text-[9px] text-muted-foreground/60">
            <span className="flex items-center gap-1">
              <span className="h-2 w-4 rounded-sm bg-blue-500/50" />
              LLM Call
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-4 rounded-sm bg-green-500/50" />
              Tool Use
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-4 rounded-sm bg-yellow-500/50" />
              Decision
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VISUAL DIFF — Side-by-side comparison mockup
// ============================================================================

function VisualDiffVisual() {
  const { ref, isInView } = useInView();
  const [diffHighlight, setDiffHighlight] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setDiffHighlight(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <div ref={ref} className="relative">
      <div
        className="relative rounded-lg p-[1px]"
        style={{
          background:
            'linear-gradient(135deg, hsl(25 95% 53% / 0.4), transparent 50%, hsl(25 95% 53% / 0.2))',
        }}
      >
        <div className="rounded-lg bg-card/90 p-4 backdrop-blur-sm">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitCompareArrows className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">Model Comparison</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="rounded-l bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                Diff View
              </span>
              <span className="rounded-r bg-primary/20 px-2 py-0.5 font-mono text-[10px] text-primary">
                On
              </span>
            </div>
          </div>

          {/* Comparison panes */}
          <div className="grid grid-cols-2 gap-3">
            {/* Left pane - GPT-4o */}
            <div
              className={`rounded-lg border border-border/50 bg-card/50 transition-all duration-500 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
                <span className="font-mono text-xs text-foreground">GPT-4o</span>
                <span className="font-mono text-[10px] text-muted-foreground">$0.024</span>
              </div>
              <div className="p-3 font-mono text-xs leading-relaxed text-muted-foreground">
                <p>The analysis shows that</p>
                <p
                  className={`transition-all duration-300 ${diffHighlight ? 'bg-red-500/20 text-red-400' : ''}`}
                >
                  revenue increased by 15%
                </p>
                <p>compared to last quarter.</p>
              </div>
              <div className="border-t border-border/50 px-3 py-2">
                <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                  <span>892 tokens</span>
                  <span className="text-border">|</span>
                  <span>1.2s</span>
                </div>
              </div>
            </div>

            {/* Right pane - Claude */}
            <div
              className={`rounded-lg border border-border/50 bg-card/50 transition-all duration-500 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
                <span className="font-mono text-xs text-foreground">Claude 3.5</span>
                <span className="font-mono text-[10px] text-muted-foreground">$0.018</span>
              </div>
              <div className="p-3 font-mono text-xs leading-relaxed text-muted-foreground">
                <p>The analysis shows that</p>
                <p
                  className={`transition-all duration-300 ${diffHighlight ? 'bg-green-500/20 text-green-400' : ''}`}
                >
                  revenue grew by 18%
                </p>
                <p>compared to last quarter.</p>
              </div>
              <div className="border-t border-border/50 px-3 py-2">
                <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                  <span>756 tokens</span>
                  <span className="text-border">|</span>
                  <span>0.9s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Diff legend */}
          <div
            className={`mt-3 flex items-center justify-center gap-4 font-mono text-[10px] transition-all duration-500 ${
              diffHighlight ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500/50" />
              <span className="text-muted-foreground">Removed</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500/50" />
              <span className="text-muted-foreground">Added</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// REVIEW QUEUE VISUAL — Three-tab interface mockup
// ============================================================================

function ReviewQueueVisual() {
  const { ref, isInView } = useInView();
  const [activeTab, setActiveTab] = useState<'pending' | 'wrong' | 'resolved'>('pending');

  useEffect(() => {
    if (isInView) {
      const timers = [
        setTimeout(() => setActiveTab('wrong'), 1500),
        setTimeout(() => setActiveTab('resolved'), 3000),
        setTimeout(() => setActiveTab('pending'), 4500),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isInView]);

  const tabContent = {
    pending: [
      { id: 'exec_001', status: 'awaiting', time: '2m ago' },
      { id: 'exec_002', status: 'awaiting', time: '5m ago' },
    ],
    wrong: [
      { id: 'exec_003', status: 'needs_fix', time: '1h ago', comment: 'Incorrect calculation' },
    ],
    resolved: [{ id: 'exec_004', status: 'fixed', time: '2h ago' }],
  };

  return (
    <div ref={ref} className="relative">
      <div
        className="relative rounded-lg p-[1px]"
        style={{
          background:
            'linear-gradient(135deg, hsl(25 95% 53% / 0.4), transparent 50%, hsl(25 95% 53% / 0.2))',
        }}
      >
        <div className="rounded-lg bg-card/90 p-4 backdrop-blur-sm">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">Review Queue</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <kbd className="rounded border border-border/50 bg-muted/50 px-1.5 py-0.5">C</kbd>
              <span className="text-muted-foreground">correct</span>
              <kbd className="ml-2 rounded border border-border/50 bg-muted/50 px-1.5 py-0.5">
                W
              </kbd>
              <span className="text-muted-foreground">wrong</span>
            </div>
          </div>

          {/* Tabs */}
          <div
            className={`mb-4 flex gap-1 rounded-lg bg-muted/50 p-1 transition-all duration-500 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {(['pending', 'wrong', 'resolved'] as const).map((tab) => (
              <button
                key={tab}
                className={`flex-1 rounded-md px-3 py-1.5 font-mono text-xs transition-all ${
                  activeTab === tab
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span
                  className={`ml-1 rounded-full px-1.5 text-[10px] ${
                    tab === 'pending'
                      ? 'bg-warning/20 text-warning'
                      : tab === 'wrong'
                        ? 'bg-destructive/20 text-destructive'
                        : 'bg-success/20 text-success'
                  }`}
                >
                  {tabContent[tab].length}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-2">
            {tabContent[activeTab].map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-3 transition-all duration-300 ${
                  isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: `${300 + i * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border bg-muted accent-primary"
                    readOnly
                  />
                  <div>
                    <span className="block font-mono text-xs text-foreground">{item.id}</span>
                    {'comment' in item && (
                      <span className="block font-mono text-[10px] text-destructive">
                        {item.comment}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{item.time}</span>
                  {activeTab === 'wrong' && (
                    <button className="flex items-center gap-1 rounded bg-primary/10 px-2 py-1 font-mono text-[10px] text-primary hover:bg-primary/20">
                      <Zap className="h-3 w-3" />
                      Debug
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action bar */}
          {activeTab === 'wrong' && (
            <div
              className={`mt-3 flex justify-end transition-all duration-300 ${
                isInView ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <button className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 font-mono text-xs text-primary-foreground transition-colors hover:bg-primary/90">
                <Play className="h-3 w-3" />
                Replay & Validate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DATA DRIFT VISUAL — Drift detection with variable analysis
// ============================================================================

function DataDriftVisual() {
  const { ref, isInView } = useInView();
  const [phase, setPhase] = useState<'building' | 'comparing' | 'drift' | 'analysis'>('building');

  const steps = [
    { id: 1, label: 'Parse Input', status: 'identical' as const },
    { id: 2, label: 'LLM: Classify', status: 'identical' as const },
    { id: 3, label: 'Tool: fetch_data', status: 'identical' as const },
    { id: 4, label: 'LLM: Synthesize', status: 'diverged' as const },
    { id: 5, label: 'Final Output', status: 'diverged' as const },
  ];

  const variables = [
    { label: 'Model', valueA: 'gpt-4o', valueB: 'gpt-4o', identical: true },
    { label: 'System Prompt', valueA: 'v2.1', valueB: 'v2.1', identical: true },
    { label: 'Retrieved Data', valueA: '3 docs (v1)', valueB: '3 docs (v2)', identical: false },
    { label: 'Output', valueA: '"Revenue up 15%"', valueB: '"Revenue up 22%"', identical: false },
  ];

  useEffect(() => {
    if (!isInView) return;

    const timers = [
      setTimeout(() => setPhase('comparing'), 600),
      setTimeout(() => setPhase('drift'), 1400),
      setTimeout(() => setPhase('analysis'), 2200),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <div ref={ref} className="relative">
      <div
        className="relative rounded-lg p-[1px]"
        style={{
          background:
            'linear-gradient(135deg, hsl(25 95% 53% / 0.4), transparent 50%, hsl(25 95% 53% / 0.2))',
        }}
      >
        <div className="rounded-lg bg-card/90 p-4 backdrop-blur-sm">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">Drift Detection</span>
            </div>
            {(phase === 'drift' || phase === 'analysis') && (
              <div className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 transition-all duration-300" style={{ animation: 'glow-pulse 2s ease-in-out infinite' }}>
                <AlertTriangle className="h-3 w-3 text-red-400" />
                <span className="font-mono text-[10px] font-medium text-red-400">DRIFT DETECTED</span>
              </div>
            )}
          </div>

          {/* Two execution comparison */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Run A header */}
            <div className={`text-center font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
              phase !== 'building' ? 'text-blue-400/70' : 'text-muted-foreground/40'
            }`}>
              Run A — Feb 8
            </div>
            {/* Run B header */}
            <div className={`text-center font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
              phase !== 'building' ? 'text-primary/70' : 'text-muted-foreground/40'
            }`}>
              Run B — Feb 10
            </div>
          </div>

          {/* Step comparison rows */}
          <div className="space-y-1">
            {steps.map((step, i) => {
              const showComparison = phase !== 'building';
              const showDivergence = (phase === 'drift' || phase === 'analysis') && step.status === 'diverged';

              return (
                <div
                  key={step.id}
                  className={`grid grid-cols-2 gap-3 transition-all duration-500 ${
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {/* Run A step */}
                  <div className={`flex items-center gap-2 rounded-md border px-2 py-1.5 transition-all duration-300 ${
                    showDivergence
                      ? 'border-blue-500/30 bg-blue-500/5'
                      : showComparison && step.status === 'identical'
                        ? 'border-green-500/20 bg-green-500/5'
                        : 'border-border/30 bg-card/50'
                  }`}>
                    <span className={`font-mono text-[10px] ${
                      showDivergence ? 'text-blue-400' : showComparison && step.status === 'identical' ? 'text-green-400/70' : 'text-muted-foreground/70'
                    }`}>
                      {step.label}
                    </span>
                  </div>

                  {/* Run B step */}
                  <div className={`flex items-center gap-2 rounded-md border px-2 py-1.5 transition-all duration-300 ${
                    showDivergence
                      ? 'border-primary/30 bg-primary/5'
                      : showComparison && step.status === 'identical'
                        ? 'border-green-500/20 bg-green-500/5'
                        : 'border-border/30 bg-card/50'
                  }`}>
                    <span className={`font-mono text-[10px] ${
                      showDivergence ? 'text-primary' : showComparison && step.status === 'identical' ? 'text-green-400/70' : 'text-muted-foreground/70'
                    }`}>
                      {step.label}
                    </span>
                    {/* Status badge */}
                    {showComparison && (
                      <span className={`ml-auto flex-shrink-0 font-mono text-[8px] ${
                        showDivergence ? 'text-red-400' : 'text-green-400/50'
                      }`}>
                        {showDivergence ? 'changed' : 'match'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Variable analysis panel */}
          <div className={`mt-3 rounded-md border p-3 transition-all duration-500 ${
            phase === 'analysis'
              ? 'border-border/40 bg-card/60 opacity-100 translate-y-0'
              : 'border-transparent bg-transparent opacity-0 translate-y-3'
          }`}>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50">
              Variable Analysis
            </div>
            <div className="space-y-1.5">
              {variables.map((v, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground/70">{v.label}</span>
                  <div className="flex items-center gap-2">
                    {v.identical ? (
                      <span className="flex items-center gap-1 font-mono text-[9px] text-green-400/60">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        identical
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-mono text-[9px] text-red-400">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        changed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Root cause */}
            <div className="mt-3 flex items-center gap-2 rounded bg-red-500/10 px-2.5 py-1.5">
              <Activity className="h-3 w-3 text-red-400" />
              <span className="font-mono text-[10px] text-red-400">
                Root cause: Retrieved data changed between runs
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SECTION DIVIDER
// ============================================================================

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-8">
      <div
        className="h-px w-full max-w-md"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--border) / 0.5), transparent)',
        }}
      />
    </div>
  );
}

// ============================================================================
// FINAL CTA SECTION
// ============================================================================

function CTASection() {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className={`relative py-32 transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        {/* Decorative element */}
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Terminal className="h-8 w-8 text-primary" />
        </div>

        <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Ready to debug smarter?
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-lg text-muted-foreground">
          Stop guessing why your agents fail. Start seeing exactly what happened, step by step.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/docs">
            <Button size="lg" className="group px-8">
              <span className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Free to start
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            TypeScript SDK
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Self-hosted option
          </span>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export function FeatureSections() {
  return (
    <div className="relative bg-background">
      {/* Subtle gradient transition from hero */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background: 'linear-gradient(to bottom, hsl(var(--background)), transparent)',
        }}
      />

      <SectionDivider />

      <FeatureSection
        badge="FORK & REPLAY"
        title="Replay From the Fork Point, Not From Scratch"
        description="Fork any execution at any step. Modify the input. Only the steps after the fork point are re-executed — prior steps are reused instantly. No wasted compute, no waiting for the whole pipeline to run again."
        capabilities={[
          'Fork from any step — prior steps are reused, not re-run',
          'Only replay the steps that actually need to change',
          'Save 40-80% on compute costs with partial replay',
          'Compare original vs forked output side-by-side',
        ]}
        visual={<ForkReplayVisual />}
      />

      <SectionDivider />

      <FeatureSection
        badge="STEP-BY-STEP TRACKING"
        title="Complete Execution Visibility"
        description="Every action your agent takes is captured — inputs, outputs, LLM prompts, tool calls, state snapshots, and cost breakdowns. Nothing hidden."
        capabilities={[
          'Full state snapshot at each execution step',
          'Token usage and cost breakdown per step',
          'Supports LLM calls, tool use, decisions, retrievals',
          'Query all execution data via PostgreSQL',
        ]}
        visual={<StepTrackingVisual />}
        reverse
      />

      <SectionDivider />

      <FeatureSection
        badge="EXECUTION TIMELINE"
        title="See the Full Picture at a Glance"
        description="Gantt chart and trace tree views show timing, dependencies, and bottlenecks across your entire execution. Spot slow steps instantly — find the 200ms tool call hiding behind a 2s LLM call."
        capabilities={[
          'Cascading Gantt bars color-coded by step type',
          'Collapsible trace tree with parent-child hierarchy',
          'Click any bar to inspect step details and metrics',
          'Zoom, pan, and keyboard navigation for large executions',
        ]}
        visual={<ExecutionTimelineVisual />}
      />

      <SectionDivider />

      <FeatureSection
        badge="VISUAL DIFF"
        title="Compare Models Side-by-Side"
        description="Run the same prompt through different models simultaneously. See outputs side-by-side with diff highlighting, metrics comparison, and cost analysis."
        capabilities={[
          'Dual-pane comparison: GPT-4o, Claude, Gemini, and more',
          'Diff view highlights added and removed text',
          'Token usage, latency, and cost metrics per model',
          'Save and export comparison reports',
        ]}
        visual={<VisualDiffVisual />}
        reverse
      />

      <SectionDivider />

      <FeatureSection
        badge="DATA DRIFT DETECTION"
        title="Catch Output Drift Before Users Do"
        description="Automatically detect when agent outputs change for the same inputs. Pinpoint whether drift comes from data, model, or prompt changes — before your users notice."
        capabilities={[
          'Auto-detect output drift across same-name executions',
          'Variable analysis: model, prompt, retrieved data, tools',
          'Visual divergence timeline showing exact drift point',
          'Export drift reports for investigation and resolution',
        ]}
        visual={<DataDriftVisual />}
      />

      <SectionDivider />

      <FeatureSection
        badge="REVIEW QUEUE"
        title="Feedback Loop That Closes"
        description="Human reviewers mark outputs as correct or wrong. Developers get automated debug packages. Replay & Validate confirms fixes actually work."
        capabilities={[
          'Pending → Wrong → Resolved workflow',
          'One-click debug package generation for developers',
          'Replay with automatic validation (pass/fail)',
          'Keyboard shortcuts for rapid review (C/W)',
        ]}
        visual={<ReviewQueueVisual />}
        reverse
      />

      <SectionDivider />

      <CTASection />
    </div>
  );
}
