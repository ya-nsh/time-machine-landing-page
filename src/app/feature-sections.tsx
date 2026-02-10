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
// FORK & REPLAY VISUAL — Animated execution graph with fork
// ============================================================================

function ForkReplayVisual() {
  const [animated, setAnimated] = useState(false);
  const { ref, isInView } = useInView();

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setAnimated(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const nodes = [
    { id: 1, label: 'Start', x: 50, y: 30 },
    { id: 2, label: 'LLM Call', x: 50, y: 80 },
    { id: 3, label: 'Tool Use', x: 50, y: 130 },
    { id: 4, label: 'Decision', x: 50, y: 180 },
    { id: 5, label: 'Output', x: 50, y: 230 },
    // Fork branch
    { id: 6, label: 'Forked', x: 140, y: 180, fork: true },
    { id: 7, label: 'New Output', x: 140, y: 230, fork: true },
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
        <div className="rounded-lg bg-card/90 p-6 backdrop-blur-sm">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">execution_abc123</span>
            </div>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary">
              5 steps
            </span>
          </div>

          {/* Graph */}
          <div className="relative h-[280px]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 280">
              {/* Main path */}
              <path
                d="M 50 45 L 50 230"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                fill="none"
                strokeDasharray="200"
                strokeDashoffset={isInView ? 0 : 200}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
              {/* Fork path */}
              <path
                d="M 50 180 C 70 180, 120 160, 140 180 L 140 230"
                stroke="hsl(25 95% 53%)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="100"
                strokeDashoffset={animated ? 0 : 100}
                style={{ transition: 'stroke-dashoffset 0.8s ease-out 0.5s' }}
              />
            </svg>

            {/* Nodes */}
            {nodes.map((node, i) => (
              <div
                key={node.id}
                className={`absolute flex items-center gap-2 transition-all duration-500 ${
                  node.fork
                    ? animated
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-4'
                    : isInView
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2'
                }`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: 'translate(-50%, -50%)',
                  transitionDelay: node.fork ? '700ms' : `${i * 100}ms`,
                }}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    node.fork
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-border bg-card text-muted-foreground'
                  }`}
                >
                  <span className="font-mono text-[10px]">{node.id}</span>
                </div>
                <span
                  className={`whitespace-nowrap font-mono text-xs ${
                    node.fork ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {node.label}
                </span>
              </div>
            ))}

            {/* Fork button indicator */}
            <div
              className={`absolute transition-all duration-500 ${
                animated ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              style={{ left: '78px', top: '168px', transitionDelay: '400ms' }}
            >
              <div className="flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground shadow-lg">
                <GitBranch className="h-3 w-3" />
                Fork
              </div>
            </div>
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
          <Link href="/sign-up">
            <Button size="lg" className="group px-8">
              <span className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button
              variant="outline"
              size="lg"
              className="border-border/50 bg-transparent backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-primary/5"
            >
              View Documentation
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
        title="Time Travel for AI Debugging"
        description="Fork any execution at any step. Modify the input. Replay from that point forward. No need to re-run the entire agent from scratch."
        capabilities={[
          'Click "Fork from here" on any step in the execution graph',
          'Edit inputs in a real-time validated JSON editor',
          'Watch replay progress with live cost tracking',
          'View execution lineage showing all forked branches',
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
