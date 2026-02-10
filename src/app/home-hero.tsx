'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GitBranch, Play, Layers, ChevronRight, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeatureSections } from './feature-sections';

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
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle, i) => (
        <span
          key={i}
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
    <p className="mb-8 max-w-lg text-center font-mono text-sm leading-relaxed text-muted-foreground md:text-base">
      Capture agent executions. Replay from any step.{' '}
      <span className="text-foreground">Compare diffs visually.</span>
    </p>
  );
}

// CTA button
function HeroActions() {
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
    </div>
  );
}

// Animated terminal preview card with typing effect and gradient border
function TerminalPreview({ mounted }: { mounted: boolean }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const codeLines = [
    { prompt: true, text: 'timemachine trace ./agent.ts' },
    { prompt: false, text: '> Recording execution...' },
    { prompt: false, text: '> 12 steps captured' },
    { prompt: true, text: 'timemachine fork --step 8' },
    { prompt: false, text: '> Forked from step 8' },
    { prompt: false, text: '> Diff ready at /review' },
  ];

  useEffect(() => {
    if (!mounted) return;

    const typeText = async () => {
      for (let lineIndex = 0; lineIndex < codeLines.length; lineIndex++) {
        setCurrentLine(lineIndex);
        const line = codeLines[lineIndex];

        if (line.prompt) {
          setIsTyping(true);
          setDisplayedText('');
          for (let charIndex = 0; charIndex <= line.text.length; charIndex++) {
            setDisplayedText(line.text.slice(0, charIndex));
            await new Promise((r) => setTimeout(r, 30));
          }
          setIsTyping(false);
          await new Promise((r) => setTimeout(r, 300));
        } else {
          await new Promise((r) => setTimeout(r, 400));
        }
      }
      // Reset and loop
      await new Promise((r) => setTimeout(r, 2000));
      setCurrentLine(0);
      setDisplayedText('');
      typeText();
    };

    typeText();
  }, [mounted]);

  return (
    <div className="mt-12 w-full max-w-xl">
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
            <span className="ml-4 font-mono text-xs text-muted-foreground">~/my-agent</span>
            <div className="ml-auto flex items-center gap-1 text-muted-foreground/50">
              <Zap className="h-3 w-3" />
              <span className="font-mono text-[10px]">live</span>
            </div>
          </div>

          {/* Terminal content */}
          <div className="p-4 font-mono text-sm min-h-[180px]">
            {codeLines.map((line, index) => (
              <div
                key={index}
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
    { icon: GitBranch, label: 'Fork & Replay', description: 'Branch from any step' },
    { icon: Layers, label: 'Step-by-Step Tracing', description: 'See every decision' },
    { icon: Play, label: 'Visual Diff', description: 'Compare side by side' },
    { icon: Clock, label: 'Time Travel', description: 'Go back in time' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 px-6 pb-8">
      {features.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="group flex items-center gap-2 rounded-full border border-border/30 bg-card/30 px-4 py-2 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5"
        >
          <Icon className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
          <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// Main hero component
export function HomeHero() {
  const [mounted, setMounted] = useState(false);

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
            <StatusBadge />
            <HeroHeading />
            <HeroSubtitle />
            <HeroActions />
            <TerminalPreview mounted={mounted} />
          </main>

          <FeaturePills />
        </div>
      </div>

      {/* Feature sections below the fold */}
      <FeatureSections />
    </>
  );
}
