'use client';

import Link from 'next/link';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DASHBOARD_URL } from '@/lib/constants';

function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-24 top-1/3 h-72 w-72 animate-float-orb rounded-full bg-primary/15 blur-[100px]" />
      <div className="absolute -right-24 bottom-1/3 h-64 w-64 animate-float-orb-reverse rounded-full bg-primary/10 blur-[80px]" />
      <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 animate-glow-pulse rounded-full bg-primary/8 blur-[60px]" />
    </div>
  );
}

function FloatingParticles() {
  const particles = [
    { text: '{', x: 8, y: 25, delay: 0 },
    { text: '/>', x: 88, y: 20, delay: 1.5 },
    { text: '=>', x: 15, y: 70, delay: 2 },
    { text: '()', x: 82, y: 75, delay: 3 },
    { text: '[]', x: 50, y: 15, delay: 1 },
    { text: '...', x: 70, y: 60, delay: 2.5 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={`${particle.text}-${particle.x}`}
          className="absolute font-mono text-xs text-primary/10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: 'float-particle 20s ease-in-out infinite',
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.text}
        </span>
      ))}
    </div>
  );
}

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32">
      {/* Background effects */}
      <FloatingOrbs />
      <FloatingParticles />

      {/* Subtle top/bottom gradient blend */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% 50%,
              hsl(25 95% 53% / 0.1) 0%,
              transparent 60%)
          `,
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {/* Animated gradient border card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative rounded-2xl p-[1px]"
          style={{
            background:
              'linear-gradient(135deg, hsl(25 95% 53% / 0.5), transparent 40%, hsl(25 95% 53% / 0.3))',
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 5s ease infinite',
          }}
        >
          <div className="rounded-2xl bg-card/80 px-8 py-16 text-center backdrop-blur-sm md:px-16 md:py-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl"
            >
              Ready to Debug Smarter?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-10 max-w-md font-mono text-sm leading-relaxed text-muted-foreground md:text-base"
            >
              Start capturing your agent executions in under 2 minutes. Free to get started.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            >
              <Button size="lg" className="group relative overflow-hidden px-8" asChild>
                <Link href="/docs">
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group border-border/40 px-8 hover:border-primary/50"
                asChild
              >
                <a href={`${DASHBOARD_URL}/sign-up`} target="_blank" rel="noopener noreferrer">
                  <span className="flex items-center gap-2">
                    Sign Up
                    <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </span>
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
