'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Terminal,
  Zap,
  Settings,
  Layers,
  Network,
  DollarSign,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

// ---------- Terminal typing animation ----------

const terminalLines = [
  { text: '$ npx timemachine setup-claude-code', type: 'command' as const, delay: 40 },
  { text: '✓ Detected Claude Code installation', type: 'success' as const, delay: 800 },
  { text: '✓ Installing lifecycle hooks...', type: 'success' as const, delay: 600 },
  { text: '  → SessionStart', type: 'hook' as const, delay: 200 },
  { text: '  → UserPromptSubmit', type: 'hook' as const, delay: 200 },
  { text: '  → PostToolUse', type: 'hook' as const, delay: 200 },
  { text: '  → SubagentStart', type: 'hook' as const, delay: 200 },
  { text: '  → SessionEnd', type: 'hook' as const, delay: 200 },
  { text: '✓ 11 hooks configured', type: 'success' as const, delay: 600 },
  { text: '✓ Ready! Every session will be captured.', type: 'final' as const, delay: 400 },
];

function AnimatedTerminal({ inView }: { inView: boolean }) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typedText, setTypedText] = useState('');
  const [isTypingCommand, setIsTypingCommand] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const hasStarted = useRef(false);

  const runAnimation = () => {
    setVisibleLines(0);
    setTypedText('');
    setIsComplete(false);
    hasStarted.current = false;
    // Trigger re-run
    setTimeout(() => {
      hasStarted.current = true;
      startTyping();
    }, 100);
  };

  const startTyping = () => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    const run = async () => {
      const cmd = terminalLines[0].text;
      setIsTypingCommand(true);
      for (let i = 0; i <= cmd.length; i++) {
        if (cancelled) return;
        setTypedText(cmd.slice(0, i));
        await sleep(terminalLines[0].delay);
      }
      setIsTypingCommand(false);
      setVisibleLines(1);
      await sleep(600);

      for (let i = 1; i < terminalLines.length; i++) {
        if (cancelled) return;
        await sleep(terminalLines[i].delay);
        setVisibleLines(i + 1);
      }
      setIsComplete(true);
    };

    run();
    return () => { cancelled = true; };
  };

  useEffect(() => {
    if (!inView || hasStarted.current) return;
    hasStarted.current = true;
    return startTyping();
  }, [inView]);

  return (
    <div className="relative mx-auto" style={{ width: '672px', maxWidth: '100%' }}>
      {/* Glow behind terminal */}
      <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-2xl" />

      {/* Gradient border */}
      <div
        className="relative rounded-xl p-[1px]"
        style={{
          background:
            'linear-gradient(135deg, hsl(25 95% 53% / 0.6), hsl(25 95% 53% / 0.1) 40%, hsl(25 95% 53% / 0.3))',
        }}
      >
        <div className="rounded-xl bg-card/95 backdrop-blur-sm shadow-2xl overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 border-b border-border/50 bg-card px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-500/70 cursor-pointer transition-all hover:bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/70 cursor-pointer transition-all hover:bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500/70 cursor-pointer transition-all hover:bg-green-500" />
            <span className="ml-4 font-mono text-xs text-muted-foreground">~/my-project</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-[10px] text-green-500/70">claude code</span>
              </div>
              {isComplete && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={runAnimation}
                  className="flex items-center gap-1 rounded-md border border-border/40 bg-card/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
                  title="Replay animation"
                >
                  <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  replay
                </motion.button>
              )}
            </div>
          </div>

          {/* Terminal body */}
          <div className="p-5 font-mono text-sm leading-relaxed h-[300px]">
            {/* Typing command */}
            {visibleLines === 0 && (
              <div>
                <span className="text-muted-foreground">{typedText}</span>
                {isTypingCommand && (
                  <span
                    className="inline-block h-4 w-[8px] bg-primary ml-0.5 align-middle"
                    style={{ animation: 'cursor-blink 0.5s step-end infinite' }}
                  />
                )}
              </div>
            )}

            {/* Revealed lines */}
            {visibleLines >= 1 && (
              <div className="text-muted-foreground">{terminalLines[0].text}</div>
            )}
            {terminalLines.slice(1).map((line, idx) => {
              const lineIndex = idx + 1;
              if (lineIndex >= visibleLines) return null;

              let colorClass = 'text-muted-foreground';
              if (line.type === 'success' || line.type === 'final') {
                colorClass = 'text-green-400';
              } else if (line.type === 'hook') {
                colorClass = 'text-primary/80';
              }

              const isHovered = hoveredLine === lineIndex;

              return (
                <motion.div
                  key={lineIndex}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`${colorClass} cursor-default rounded-sm px-1 -mx-1 transition-colors ${isHovered ? 'bg-primary/5' : ''}`}
                  onMouseEnter={() => setHoveredLine(lineIndex)}
                  onMouseLeave={() => setHoveredLine(null)}
                >
                  {line.text}
                  {isHovered && line.type === 'hook' && (
                    <span className="ml-2 text-[10px] text-muted-foreground/60">
                      lifecycle hook
                    </span>
                  )}
                </motion.div>
              );
            })}

            {/* Final blinking cursor */}
            {visibleLines >= terminalLines.length && (
              <div className="mt-1">
                <span className="text-muted-foreground">$ </span>
                <span
                  className="inline-block h-4 w-[8px] bg-primary"
                  style={{ animation: 'cursor-blink 1s step-end infinite' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Architecture diagram ----------

const archSteps = [
  { label: 'Claude Code', icon: Terminal },
  { label: 'Hooks', icon: Zap },
  { label: 'Time Machine API', icon: Network },
  { label: 'Dashboard', icon: Layers },
];

function ArchitectureDiagram({ inView }: { inView: boolean }) {
  return (
    <div className="mt-16 flex flex-wrap items-center justify-center gap-2 sm:gap-0">
      {archSteps.map((step, i) => {
        const Icon = step.icon;
        return (
          <div key={step.label} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.2 }}
              className="group relative flex flex-col items-center"
            >
              {/* Card glow */}
              <div className="absolute -inset-1 rounded-xl bg-primary/0 transition-all duration-500 group-hover:bg-primary/5 group-hover:blur-md" />
              <div className="relative flex flex-col items-center gap-2 rounded-xl border border-border/40 bg-card/60 px-4 py-3 sm:px-5 sm:py-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                <Icon className="h-5 w-5 text-primary" />
                <span className="font-mono text-[11px] sm:text-xs text-muted-foreground whitespace-nowrap">
                  {step.label}
                </span>
              </div>
            </motion.div>

            {/* Arrow connector */}
            {i < archSteps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={inView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ duration: 0.4, delay: 1.0 + i * 0.2 }}
                className="mx-1 sm:mx-3 flex items-center origin-left"
              >
                <div className="h-[1px] w-4 sm:w-8 bg-gradient-to-r from-primary/60 to-primary/20" />
                <ArrowRight className="h-3.5 w-3.5 -ml-1 text-primary/50" />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------- Feature cards ----------

const features = [
  {
    icon: Settings,
    title: 'Zero-config setup',
    description: 'One command installs hooks into Claude Code',
  },
  {
    icon: CheckCircle2,
    title: 'Full session capture',
    description: 'Prompts, tool calls, file edits, errors',
  },
  {
    icon: Network,
    title: 'Subagent tracking',
    description: 'See when Claude spawns subagents and what they do',
  },
  {
    icon: DollarSign,
    title: 'Cost visibility',
    description: 'Token counts and costs per session, per step',
  },
];

function FeatureCards({ inView }: { inView: boolean }) {
  return (
    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
      {features.map((feat, i) => {
        const Icon = feat.icon;
        return (
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
            className="group relative rounded-xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/60 hover:shadow-lg hover:shadow-primary/5"
          >
            {/* Subtle corner glow on hover */}
            <div className="absolute -top-px -left-px h-16 w-16 rounded-tl-xl bg-primary/0 transition-all duration-500 group-hover:bg-primary/10 blur-xl" />

            <div className="relative">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ---------- Main exported section ----------

export function ClaudeCodeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background py-28 sm:py-36">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 20%, hsl(25 95% 53% / 0.08), transparent)',
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse 50% 50% at 80% 80%, hsl(25 95% 53% / 0.06), transparent)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 mx-auto max-w-5xl px-6"
      >
        {/* Badge */}
        <div className="flex justify-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 font-mono text-xs text-primary backdrop-blur-sm">
            <Terminal className="h-3.5 w-3.5" />
            CLAUDE CODE INTEGRATION
          </span>
        </div>

        {/* Title */}
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Every Claude Code Session.{' '}
          <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-text-shimmer">
            Automatically Captured.
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mb-14 max-w-2xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
          Connect Time Machine to Claude Code with a single command. Every prompt, tool call, and
          file edit is recorded&nbsp;&mdash; no code changes needed.
        </p>

        {/* Animated terminal */}
        <AnimatedTerminal inView={isInView} />

        {/* Architecture diagram */}
        <ArchitectureDiagram inView={isInView} />

        {/* Feature cards */}
        <FeatureCards inView={isInView} />
      </motion.div>
    </section>
  );
}
