'use client';

import { useEffect, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Radio, Search, GitFork } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: Radio,
    title: 'Capture Everything',
    description:
      'Time Machine records every step your AI agent takes — LLM calls, tool invocations, decisions, and outputs. Install the SDK with one line, or connect Claude Code with zero config.',
  },
  {
    icon: Search,
    title: 'Replay & Inspect',
    description:
      'Every execution becomes an interactive timeline. Click any step to see exactly what went in and what came out. Watch costs add up in real-time. Spot the bug instantly.',
  },
  {
    icon: GitFork,
    title: 'Fork & Fix',
    description:
      'Found the problem? Fork the execution at that exact step. Modify one input, replay the rest. No need to re-run the entire agent — save 75% on API costs and hours of debugging time.',
  },
];

function StepVisual({ stepIndex }: { stepIndex: number }) {
  if (stepIndex === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-4 py-3 font-mono text-xs">
        <span className="text-primary">$</span>
        <motion.span
          className="text-muted-foreground"
          initial={{ width: 0 }}
          animate={{ width: 'auto' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="text-foreground">npm i</span>{' '}
          <span className="text-primary">@timemachine/sdk</span>
        </motion.span>
        <motion.span
          className="ml-auto text-green-500/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          done
        </motion.span>
      </div>
    );
  }

  if (stepIndex === 1) {
    const items = ['LLM Call', 'Tool: search', 'Decision', 'Output'];
    return (
      <div className="flex flex-col gap-1.5 rounded-lg border border-border/50 bg-card/50 px-4 py-3 font-mono text-xs">
        {items.map((item, i) => (
          <motion.div
            key={item}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">{item}</span>
            <span className="ml-auto text-primary/50">{(0.02 + i * 0.01).toFixed(3)}s</span>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3 font-mono text-xs">
      <motion.div
        className="flex items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-muted-foreground">step 8</span>
        <span className="text-primary">{'→'}</span>
      </motion.div>
      <motion.div
        className="flex items-center gap-1.5 rounded border border-primary/30 bg-primary/5 px-2 py-0.5"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <GitFork className="h-3 w-3 text-primary" />
        <span className="text-primary">forked</span>
      </motion.div>
      <motion.span
        className="ml-auto text-green-500/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        -75% cost
      </motion.span>
    </div>
  );
}

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  const [activeStep, setActiveStep] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveStep((prev) => Math.max(prev - 1, 0));
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-2xl rounded-xl border border-border/50 bg-card shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="px-8 pb-8 pt-8">
              {/* Header */}
              <h2 className="mb-1 text-center text-xl font-semibold text-foreground">
                How It Works
              </h2>
              <p className="mb-8 text-center text-sm text-muted-foreground">
                Three steps to debug any AI agent
              </p>

              {/* Step indicators */}
              <div className="mb-8 flex items-center justify-center">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex items-center">
                    <button
                      onClick={() => setActiveStep(index)}
                      className="group relative flex flex-col items-center"
                      aria-label={`Step ${index + 1}: ${step.title}`}
                    >
                      <motion.div
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                          index === activeStep
                            ? 'border-primary bg-primary text-primary-foreground'
                            : index < activeStep
                              ? 'border-primary bg-primary/20 text-primary'
                              : 'border-border bg-card text-muted-foreground'
                        }`}
                        animate={index === activeStep ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {index + 1}
                      </motion.div>
                      <span
                        className={`mt-1.5 text-[11px] font-medium transition-colors ${
                          index === activeStep ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        {step.title.split(' ')[0]}
                      </span>
                    </button>

                    {/* Connecting line */}
                    {index < steps.length - 1 && (
                      <div className="mx-4 mb-5 h-[2px] w-12 rounded-full bg-border">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={false}
                          animate={{
                            width: index < activeStep ? '100%' : '0%',
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Step content */}
              <div className="relative min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Icon */}
                    {(() => {
                      const Icon = steps[activeStep].icon;
                      return (
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      );
                    })()}

                    {/* Title */}
                    <h3 className="mb-3 text-lg font-semibold text-foreground">
                      {steps[activeStep].title}
                    </h3>

                    {/* Description */}
                    <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                      {steps[activeStep].description}
                    </p>

                    {/* Animated visual */}
                    <div className="w-full max-w-sm">
                      <StepVisual stepIndex={activeStep} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Got it button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={onClose}
                  className="rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
