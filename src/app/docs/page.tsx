'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Highlight, themes } from 'prism-react-renderer';
import {
  GitBranch,
  Layers,
  GitCompareArrows,
  MessageSquareText,
  Activity,
  ArrowLeft,
  Clock,
  Zap,
  Terminal,
  Package,
  Code2,
  BookOpen,
  Wrench,
  DollarSign,
  ChevronRight,
  Copy,
  Check,
  AlertTriangle,
  Server,
  Workflow,
  ShieldCheck,
  Feather,
  TreePine,
  ExternalLink,
  Hash,
  Sun,
  Moon,
  KeyRound,
} from 'lucide-react';
import { DASHBOARD_URL } from '@/lib/constants';

/* ─── Reusable Components ─────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="absolute right-3 top-3 rounded-md border border-border/40 bg-card/80 p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Copy code"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-8 w-8" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-border/40 text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function inferLanguage(title?: string): string {
  if (!title) return 'typescript';
  if (title.endsWith('.ts') || title.endsWith('.tsx')) return 'typescript';
  if (title.endsWith('.js') || title.endsWith('.jsx')) return 'javascript';
  if (title.endsWith('.json')) return 'json';
  if (title === 'terminal' || title === 'bash' || title === 'shell') return 'bash';
  return 'typescript';
}

function CodeBlock({ children, title, language }: { children: string; title?: string; language?: string }) {
  const lang = language || inferLanguage(title);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const prismTheme = isDark ? themes.nightOwl : themes.github;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border/40 bg-gray-50 dark:bg-[#0d1117]">
      {title && (
        <div className="flex items-center gap-2 border-b border-border/40 bg-gray-100 px-4 py-2 dark:bg-[#161b22]">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">{title}</span>
        </div>
      )}
      <div className="relative">
        <CopyButton text={children} />
        <Highlight theme={prismTheme} code={children.trim()} language={lang}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre className="overflow-x-auto p-4 pr-12" style={{ background: 'transparent' }}>
              <code className="font-mono text-sm leading-relaxed">
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  details,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  details: string[];
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card/80">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="mb-2 font-mono text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <ul className="space-y-2">
        {details.map((detail, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary/60" />
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ApiTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/40">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/40 bg-card/50">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/20 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 ${j === 0 ? 'font-mono text-primary/90' : 'text-muted-foreground'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionAnchor({ id }: { id: string }) {
  return <div id={id} className="scroll-mt-24" />;
}


/* ─── Sidebar Navigation ──────────────────────────────────────────── */

const NAV_SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Overview', id: 'overview' },
      { label: 'Installation', id: 'installation' },
      { label: 'Get API Key', id: 'get-api-key' },
      { label: 'Quick Start', id: 'quick-start' },
      { label: 'Core Concepts', id: 'concepts' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { label: 'TimeMachine', id: 'api-client' },
      { label: 'Execution', id: 'api-execution' },
      { label: 'StepRecorder', id: 'api-step-recorder' },
      { label: 'Step Types', id: 'api-step-types' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { label: 'LangChain Adapter', id: 'langchain' },
      { label: 'OpenRouter', id: 'openrouter' },
      { label: 'Utilities', id: 'utilities' },
      { label: 'Cost Tracking', id: 'cost-tracking' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { label: 'Manual Recording', id: 'guide-manual' },
      { label: 'Multi-Step Workflows', id: 'guide-multi-step' },
      { label: 'Error Handling', id: 'guide-errors' },
      { label: 'Express / Fastify', id: 'guide-server' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { label: 'Types', id: 'types' },
      { label: 'Supported Models', id: 'models' },
      { label: 'Design Principles', id: 'principles' },
      { label: 'Troubleshooting', id: 'troubleshooting' },
    ],
  },
];

function Sidebar() {
  return (
    <nav className="hidden lg:block">
      <div className="sticky top-24 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <h4 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              {section.title}
            </h4>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block rounded-md px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-card/80 hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

/* ─── Platform Features ───────────────────────────────────────────── */

function FeaturesSection() {
  return (
    <section className="mb-20">
      <SectionAnchor id="features" />
      <h2 className="mb-8 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
        <Zap className="h-6 w-6 text-primary" />
        Platform Features
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <FeatureCard
          icon={GitBranch}
          title="Fork & Replay"
          description="Fork any execution at any step and replay from that point forward. Only the steps after the fork point are re-executed."
          details={[
            'Fork from any step in the execution graph',
            'Modify inputs, prompts, or tool configurations',
            'Replay only from the fork point (not from scratch)',
            'Compare original vs forked execution side-by-side',
          ]}
        />
        <FeatureCard
          icon={Layers}
          title="Step-by-Step Tracking"
          description="Every action your agent takes is captured with full context — inputs, outputs, state snapshots, token usage, and costs."
          details={[
            'LLM calls, tool use, decisions, retrievals',
            'Full state snapshot at each step',
            'Token usage and cost per step',
            'Latency tracking and performance metrics',
          ]}
        />
        <FeatureCard
          icon={GitCompareArrows}
          title="Visual Diff & Model Comparison"
          description="Run the same prompt through different models simultaneously. See outputs side-by-side with diff highlighting."
          details={[
            'Dual-pane comparison across 8+ models',
            'Word-level diff highlighting (added/removed)',
            'Token, latency, and cost metrics per model',
          ]}
        />
        <FeatureCard
          icon={MessageSquareText}
          title="Review Queue"
          description="Human-in-the-loop feedback workflow. Reviewers mark outputs as correct or wrong, developers get debug packages."
          details={[
            'Three-phase workflow: Pending → Wrong → Resolved',
            'One-click debug package generation',
            'Batch replay & validate',
          ]}
        />
        <FeatureCard
          icon={Activity}
          title="Data Drift Detection"
          description="Detect when agent outputs change for the same inputs over time. Variable analysis pinpoints root causes."
          details={[
            'Auto-detect output drift across executions',
            'Variable-by-variable root cause analysis',
            'Visual divergence timeline',
          ]}
        />
        <FeatureCard
          icon={Clock}
          title="Execution Timeline"
          description="Interactive Gantt chart visualization. Spot bottlenecks instantly with cascading bars color-coded by step type."
          details={[
            'Cascading Gantt bars by type (LLM, tool, decision)',
            'Collapsible trace tree with hierarchy',
            'Zoom, pan, and keyboard navigation',
          ]}
        />
      </div>
    </section>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────── */

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-2 font-mono text-sm">
            <span className="text-primary">$</span>
            <span className="text-muted-foreground">timemachine</span>
            <span className="text-primary">docs</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="https://www.npmjs.com/package/@timemachine-sdk/sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md border border-border/40 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <Package className="h-3 w-3" />
              npm
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-12 px-6 py-16">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="min-w-0 max-w-4xl flex-1">
          {/* Hero */}
          <SectionAnchor id="overview" />
          <div className="mb-16">
            <div className="mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-xs text-primary">
              <BookOpen className="mr-2 h-3 w-3" />
              Documentation
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              @timemachine-sdk/sdk
            </h1>
            <p className="mb-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              AI Agent Observability SDK. Capture every execution step, fork from any point,
              replay with modifications, and compare results — with zero impact on your agent&apos;s performance.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#installation" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-mono text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Get Started
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/ya-nsh/time-machine-sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border/40 px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                GitHub
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* ─── Features ──────────────────────────────────── */}
          <FeaturesSection />

          {/* ─── Installation ──────────────────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="installation" />
            <h2 className="mb-8 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <Package className="h-6 w-6 text-primary" />
              Installation
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Requires Node.js 18+ or any modern JavaScript runtime (Bun, Deno).
            </p>
            <div className="space-y-4">
              <CodeBlock title="terminal">{`npm install @timemachine-sdk/sdk`}</CodeBlock>
              <div className="flex flex-wrap gap-4 font-mono text-xs text-muted-foreground">
                <span>yarn add @timemachine-sdk/sdk</span>
                <span className="text-border">|</span>
                <span>bun add @timemachine-sdk/sdk</span>
                <span className="text-border">|</span>
                <span>pnpm add @timemachine-sdk/sdk</span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-3 font-mono text-sm font-medium text-muted-foreground">Sub-path exports</h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Import only what you need to keep your bundle minimal:
              </p>
              <CodeBlock title="imports.ts">{`// Core — client, execution, step recorder, types
import { TimeMachine, Execution, StepRecorder } from '@timemachine-sdk/sdk';

// Adapters — LangChain callback handler
import { TimeMachineCallbackHandler, createLangChainHandler }
  from '@timemachine-sdk/sdk/adapters';

// Utilities — cost calculation, token extraction
import { calculateCost, hasModelPricing, normalizeModelName }
  from '@timemachine-sdk/sdk/utils';`}</CodeBlock>
            </div>
          </section>

          {/* ─── Get Your API Key ─────────────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="get-api-key" />
            <h2 className="mb-8 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <KeyRound className="h-6 w-6 text-primary" />
              Get Your API Key
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Before using the SDK, you need an API key. Follow these steps to get one from the Time Machine dashboard.
            </p>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="rounded-lg border border-border/40 bg-card/50 p-6">
                <h3 className="mb-2 font-mono text-sm font-medium text-foreground">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">1</span>
                  Create an account
                </h3>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                  Sign up for a free Time Machine account. No credit card required.
                </p>
                <a
                  href={`${DASHBOARD_URL}/sign-up`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-mono text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Sign Up
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Step 2 */}
              <div className="rounded-lg border border-border/40 bg-card/50 p-6">
                <h3 className="mb-2 font-mono text-sm font-medium text-foreground">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">2</span>
                  Create a project
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Once logged in, click <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">New Project</span> and
                  give it a name (e.g. &quot;my-agent&quot;). A project groups all your executions together.
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-lg border border-border/40 bg-card/50 p-6">
                <h3 className="mb-2 font-mono text-sm font-medium text-foreground">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">3</span>
                  Copy your API key
                </h3>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                  Your API key is displayed once when the project is created. It starts with{' '}
                  <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">tm_</code>.
                </p>
                <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      The API key is shown <strong>only once</strong>. Copy it immediately and store it somewhere safe.
                      If you lose it, you&apos;ll need to generate a new one from project settings.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="rounded-lg border border-border/40 bg-card/50 p-6">
                <h3 className="mb-3 font-mono text-sm font-medium text-foreground">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">4</span>
                  Set your environment variable
                </h3>
                <CodeBlock title="terminal">{`export TIMEMACHINE_API_KEY=tm_your_key_here`}</CodeBlock>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Or add it to a <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">.env</code> file
                  in your project root:
                </p>
                <CodeBlock title=".env">{`TIMEMACHINE_API_KEY=tm_your_key_here`}</CodeBlock>
              </div>
            </div>
          </section>

          {/* ─── Quick Start ───────────────────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="quick-start" />
            <h2 className="mb-8 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <Code2 className="h-6 w-6 text-primary" />
              Quick Start
            </h2>

            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Don&apos;t have an API key yet?{' '}
              <a href="#get-api-key" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                Get one here
              </a>
              .
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="mb-3 font-mono text-sm font-medium text-foreground">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">1</span>
                  Initialize the client
                </h3>
                <CodeBlock title="agent.ts">{`import { TimeMachine } from '@timemachine-sdk/sdk';

const tm = new TimeMachine({
  apiKey: process.env.TIMEMACHINE_API_KEY!,
  // baseUrl defaults to https://api.timemachine.dev
});`}</CodeBlock>
              </div>

              <div>
                <h3 className="mb-3 font-mono text-sm font-medium text-foreground">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">2</span>
                  Capture an execution
                </h3>
                <CodeBlock title="agent.ts">{`const execution = await tm.startExecution({
  name: 'customer-support-agent',
  metadata: { userId: 'user_123', environment: 'production' },
});

// Record an LLM call step
const step = execution.step('llm_call', {
  model: 'gpt-4o',
  prompt: 'Analyze the customer request...',
});

const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Help me reset my password' }],
});

await step.complete({
  output: { message: response.choices[0].message.content },
  tokensIn: response.usage?.prompt_tokens,
  tokensOut: response.usage?.completion_tokens,
});

// Mark execution as done
await execution.complete();`}</CodeBlock>
              </div>

              <div>
                <h3 className="mb-3 font-mono text-sm font-medium text-foreground">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">3</span>
                  LangChain integration (automatic capture)
                </h3>
                <CodeBlock title="langchain-agent.ts">{`import { TimeMachine } from '@timemachine-sdk/sdk';
import { createLangChainHandler } from '@timemachine-sdk/sdk/adapters';

const tm = new TimeMachine({ apiKey: process.env.TIMEMACHINE_API_KEY! });

const { handler, execution } = await createLangChainHandler(tm, {
  name: 'research-agent',
  metadata: { model: 'gpt-4o' },
});

// Every LLM call, tool use, and decision is captured automatically
const result = await agent.invoke(
  { input: 'Research quantum computing trends' },
  { callbacks: [handler] },
);

await execution.complete();`}</CodeBlock>
              </div>
            </div>
          </section>

          {/* ─── Core Concepts ─────────────────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="concepts" />
            <h2 className="mb-8 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <BookOpen className="h-6 w-6 text-primary" />
              Core Concepts
            </h2>
            <div className="space-y-6">
              <div className="rounded-lg border border-border/40 bg-card/50 p-6">
                <h3 className="mb-2 font-mono text-lg font-semibold text-foreground">Execution</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  An <strong className="text-foreground">execution</strong> represents one complete run of your AI agent — from start to finish.
                  It has a name, optional metadata, and contains a sequence of steps. An execution can be
                  <code className="mx-1 rounded bg-card px-1.5 py-0.5 font-mono text-xs text-primary">running</code>,
                  <code className="mx-1 rounded bg-card px-1.5 py-0.5 font-mono text-xs text-green-400">completed</code>, or
                  <code className="mx-1 rounded bg-card px-1.5 py-0.5 font-mono text-xs text-red-400">failed</code>.
                </p>
              </div>
              <div className="rounded-lg border border-border/40 bg-card/50 p-6">
                <h3 className="mb-2 font-mono text-lg font-semibold text-foreground">Step</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  A <strong className="text-foreground">step</strong> is a single action within an execution. Every LLM call, tool use, decision, or retrieval is a step.
                  Steps capture type, input, output, token counts, cost, latency, tool calls, and optional state snapshots for fork &amp; replay.
                </p>
              </div>
              <div className="rounded-lg border border-border/40 bg-card/50 p-6">
                <h3 className="mb-2 font-mono text-lg font-semibold text-foreground">Fork &amp; Replay</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  The killer feature: <strong className="text-foreground">fork</strong> any execution at any step and <strong className="text-foreground">replay</strong> from
                  that point forward with modifications. Only the steps after the fork point are re-executed — prior steps are reused.
                  This lets you debug agent failures without re-running the entire pipeline.
                </p>
              </div>
            </div>
          </section>

          {/* ─── API Reference: TimeMachine ────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="api-client" />
            <h2 className="mb-2 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <Terminal className="h-6 w-6 text-primary" />
              TimeMachine
            </h2>
            <p className="mb-8 text-sm text-muted-foreground">
              The main entry point. Create one instance and reuse it across your application.
            </p>

            <h3 className="mb-4 font-mono text-lg font-semibold text-foreground">Constructor</h3>
            <CodeBlock title="initialization">{`const tm = new TimeMachine({
  apiKey: 'tm_...',          // required
  baseUrl: 'https://...',   // default: https://api.timemachine.dev
  maxRetries: 3,             // default: 3 (exponential backoff)
  debug: false,              // default: false
});`}</CodeBlock>

            <div className="mt-6">
              <ApiTable
                headers={['Parameter', 'Type', 'Default', 'Description']}
                rows={[
                  ['apiKey', 'string', 'required', 'Your API key (format: tm_...)'],
                  ['baseUrl', 'string', 'https://api.timemachine.dev', 'API endpoint URL'],
                  ['maxRetries', 'number', '3', 'Retries with exponential backoff'],
                  ['debug', 'boolean', 'false', 'Log SDK activity to console'],
                ]}
              />
            </div>

            <h3 className="mb-4 mt-10 font-mono text-lg font-semibold text-foreground">
              tm.startExecution(options?)
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Creates a new execution and returns an <code className="rounded bg-card px-1.5 py-0.5 font-mono text-xs text-primary">Execution</code> instance.
            </p>
            <CodeBlock>{`const execution = await tm.startExecution({
  name: 'my-agent-run',
  metadata: { model: 'gpt-4o', version: '1.2.0' },
});`}</CodeBlock>
            <div className="mt-4">
              <ApiTable
                headers={['Parameter', 'Type', 'Description']}
                rows={[
                  ['name', 'string', 'Human-readable name for the execution'],
                  ['metadata', 'Record<string, unknown>', 'Arbitrary key-value data attached to the execution'],
                ]}
              />
            </div>
          </section>

          {/* ─── API Reference: Execution ──────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="api-execution" />
            <h2 className="mb-2 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <Workflow className="h-6 w-6 text-primary" />
              Execution
            </h2>
            <p className="mb-8 text-sm text-muted-foreground">
              Represents a running execution. Created via <code className="rounded bg-card px-1.5 py-0.5 font-mono text-xs text-primary">tm.startExecution()</code>.
            </p>

            <h3 className="mb-4 font-mono text-lg font-semibold text-foreground">Properties</h3>
            <ApiTable
              headers={['Property', 'Type', 'Description']}
              rows={[
                ['id', 'string', 'Unique execution ID (read-only)'],
                ['projectId', 'string', 'Project ID from the API (read-only)'],
              ]}
            />

            <h3 className="mb-4 mt-10 font-mono text-lg font-semibold text-foreground">
              execution.step(type, input?)
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Creates a new step recorder. The latency timer starts immediately.
            </p>
            <CodeBlock>{`const step = execution.step('llm_call', {
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello' }],
});`}</CodeBlock>

            <h3 className="mb-4 mt-10 font-mono text-lg font-semibold text-foreground">
              execution.complete()
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Marks the execution as completed. Flushes any pending batched steps before completing.
            </p>
            <CodeBlock>{`await execution.complete();`}</CodeBlock>

            <h3 className="mb-4 mt-10 font-mono text-lg font-semibold text-foreground">
              execution.fail(error)
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Marks the execution as failed with error details. Accepts an <code className="rounded bg-card px-1.5 py-0.5 font-mono text-xs">Error</code> object or a string.
            </p>
            <CodeBlock>{`await execution.fail(new Error('LLM returned invalid JSON'));
// or
await execution.fail('Rate limited by OpenAI');`}</CodeBlock>

            <h3 className="mb-4 mt-10 font-mono text-lg font-semibold text-foreground">
              execution.getStatus()
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Returns the current status.
            </p>
            <CodeBlock>{`const status = execution.getStatus();
// 'running' | 'completed' | 'failed'`}</CodeBlock>
          </section>

          {/* ─── API Reference: StepRecorder ───────────────── */}
          <section className="mb-20">
            <SectionAnchor id="api-step-recorder" />
            <h2 className="mb-2 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <Layers className="h-6 w-6 text-primary" />
              StepRecorder
            </h2>
            <p className="mb-8 text-sm text-muted-foreground">
              Records a single step. Created via <code className="rounded bg-card px-1.5 py-0.5 font-mono text-xs text-primary">execution.step()</code>. Latency is auto-calculated from creation time.
            </p>

            <h3 className="mb-4 font-mono text-lg font-semibold text-foreground">
              step.complete(options?)
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Marks the step as completed with optional output and metrics.
            </p>
            <CodeBlock>{`await step.complete({
  output: { response: 'Here is the answer...' },
  tokensIn: 150,
  tokensOut: 300,
  cost: 0.0045,
  latencyMs: 1200,   // auto-calculated if omitted
  toolCalls: [
    { name: 'web_search', input: { query: 'news' }, output: { results: [...] } }
  ],
  stateSnapshot: {
    agentState: { memory: [...], plan: [...] },
  },
});`}</CodeBlock>

            <div className="mt-6">
              <ApiTable
                headers={['Parameter', 'Type', 'Description']}
                rows={[
                  ['output', 'Record<string, unknown>', 'Output data from this step'],
                  ['stateSnapshot', 'object', 'Agent state snapshot for fork & replay'],
                  ['tokensIn', 'number', 'Number of input tokens'],
                  ['tokensOut', 'number', 'Number of output tokens'],
                  ['cost', 'number', 'Cost in USD'],
                  ['latencyMs', 'number', 'Latency in ms (auto-calculated if omitted)'],
                  ['toolCalls', 'ToolCall[]', 'Tool/function calls made during this step'],
                  ['error', 'StepError', 'Error details (step completes but with error info)'],
                ]}
              />
            </div>

            <h3 className="mb-4 mt-10 font-mono text-lg font-semibold text-foreground">
              step.fail(error)
            </h3>
            <CodeBlock>{`await step.fail(new Error('API timeout'));`}</CodeBlock>

            <h3 className="mb-4 mt-10 font-mono text-lg font-semibold text-foreground">
              step.getStatus() / step.getIndex()
            </h3>
            <CodeBlock>{`step.getStatus(); // 'running' | 'completed' | 'failed'
step.getIndex();  // 0-based index in execution sequence`}</CodeBlock>
          </section>

          {/* ─── Step Types ────────────────────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="api-step-types" />
            <h2 className="mb-2 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <Hash className="h-6 w-6 text-primary" />
              Step Types
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Steps are categorized by type for filtering and analysis in the dashboard.
            </p>
            <ApiTable
              headers={['Type', 'Description', 'Typical Use']}
              rows={[
                ['llm_call', 'LLM or chat model invocation', 'OpenAI, Anthropic, Google API calls'],
                ['tool_use', 'Tool or function call', 'Web search, database queries, API calls'],
                ['decision', 'Agent routing or planning', 'Agent selecting which tool to use'],
                ['retrieval', 'RAG or document retrieval', 'Vector store queries, document fetches'],
                ['human_input', 'Human-in-the-loop interaction', 'Approval prompts, user feedback'],
                ['transform', 'Data transformation', 'Parsing, formatting, summarization'],
                ['custom', 'Anything else', 'Custom logic, business rules'],
              ]}
            />
          </section>

          {/* ─── LangChain Adapter ─────────────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="langchain" />
            <h2 className="mb-2 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <Wrench className="h-6 w-6 text-primary" />
              LangChain Adapter
            </h2>
            <p className="mb-8 text-sm text-muted-foreground">
              Automatically captures all LLM calls, tool invocations, agent decisions, and retrievals — zero manual instrumentation.
            </p>

            <h3 className="mb-4 font-mono text-lg font-semibold text-foreground">
              createLangChainHandler(tm, options?)
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              One-liner to create an execution + callback handler. This is the recommended approach.
            </p>
            <CodeBlock title="langchain.ts">{`import { createLangChainHandler } from '@timemachine-sdk/sdk/adapters';

const { handler, execution } = await createLangChainHandler(tm, {
  name: 'research-agent',
  metadata: { model: 'gpt-4o' },
  debug: false,
  autoCalculateCost: true,
  maxDocumentLength: 500,
});

await agent.invoke(input, { callbacks: [handler] });
await execution.complete();`}</CodeBlock>

            <div className="mt-6">
              <ApiTable
                headers={['Option', 'Type', 'Default', 'Description']}
                rows={[
                  ['name', 'string', '—', 'Execution name'],
                  ['metadata', 'Record<string, unknown>', '—', 'Execution metadata'],
                  ['debug', 'boolean', 'false', 'Log captured events to console'],
                  ['autoCalculateCost', 'boolean', 'true', 'Auto-calculate cost from token counts'],
                  ['maxDocumentLength', 'number', '500', 'Max characters for retrieved documents'],
                ]}
              />
            </div>

            <h3 className="mb-4 mt-10 font-mono text-lg font-semibold text-foreground">
              What gets captured automatically
            </h3>
            <ApiTable
              headers={['LangChain Event', 'Step Type', 'What\'s Recorded']}
              rows={[
                ['LLM / Chat Model call', 'llm_call', 'Model name, messages, tokens, cost, latency'],
                ['Tool invocation', 'tool_use', 'Tool name, input, output, latency'],
                ['Agent action', 'decision', 'Action type, tool selection, input'],
                ['Agent finish', 'decision', 'Final output, return values'],
                ['Retriever call', 'retrieval', 'Query, documents (truncated), doc count'],
              ]}
            />

            <div className="mt-6 rounded-lg border border-blue-500/20 bg-blue-50 p-4 dark:bg-blue-500/5">
              <p className="flex items-start gap-2 text-sm text-blue-600 dark:text-blue-400">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>
                  <strong>Security:</strong> Sensitive parameters (<code className="rounded bg-card px-1 py-0.5 font-mono text-xs">api_key</code>, <code className="rounded bg-card px-1 py-0.5 font-mono text-xs">apiKey</code>, <code className="rounded bg-card px-1 py-0.5 font-mono text-xs">callbacks</code>) are automatically stripped from captured data.
                </span>
              </p>
            </div>
          </section>

          {/* ─── OpenRouter ────────────────────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="openrouter" />
            <h2 className="mb-2 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <Workflow className="h-6 w-6 text-primary" />
              OpenRouter
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenRouter</a> provides a unified API across 200+ models — Anthropic, OpenAI, Google, DeepSeek, Qwen, Llama, and more — through a single endpoint and API key. Time Machine works natively with OpenRouter with zero extra configuration.
            </p>

            <h3 className="mb-4 font-mono text-lg font-semibold text-foreground">Setup</h3>
            <CodeBlock title="openrouter.ts">{`import { TimeMachine } from '@timemachine-sdk/sdk';

const tm = new TimeMachine({
  apiKey: process.env.TIMEMACHINE_API_KEY!,
  // No changes needed — configure OpenRouter in your LLM client directly
});

// Use OpenRouter as your LLM provider
import OpenAI from 'openai';

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://your-app.com',   // optional, for rankings
    'X-Title': 'Your App Name',               // optional
  },
});`}</CodeBlock>

            <h3 className="mb-4 mt-10 font-mono text-lg font-semibold text-foreground">Tracking OpenRouter calls</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Capture any model routed through OpenRouter — the model name is passed through transparently.
            </p>
            <CodeBlock title="openrouter-execution.ts">{`const execution = await tm.startExecution({
  name: 'openrouter-agent',
  metadata: { router: 'openrouter' },
});

const step = execution.step('llm_call', {
  model: 'anthropic/claude-opus-4',   // OpenRouter model ID
  messages: [{ role: 'user', content: 'Explain quantum entanglement' }],
});

const response = await openrouter.chat.completions.create({
  model: 'anthropic/claude-opus-4',
  messages: [{ role: 'user', content: 'Explain quantum entanglement' }],
});

await step.complete({
  output: { message: response.choices[0].message.content },
  tokensIn: response.usage?.prompt_tokens,
  tokensOut: response.usage?.completion_tokens,
});

await execution.complete();`}</CodeBlock>

            <h3 className="mb-4 mt-10 font-mono text-lg font-semibold text-foreground">LangChain + OpenRouter</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              The LangChain adapter works seamlessly — just point your ChatOpenAI instance at OpenRouter.
            </p>
            <CodeBlock title="openrouter-langchain.ts">{`import { ChatOpenAI } from '@langchain/openai';
import { createLangChainHandler } from '@timemachine-sdk/sdk/adapters';

const model = new ChatOpenAI({
  modelName: 'google/gemini-2.5-pro',   // or any OpenRouter model
  openAIApiKey: process.env.OPENROUTER_API_KEY!,
  configuration: {
    baseURL: 'https://openrouter.ai/api/v1',
  },
});

const { handler, execution } = await createLangChainHandler(tm, {
  name: 'gemini-via-openrouter',
});

// All LLM calls automatically captured
const result = await model.invoke('What is the latest news?', {
  callbacks: [handler],
});

await execution.complete();`}</CodeBlock>

            <h3 className="mb-4 mt-10 font-mono text-lg font-semibold text-foreground">Why use OpenRouter with Time Machine</h3>
            <ApiTable
              headers={['Benefit', 'Detail']}
              rows={[
                ['Single API key', 'Access 200+ models — no separate accounts for Anthropic, OpenAI, Google, etc.'],
                ['Model fallback', 'Configure automatic fallback if a model is unavailable or rate-limited'],
                ['Cost optimization', 'Route cheap tasks to smaller models, complex ones to frontier models'],
                ['Unified billing', 'One invoice for all LLM costs across providers'],
                ['Model comparison', 'Easily A/B test models by swapping the model string — Time Machine captures both'],
              ]}
            />

            <div className="mt-6 rounded-lg border border-blue-500/20 bg-blue-50 p-4 dark:bg-blue-500/5">
              <p className="flex items-start gap-2 text-sm text-blue-600 dark:text-blue-400">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>
                  <strong>Tip:</strong> OpenRouter model IDs use the format <code className="rounded bg-card px-1 py-0.5 font-mono text-xs">provider/model-name</code> (e.g. <code className="rounded bg-card px-1 py-0.5 font-mono text-xs">deepseek/deepseek-r1</code>, <code className="rounded bg-card px-1 py-0.5 font-mono text-xs">qwen/qwen3-235b-a22b</code>). Time Machine stores the full model string in your execution trace for accurate attribution.
                </span>
              </p>
            </div>
          </section>

          {/* ─── Utilities ─────────────────────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="utilities" />
            <SectionAnchor id="cost-tracking" />
            <h2 className="mb-2 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <DollarSign className="h-6 w-6 text-primary" />
              Utilities &amp; Cost Tracking
            </h2>
            <p className="mb-8 text-sm text-muted-foreground">
              Built-in pricing for 30+ models. Auto-calculated in the LangChain adapter, or use directly.
            </p>

            <CodeBlock title="cost-tracking.ts">{`import {
  calculateCost,
  hasModelPricing,
  getModelPricing,
  normalizeModelName,
  configureFallbackPricing,
  extractTokensFromLLMResult,
} from '@timemachine-sdk/sdk/utils';

// Calculate cost for known models
const cost = calculateCost('gpt-4o', 1000, 500);
// => 0.00625 (USD)

// Check model pricing availability
hasModelPricing('gpt-4o');          // true
hasModelPricing('my-custom-model'); // false

// Get pricing details
getModelPricing('gpt-4o');
// => { inputPer1k: 0.005, outputPer1k: 0.015 }

// Normalize model names (strips version suffixes)
normalizeModelName('gpt-4-0125-preview');    // 'gpt-4'
normalizeModelName('claude-3-sonnet-20240229'); // 'claude-3-sonnet'

// Configure fallback pricing for unknown models
configureFallbackPricing({
  inputPer1k: 0.002,
  outputPer1k: 0.006,
  enabled: true,
});

// Extract tokens from LLM results (multi-provider)
const { tokensIn, tokensOut } = extractTokensFromLLMResult(llmResult);`}</CodeBlock>
          </section>

          {/* ─── Guide: Manual Recording ──────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="guide-manual" />
            <h2 className="mb-2 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <Code2 className="h-6 w-6 text-primary" />
              Guide: Manual Step Recording
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              For custom agents or frameworks without a built-in adapter.
            </p>
            <CodeBlock title="manual-agent.ts">{`import { TimeMachine } from '@timemachine-sdk/sdk';

const tm = new TimeMachine({ apiKey: process.env.TIMEMACHINE_API_KEY! });

async function runAgent(query: string) {
  const execution = await tm.startExecution({
    name: 'research-agent',
    metadata: { query, timestamp: Date.now() },
  });

  try {
    // Step 1: Plan
    const planStep = execution.step('decision', { action: 'plan', query });
    const plan = await generatePlan(query);
    await planStep.complete({ output: { plan } });

    // Step 2: Search
    const searchStep = execution.step('tool_use', {
      tool: 'web_search',
      query: plan.searchQuery,
    });
    const results = await webSearch(plan.searchQuery);
    await searchStep.complete({
      output: { resultCount: results.length, results },
    });

    // Step 3: Synthesize
    const llmStep = execution.step('llm_call', {
      model: 'gpt-4o',
      context: results,
    });
    const answer = await callLLM(query, results);
    await llmStep.complete({
      output: { answer },
      tokensIn: answer.usage.prompt_tokens,
      tokensOut: answer.usage.completion_tokens,
    });

    await execution.complete();
    return answer;
  } catch (error) {
    await execution.fail(error as Error);
    throw error;
  }
}`}</CodeBlock>
          </section>

          {/* ─── Guide: Multi-Step ─────────────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="guide-multi-step" />
            <h2 className="mb-2 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <TreePine className="h-6 w-6 text-primary" />
              Guide: Multi-Step Workflows
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              For agents with sequential or branching logic.
            </p>
            <CodeBlock title="workflow.ts">{`const execution = await tm.startExecution({ name: 'multi-step-workflow' });

// Step 1: Classify the request
const classifyStep = execution.step('llm_call', { action: 'classify' });
const category = await classifyRequest(userInput);
await classifyStep.complete({ output: { category } });

// Step 2: Route based on classification
const routeStep = execution.step('decision', { category });
const handler = selectHandler(category);
await routeStep.complete({ output: { handler: handler.name } });

// Step 3+: Conditional execution
if (category === 'needs_research') {
  const retrieveStep = execution.step('retrieval', { query: userInput });
  const docs = await vectorStore.similaritySearch(userInput);
  await retrieveStep.complete({ output: { documentCount: docs.length } });

  const answerStep = execution.step('llm_call', { model: 'gpt-4o', context: docs });
  const answer = await generateAnswer(userInput, docs);
  await answerStep.complete({
    output: { answer },
    tokensIn: 2000,
    tokensOut: 500,
  });
}

await execution.complete();`}</CodeBlock>
          </section>

          {/* ─── Guide: Error Handling ─────────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="guide-errors" />
            <h2 className="mb-2 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <AlertTriangle className="h-6 w-6 text-primary" />
              Guide: Error Handling
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              The SDK is fail-open — it never crashes your app. But you should still record failures for debugging.
            </p>
            <CodeBlock title="error-handling.ts">{`const execution = await tm.startExecution({ name: 'agent-run' });

try {
  const step = execution.step('tool_use', { tool: 'database_query' });
  const result = await queryDatabase(sql);
  await step.complete({ output: { rows: result.length } });

  await execution.complete();
} catch (error) {
  // Records the error in Time Machine for debugging
  await execution.fail(error as Error);
  throw error;
}

// Enable debug mode to see SDK activity in your console
const tm = new TimeMachine({
  apiKey: process.env.TIMEMACHINE_API_KEY!,
  debug: true,  // Logs all SDK requests and errors
});`}</CodeBlock>
          </section>

          {/* ─── Guide: Express / Fastify ──────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="guide-server" />
            <h2 className="mb-2 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <Server className="h-6 w-6 text-primary" />
              Guide: Express / Fastify
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Wrap your API route handlers with execution tracking.
            </p>
            <CodeBlock title="server.ts">{`import express from 'express';
import { TimeMachine } from '@timemachine-sdk/sdk';

const app = express();
const tm = new TimeMachine({ apiKey: process.env.TIMEMACHINE_API_KEY! });

app.post('/api/chat', async (req, res) => {
  const execution = await tm.startExecution({
    name: 'chat-endpoint',
    metadata: {
      userId: req.body.userId,
      sessionId: req.body.sessionId,
    },
  });

  try {
    const step = execution.step('llm_call', {
      model: 'gpt-4o',
      messages: req.body.messages,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: req.body.messages,
    });

    await step.complete({
      output: { message: response.choices[0].message },
      tokensIn: response.usage?.prompt_tokens,
      tokensOut: response.usage?.completion_tokens,
    });

    await execution.complete();
    res.json({ message: response.choices[0].message.content });
  } catch (error) {
    await execution.fail(error as Error);
    res.status(500).json({ error: 'Internal server error' });
  }
});`}</CodeBlock>
          </section>

          {/* ─── Types Reference ───────────────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="types" />
            <h2 className="mb-2 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <Code2 className="h-6 w-6 text-primary" />
              Types Reference
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Full TypeScript coverage — no <code className="rounded bg-card px-1.5 py-0.5 font-mono text-xs">any</code> types.
            </p>
            <CodeBlock title="types.ts">{`// Client configuration
interface TimeMachineConfig {
  apiKey: string;
  baseUrl?: string;        // default: 'https://api.timemachine.dev'
  maxRetries?: number;     // default: 3
  debug?: boolean;         // default: false
}

// Execution creation
interface CreateExecutionRequest {
  name?: string;
  metadata?: Record<string, unknown>;
}

// Step completion
interface StepCompleteOptions {
  output?: Record<string, unknown>;
  stateSnapshot?: Omit<StateSnapshot, 'stepId' | 'timestamp'>;
  tokensIn?: number;
  tokensOut?: number;
  cost?: number;
  latencyMs?: number;
  toolCalls?: ToolCall[];
  error?: StepError;
}

// Tool call record
interface ToolCall {
  name: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
}

// Error record
interface StepError {
  message: string;
  stack?: string;
}

// Status types
type ExecutionStatus = 'running' | 'completed' | 'failed';
type StepStatus = 'running' | 'completed' | 'failed';
type StepType =
  | 'llm_call' | 'tool_use' | 'decision' | 'retrieval'
  | 'human_input' | 'transform' | 'custom';

// Utility types
interface TokenUsage { tokensIn: number; tokensOut: number; }
interface ModelPricing { inputPer1k: number; outputPer1k: number; }
interface FallbackPricingConfig {
  inputPer1k: number;
  outputPer1k: number;
  enabled: boolean;
}`}</CodeBlock>
          </section>

          {/* ─── Supported Models ──────────────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="models" />
            <h2 className="mb-2 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <DollarSign className="h-6 w-6 text-primary" />
              Supported Models
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Built-in pricing for frontier and open-source models (2025). For unlisted models use <code className="rounded bg-card px-1.5 py-0.5 font-mono text-xs text-primary">configureFallbackPricing()</code>. Prices in USD per 1,000 tokens — approximate and subject to provider changes.
            </p>

            <div className="space-y-8">
              {/* Anthropic */}
              <div>
                <h3 className="mb-1 font-mono text-sm font-semibold text-foreground">Anthropic — Claude 4 series</h3>
                <p className="mb-3 font-mono text-xs text-muted-foreground/70">Current flagship family (2025)</p>
                <ApiTable
                  headers={['Model', 'Input ($/1k)', 'Output ($/1k)', 'Notes']}
                  rows={[
                    ['claude-opus-4-6', '$0.01500', '$0.07500', 'Most powerful, coding & reasoning'],
                    ['claude-sonnet-4-6', '$0.00300', '$0.01500', 'Best balance of speed & quality'],
                    ['claude-haiku-4-5', '$0.00080', '$0.00400', 'Fastest, lowest cost'],
                    ['claude-3.5-sonnet', '$0.00300', '$0.01500', 'Previous gen, still widely used'],
                    ['claude-3.5-haiku', '$0.00080', '$0.00400', 'Previous gen fast model'],
                  ]}
                />
              </div>

              {/* OpenAI */}
              <div>
                <h3 className="mb-1 font-mono text-sm font-semibold text-foreground">OpenAI — GPT-4.x & o-series</h3>
                <p className="mb-3 font-mono text-xs text-muted-foreground/70">Including reasoning models (2025)</p>
                <ApiTable
                  headers={['Model', 'Input ($/1k)', 'Output ($/1k)', 'Notes']}
                  rows={[
                    ['gpt-4.5', '$0.07500', '$0.15000', 'Multimodal frontier, highest quality'],
                    ['gpt-4.1', '$0.00200', '$0.00800', 'Efficient, strong coding'],
                    ['gpt-4o', '$0.00500', '$0.01500', 'Omni model, vision + text'],
                    ['gpt-4o-mini', '$0.00015', '$0.00060', 'Fast & cheap for simple tasks'],
                    ['o3', '$0.01000', '$0.04000', 'Reasoning model, complex problems'],
                    ['o4-mini', '$0.00110', '$0.00440', 'Reasoning, optimized for cost'],
                    ['o1', '$0.01500', '$0.06000', 'Previous reasoning generation'],
                  ]}
                />
              </div>

              {/* Google */}
              <div>
                <h3 className="mb-1 font-mono text-sm font-semibold text-foreground">Google — Gemini 2.5</h3>
                <p className="mb-3 font-mono text-xs text-muted-foreground/70">Long context, multimodal (2025)</p>
                <ApiTable
                  headers={['Model', 'Input ($/1k)', 'Output ($/1k)', 'Notes']}
                  rows={[
                    ['gemini-2.5-pro', '$0.00125', '$0.01000', '1M context, top coding & reasoning'],
                    ['gemini-2.5-flash', '$0.00008', '$0.00030', 'Low latency, best value'],
                    ['gemini-2.0-flash', '$0.00010', '$0.00040', 'Previous gen flash'],
                    ['gemini-1.5-pro', '$0.00125', '$0.00500', 'Legacy, 2M context'],
                  ]}
                />
              </div>

              {/* DeepSeek */}
              <div>
                <h3 className="mb-1 font-mono text-sm font-semibold text-foreground">DeepSeek</h3>
                <p className="mb-3 font-mono text-xs text-muted-foreground/70">Open-source, extremely cost-efficient</p>
                <ApiTable
                  headers={['Model', 'Input ($/1k)', 'Output ($/1k)', 'Notes']}
                  rows={[
                    ['deepseek-r1', '$0.00014', '$0.00219', 'Reasoning model, matches o1 quality'],
                    ['deepseek-v3', '$0.00007', '$0.00110', 'Dense MoE, strong general tasks'],
                    ['deepseek-r1-zero', '$0.00014', '$0.00219', 'RL-trained reasoning, no SFT'],
                  ]}
                />
              </div>

              {/* Qwen */}
              <div>
                <h3 className="mb-1 font-mono text-sm font-semibold text-foreground">Qwen — Alibaba</h3>
                <p className="mb-3 font-mono text-xs text-muted-foreground/70">Strong multilingual & coding</p>
                <ApiTable
                  headers={['Model', 'Input ($/1k)', 'Output ($/1k)', 'Notes']}
                  rows={[
                    ['qwen3-235b-a22b', '$0.00022', '$0.00088', 'Flagship MoE, top open model'],
                    ['qwen3-32b', '$0.00018', '$0.00072', 'Dense, strong reasoning'],
                    ['qwen2.5-72b', '$0.00023', '$0.00069', 'Previous gen, widely deployed'],
                    ['qwen2.5-coder-32b', '$0.00015', '$0.00060', 'Best-in-class code generation'],
                  ]}
                />
              </div>

              {/* Kimi / Moonshot */}
              <div>
                <h3 className="mb-1 font-mono text-sm font-semibold text-foreground">Kimi — Moonshot AI</h3>
                <p className="mb-3 font-mono text-xs text-muted-foreground/70">Long-context specialist (Chinese frontier lab)</p>
                <ApiTable
                  headers={['Model', 'Input ($/1k)', 'Output ($/1k)', 'Notes']}
                  rows={[
                    ['kimi-k2', '$0.00060', '$0.00250', 'Agentic reasoning, 1M context'],
                    ['moonshot-v1-128k', '$0.01200', '$0.01200', 'Ultra long context'],
                    ['moonshot-v1-32k', '$0.00400', '$0.00400', 'Standard context window'],
                  ]}
                />
              </div>

              {/* GLM / Zhipu */}
              <div>
                <h3 className="mb-1 font-mono text-sm font-semibold text-foreground">GLM — Zhipu AI</h3>
                <p className="mb-3 font-mono text-xs text-muted-foreground/70">Chinese lab, strong bilingual performance</p>
                <ApiTable
                  headers={['Model', 'Input ($/1k)', 'Output ($/1k)', 'Notes']}
                  rows={[
                    ['glm-5', '$0.00100', '$0.00300', 'Latest flagship, vision + reasoning'],
                    ['glm-4-plus', '$0.00070', '$0.00140', 'Enhanced GLM-4, long context'],
                    ['glm-4', '$0.00014', '$0.00014', 'Fast, cost-effective baseline'],
                  ]}
                />
              </div>

              {/* Meta Llama */}
              <div>
                <h3 className="mb-1 font-mono text-sm font-semibold text-foreground">Meta — Llama 4</h3>
                <p className="mb-3 font-mono text-xs text-muted-foreground/70">Open weights, free to self-host</p>
                <ApiTable
                  headers={['Model', 'Input ($/1k)', 'Output ($/1k)', 'Notes']}
                  rows={[
                    ['llama-4-maverick', '$0.00019', '$0.00085', '17B MoE, multimodal'],
                    ['llama-4-scout', '$0.00017', '$0.00017', '17B MoE, ultra-efficient'],
                    ['llama-3.3-70b', '$0.00023', '$0.00040', 'Previous gen, solid baseline'],
                  ]}
                />
              </div>

              {/* Mistral */}
              <div>
                <h3 className="mb-1 font-mono text-sm font-semibold text-foreground">Mistral</h3>
                <ApiTable
                  headers={['Model', 'Input ($/1k)', 'Output ($/1k)', 'Notes']}
                  rows={[
                    ['mistral-large-2', '$0.00200', '$0.00600', 'Top Mistral model'],
                    ['mistral-small-3', '$0.00010', '$0.00030', 'Fast, lightweight'],
                    ['codestral', '$0.00030', '$0.00090', 'Code-specialized'],
                  ]}
                />
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-border/40 bg-card/50 p-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Pricing note:</strong> Prices are approximate as of mid-2025 and change frequently. For models not listed, use{' '}
                <code className="rounded bg-card px-1 py-0.5 font-mono text-xs text-primary">configureFallbackPricing()</code> or pass{' '}
                <code className="rounded bg-card px-1 py-0.5 font-mono text-xs text-primary">cost</code> directly in{' '}
                <code className="rounded bg-card px-1 py-0.5 font-mono text-xs text-primary">step.complete()</code>. When using OpenRouter, pass the model string as-is (e.g. <code className="rounded bg-card px-1 py-0.5 font-mono text-xs">deepseek/deepseek-r1</code>) — it will be stored in the execution trace for your records.
              </p>
            </div>
          </section>

          {/* ─── Design Principles ─────────────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="principles" />
            <h2 className="mb-8 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <Feather className="h-6 w-6 text-primary" />
              Design Principles
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: 'Fail-Open',
                  desc: 'Never crashes your application. If the API is unreachable, errors are silently logged and your agent continues.',
                },
                {
                  title: 'Zero Overhead',
                  desc: 'Steps are batched asynchronously (up to 10 per batch, flushed every 500ms) to minimize performance impact.',
                },
                {
                  title: 'Framework Agnostic',
                  desc: 'Manual step recording works with any framework. LangChain adapter provides automatic capture.',
                },
                {
                  title: 'Type Safe',
                  desc: 'Full TypeScript coverage with no any types. Autocomplete and compile-time checks everywhere.',
                },
                {
                  title: 'Tree-Shakeable',
                  desc: 'Sub-path exports (/adapters, /utils) let you import only what you need. Minimal bundle impact.',
                },
                {
                  title: 'Production Ready',
                  desc: 'Exponential backoff retries, automatic batching, sensitive data filtering, and graceful error handling.',
                },
              ].map((p) => (
                <div key={p.title} className="rounded-lg border border-border/40 bg-card/50 p-5">
                  <h3 className="mb-2 font-mono text-sm font-semibold text-foreground">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Troubleshooting ───────────────────────────── */}
          <section className="mb-20">
            <SectionAnchor id="troubleshooting" />
            <h2 className="mb-8 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
              <AlertTriangle className="h-6 w-6 text-primary" />
              Troubleshooting
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Steps are not appearing in the dashboard',
                  a: 'Check your API key. Enable debug mode: new TimeMachine({ apiKey: "...", debug: true }). Make sure you call await execution.complete() — steps are flushed on completion.',
                },
                {
                  q: 'LangChain adapter isn\'t capturing events',
                  a: 'Make sure you pass the handler in the callbacks array: await agent.invoke(input, { callbacks: [handler] }). Without the callbacks option, nothing is captured.',
                },
                {
                  q: 'Cost shows as 0',
                  a: 'The model may not be in the built-in pricing table. Use hasModelPricing() to check. Configure fallback pricing with configureFallbackPricing() or pass cost directly in step.complete().',
                },
                {
                  q: 'TypeScript errors with sub-path imports',
                  a: 'Set moduleResolution to "bundler" or "node16" in your tsconfig.json. This is required for sub-path exports to resolve correctly.',
                },
                {
                  q: '"Cannot find module @timemachine-sdk/sdk"',
                  a: 'Run npm install @timemachine-sdk/sdk. Make sure the package is in your dependencies, not just devDependencies (unless you only need it in dev).',
                },
              ].map((item) => (
                <div key={item.q} className="rounded-lg border border-border/40 bg-card/50 p-5">
                  <h3 className="mb-2 font-mono text-sm font-semibold text-foreground">{item.q}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Footer ────────────────────────────────────── */}
          <div className="border-t border-border/30 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
              <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground/60">
                <a href="https://www.npmjs.com/package/@timemachine-sdk/sdk" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-muted-foreground">
                  npm
                </a>
                <span>&middot;</span>
                <a href="https://github.com/ya-nsh/time-machine-sdk" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-muted-foreground">
                  GitHub
                </a>
                <span>&middot;</span>
                <span>@timemachine-sdk/sdk v0.1.0</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
