'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GitBranch,
  Play,
  Layers,
  ChevronRight,
  Clock,
  ExternalLink,
  Sparkles,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DASHBOARD_URL } from '@/lib/constants';
import { HowItWorksModal } from './how-it-works-modal';

// Floating code particles in background
function FloatingParticles() {
  const particles = [
    { text: 'const', x: 10, y: 20, delay: 0 },
    { text: '{ }', x: 85, y: 15, delay: 2 },
    { text: '=>', x: 20, y: 75, delay: 1 },
    { text: 'async', x: 75, y: 80, delay: 3 },
    { text: '[ ]', x: 5, y: 50, delay: 4 },
    { text: 'fn()', x: 90, y: 45, delay: 2.5 },
    { text: '<>', x: 15, y: 35, delay: 1.5 },
    { text: '...', x: 80, y: 65, delay: 3.5 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.text}
          className="absolute font-mono text-xs text-primary/10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `float-particle 20s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.text}
        </span>
      ))}
    </div>
  );
}

// Noise texture overlay for film grain effect
function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.015]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// Mouse-following glow effect
function MouseGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-0 h-96 w-96 rounded-full bg-primary/5 blur-[100px] transition-opacity duration-300"
      style={{
        left: position.x - 192,
        top: position.y - 192,
        opacity: isVisible ? 1 : 0,
      }}
    />
  );
}

// Animated gradient background with floating orbs
function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base radial gradient */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%,
              hsl(25 95% 53% / 0.2) 0%,
              transparent 50%),
            radial-gradient(ellipse 60% 40% at 100% 100%,
              hsl(25 95% 53% / 0.1) 0%,
              transparent 40%)
          `,
        }}
      />

      {/* Animated floating orbs */}
      <div className="absolute -left-32 top-1/4 h-96 w-96 animate-float-orb rounded-full bg-primary/20 blur-[100px]" />
      <div className="absolute -right-32 bottom-1/4 h-80 w-80 animate-float-orb-reverse rounded-full bg-primary/10 blur-[80px]" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-glow-pulse rounded-full bg-primary/10 blur-[60px]" />

      {/* Animated mesh gradient overlay */}
      <div
        className="absolute inset-0 animate-gradient-shift opacity-30"
        style={{
          background: `
            linear-gradient(135deg,
              transparent 0%,
              hsl(25 95% 53% / 0.05) 25%,
              transparent 50%,
              hsl(25 95% 53% / 0.03) 75%,
              transparent 100%)
          `,
          backgroundSize: '400% 400%',
        }}
      />
    </div>
  );
}

// Subtle radial gradient accent
function SubtleAccent() {
  return (
    <>
      {/* Soft top-center glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 50% 30% at 50% 0%, hsl(25 95% 53% / 0.08), transparent)',
        }}
      />
      {/* Very subtle center highlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 40% 40% at 50% 45%, hsl(25 95% 53% / 0.03), transparent)',
        }}
      />
    </>
  );
}

// Terminal-style navigation
function TerminalNav() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2 font-mono text-sm">
        <span className="text-primary">$</span>
        <span className="text-muted-foreground">timemachine</span>
        <span className="text-primary" style={{ animation: 'cursor-blink 1s step-end infinite' }}>
          _
        </span>
      </div>
    </header>
  );
}

// Status badge with ping animation
function StatusBadge() {
  return (
    <div className="mb-6 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 backdrop-blur-sm">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      <span className="font-mono text-xs text-primary">AI Agent Observability</span>
    </div>
  );
}

// Main heading with glitch effect on hover
function HeroHeading() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <h1 className="mb-4 text-center">
      <span
        className="relative block text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl cursor-default"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          animation: isHovered ? 'glitch 0.3s ease-in-out' : 'none',
        }}
      >
        <span className="relative z-10">Time Machine</span>
        {/* Glitch layers */}
        {isHovered && (
          <>
            <span
              className="absolute inset-0 text-primary/50"
              style={{ clipPath: 'inset(40% 0 20% 0)', transform: 'translate(-2px, 0)' }}
            >
              Time Machine
            </span>
            <span
              className="absolute inset-0 text-cyan-500/50"
              style={{ clipPath: 'inset(20% 0 40% 0)', transform: 'translate(2px, 0)' }}
            >
              Time Machine
            </span>
          </>
        )}
      </span>
      <span className="mt-2 block bg-gradient-to-r from-primary via-orange-400 to-primary bg-[length:200%_auto] bg-clip-text text-xl font-medium text-transparent md:text-2xl animate-text-shimmer">
        Debug the past. Fork the future.
      </span>
    </h1>
  );
}

// Subtitle
function HeroSubtitle() {
  return (
    <div className="mb-8 flex flex-col items-center gap-3">
      <p className="max-w-lg text-center font-mono text-sm leading-relaxed text-muted-foreground md:text-base">
        Capture every agent step.{' '}
        <span className="text-foreground">Fork from any point. Replay with one click.</span>
      </p>
      <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 backdrop-blur-sm">
        <TerminalIcon className="h-3.5 w-3.5 text-primary" />
        <span className="font-mono text-xs text-primary">Works with Claude Code — zero config</span>
      </div>
    </div>
  );
}

// CTA buttons
function HeroActions({ onHowItWorks }: { onHowItWorks: () => void }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      <Link href="/docs">
        <Button size="lg" className="group relative overflow-hidden px-8">
          <span className="relative z-10 flex items-center gap-2">
            Get Started
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Button>
      </Link>
      <button onClick={onHowItWorks}>
        <Button
          size="lg"
          variant="outline"
          className="group px-8 border-border/40 hover:border-primary/50"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary transition-transform group-hover:rotate-12" />
            How It Works
          </span>
        </Button>
      </button>
      <a href={`${DASHBOARD_URL}/sign-up`} target="_blank" rel="noopener noreferrer">
        <Button
          size="lg"
          variant="outline"
          className="group px-8 border-border/40 hover:border-primary/50"
        >
          <span className="flex items-center gap-2">
            Sign Up
            <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          </span>
        </Button>
      </a>
    </div>
  );
}

// Animated terminal preview card with typing effect and gradient border
function TerminalPreview({ mounted }: { mounted: boolean }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const codeLines = [
    { prompt: true, text: 'npx timemachine setup-claude-code' },
    { prompt: false, text: '> 11 hooks installed. Capturing sessions...' },
    { prompt: false, text: '> Claude Code session: 47 steps captured' },
    { prompt: true, text: 'timemachine fork --step 31 --modify prompt' },
    { prompt: false, text: '> Forked. Replaying steps 32-47...' },
    { prompt: false, text: '> Done. Diff ready — saved $3.12 vs full re-run' },
  ];

  useEffect(() => {
    if (!mounted) return;

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((r) => {
        const id = setTimeout(r, ms);
        // Allow cleanup to reject pending sleeps
        if (cancelled) clearTimeout(id);
      });

    const typeText = async () => {
      while (!cancelled) {
        for (let lineIndex = 0; lineIndex < codeLines.length; lineIndex++) {
          if (cancelled) return;
          setCurrentLine(lineIndex);
          const line = codeLines[lineIndex];

          if (line.prompt) {
            setIsTyping(true);
            setDisplayedText('');
            for (let charIndex = 0; charIndex <= line.text.length; charIndex++) {
              if (cancelled) return;
              setDisplayedText(line.text.slice(0, charIndex));
              await sleep(30);
            }
            setIsTyping(false);
            await sleep(300);
          } else {
            await sleep(400);
          }
        }
        // Reset and loop
        await sleep(2000);
        if (cancelled) return;
        setCurrentLine(0);
        setDisplayedText('');
      }
    };

    typeText();

    return () => {
      cancelled = true;
    };
  }, [mounted]);

  return (
    <div className="mt-12 w-full max-w-xl" style={{ width: '576px', maxWidth: '100%' }}>
      {/* Animated gradient border wrapper */}
      <div
        className="relative rounded-lg p-[1px]"
        style={{
          background:
            'linear-gradient(135deg, hsl(25 95% 53% / 0.5), transparent, hsl(25 95% 53% / 0.3))',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 5s ease infinite',
        }}
      >
        <div className="overflow-hidden rounded-lg bg-card/95 shadow-2xl backdrop-blur-sm">
          {/* Terminal header */}
          <div className="flex items-center gap-2 border-b border-border/50 bg-card px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-500/70 transition-all hover:bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/70 transition-all hover:bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500/70 transition-all hover:bg-green-500" />
            <span className="ml-4 font-mono text-xs text-muted-foreground">~/my-project</span>
            <div className="ml-auto flex items-center gap-1">
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-[10px] text-green-500/70">claude code</span>
            </div>
          </div>

          {/* Terminal content */}
          <div className="p-4 font-mono text-sm h-[196px]">
            {codeLines.map((line, index) => (
              <div
                key={`${line.text}-${index}`}
                className={`transition-all duration-300 ${
                  index < currentLine
                    ? 'opacity-100 translate-y-0'
                    : index === currentLine
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2'
                }`}
              >
                {line.prompt ? (
                  <>
                    <span className="text-primary">$ </span>
                    <span className="text-foreground">
                      {index === currentLine && isTyping
                        ? displayedText
                        : index < currentLine
                          ? line.text
                          : ''}
                    </span>
                    {index === currentLine && isTyping && (
                      <span
                        className="inline-block h-4 w-2 bg-primary ml-0.5"
                        style={{ animation: 'cursor-blink 0.5s step-end infinite' }}
                      />
                    )}
                  </>
                ) : (
                  index <= currentLine && <span className="text-muted-foreground">{line.text}</span>
                )}
              </div>
            ))}
            {/* Blinking cursor when not typing */}
            {!isTyping && (
              <div className="mt-1">
                <span className="text-primary">$ </span>
                <span
                  className="inline-block h-4 w-2 bg-primary"
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

// Bottom feature pills with enhanced hover effects
function FeaturePills() {
  const features = [
    { icon: TerminalIcon, label: 'Claude Code', highlight: true },
    { icon: GitBranch, label: 'Fork & Replay', highlight: true },
    { icon: Layers, label: 'Step-by-Step Tracing', highlight: false },
    { icon: Play, label: 'Visual Diff', highlight: false },
    { icon: Clock, label: 'Time Travel', highlight: false },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 px-6 pb-8">
      {features.map(({ icon: Icon, label, highlight }) => (
        <div
          key={label}
          className={`group flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 ${
            highlight
              ? 'border-primary/40 bg-primary/10 shadow-sm shadow-primary/10'
              : 'border-border/30 bg-card/30'
          }`}
        >
          <Icon
            className={`h-4 w-4 transition-transform group-hover:scale-110 ${highlight ? 'text-primary' : 'text-primary/70'}`}
          />
          <span
            className={`font-mono text-xs transition-colors group-hover:text-foreground ${highlight ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            {label}
          </span>
          {highlight && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// Main hero component
export function HomeHero() {
  const [mounted, setMounted] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-background">
        {/* Background layers */}
        <AnimatedBackground />
        <SubtleAccent />
        <FloatingParticles />
        <NoiseOverlay />
        <MouseGlow />

        {/* Main content */}
        <div className="relative z-10 flex min-h-screen flex-col">
          <TerminalNav />

          <main className="flex flex-1 flex-col items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <StatusBadge />
              <HeroHeading />
              <HeroSubtitle />
              <HeroActions onHowItWorks={() => setShowHowItWorks(true)} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <TerminalPreview mounted={mounted} />
            </motion.div>
          </main>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <FeaturePills />
          </motion.div>
        </div>
      </div>

      {/* How It Works Modal */}
      <HowItWorksModal isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
    </>
  );
}
