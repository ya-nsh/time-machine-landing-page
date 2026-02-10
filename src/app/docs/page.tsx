import Link from 'next/link';
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
} from 'lucide-react';

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

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/40 bg-card/80">
      {title && (
        <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">{title}</span>
        </div>
      )}
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-sm leading-relaxed text-foreground/90">{children}</code>
      </pre>
    </div>
  );
}

function WIPBadge() {
  return (
    <span className="ml-2 inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 font-mono text-[10px] text-yellow-500">
      WIP
    </span>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 bg-card/30 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
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
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Title */}
        <div className="mb-16">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-xs text-primary">
            <BookOpen className="mr-2 h-3 w-3" />
            Documentation
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Time Machine SDK
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Observability and debugging for AI agents. Capture every execution step, fork from any
            point, replay with modifications, and compare results visually.
          </p>
        </div>

        {/* Features Grid */}
        <section className="mb-20">
          <h2 className="mb-8 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
            <Zap className="h-6 w-6 text-primary" />
            Features
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <FeatureCard
              icon={GitBranch}
              title="Fork & Replay"
              description="Fork any execution at any step and replay from that point forward. Only the steps after the fork point are re-executed — prior steps are reused."
              details={[
                'Fork from any step in the execution graph',
                'Modify inputs, prompts, or tool configurations',
                'Replay only from the fork point (not from scratch)',
                'Compare original vs forked execution side-by-side',
                'Track cost savings from partial replays',
              ]}
            />

            <FeatureCard
              icon={Layers}
              title="Step-by-Step Tracking"
              description="Every action your agent takes is captured with full context — inputs, outputs, state snapshots, token usage, and cost breakdowns."
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
              description="Run the same prompt through different models simultaneously. See outputs side-by-side with diff highlighting and metrics comparison."
              details={[
                'Dual-pane comparison across 8+ models',
                'Word-level diff highlighting (added/removed)',
                'Token, latency, and cost metrics per model',
                'PDF upload for context-aware comparisons',
              ]}
            />

            <FeatureCard
              icon={MessageSquareText}
              title="Review Queue & Feedback Loop"
              description="Human reviewers mark outputs correct or wrong. Developers get auto-generated debug packages. Replay validates that fixes actually work."
              details={[
                'Pending → Wrong → Resolved workflow',
                'One-click debug package generation',
                'Replay & Validate with automatic pass/fail',
                'Keyboard shortcuts for rapid review (C/W)',
              ]}
            />

            <FeatureCard
              icon={Activity}
              title="Data Drift Detection"
              description="Detect when agent outputs change for the same inputs. Compare executions to identify whether drift comes from data, model, or prompt changes."
              details={[
                'Automatic drift detection across executions',
                'Variable analysis (model, prompt, data, tools)',
                'Visual divergence timeline',
                'Export drift reports for investigation',
              ]}
            />

            <FeatureCard
              icon={Clock}
              title="Execution Timeline"
              description="Gantt chart and trace tree views for understanding execution flow. See timing, dependencies, and bottlenecks at a glance."
              details={[
                'Gantt chart with cascading bars',
                'Collapsible trace tree with type badges',
                'Zoom, pan, and keyboard navigation',
                'Click-to-select synced with detail panel',
              ]}
            />
          </div>
        </section>

        {/* Installation */}
        <section className="mb-20">
          <h2 className="mb-8 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
            <Package className="h-6 w-6 text-primary" />
            Installation
            <WIPBadge />
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 font-mono text-sm font-medium text-muted-foreground">
                TypeScript / Node.js
              </h3>
              <CodeBlock title="terminal">
                {`npm install @timemachine/sdk

# or
yarn add @timemachine/sdk

# or
bun add @timemachine/sdk`}
              </CodeBlock>
            </div>

            <div>
              <h3 className="mb-3 font-mono text-sm font-medium text-muted-foreground">Python</h3>
              <CodeBlock title="terminal">
                {`pip install timemachine-sdk`}
              </CodeBlock>
              <p className="mt-2 font-mono text-xs text-muted-foreground/60">
                Python SDK coming soon
              </p>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-20">
          <h2 className="mb-8 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
            <Code2 className="h-6 w-6 text-primary" />
            Quick Start
            <WIPBadge />
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 font-mono text-sm font-medium text-muted-foreground">
                1. Initialize the client
              </h3>
              <CodeBlock title="agent.ts">
                {`import { TimeMachine } from '@timemachine/sdk';

const tm = new TimeMachine({
  apiKey: process.env.TIMEMACHINE_API_KEY,
  baseUrl: 'https://your-instance.timemachinesdk.dev',
});`}
              </CodeBlock>
            </div>

            <div>
              <h3 className="mb-3 font-mono text-sm font-medium text-muted-foreground">
                2. Capture an execution
              </h3>
              <CodeBlock title="agent.ts">
                {`const execution = await tm.startExecution({
  name: 'customer-support-agent',
  metadata: { userId: 'user_123' },
});

// Record an LLM call
const step = execution.step('llm_call', {
  model: 'gpt-4o',
  prompt: 'Analyze the customer request...',
});

const response = await openai.chat.completions.create({ ... });

await step.complete({
  output: response.choices[0].message,
  tokens: response.usage.total_tokens,
  cost: calculateCost('gpt-4o', response.usage),
});

await execution.complete();`}
              </CodeBlock>
            </div>

            <div>
              <h3 className="mb-3 font-mono text-sm font-medium text-muted-foreground">
                3. LangChain integration
              </h3>
              <CodeBlock title="langchain-agent.ts">
                {`import { createLangChainHandler } from '@timemachine/sdk/langchain';

const handler = createLangChainHandler(tm, {
  executionName: 'research-agent',
});

// Pass as callback to any LangChain agent
const result = await agent.invoke(
  { input: 'Research the latest AI trends' },
  { callbacks: [handler] },
);`}
              </CodeBlock>
            </div>
          </div>
        </section>

        {/* API Reference placeholder */}
        <section className="mb-20">
          <h2 className="mb-8 flex items-center gap-3 font-mono text-2xl font-bold text-foreground">
            <Terminal className="h-6 w-6 text-primary" />
            API Reference
            <WIPBadge />
          </h2>

          <div className="rounded-lg border border-border/40 bg-card/30 p-8 text-center">
            <Terminal className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="font-mono text-sm text-muted-foreground">
              Full API reference documentation is coming soon.
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground/60">
              REST API &middot; TypeScript SDK &middot; Python SDK &middot; LangChain Adapter
            </p>
          </div>
        </section>

        {/* Back to home */}
        <div className="border-t border-border/30 pt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
