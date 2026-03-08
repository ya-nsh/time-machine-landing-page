import { HomeHero } from './home-hero';
import { StatsSection } from './stats-section';
import { HowItWorks } from './how-it-works';
import { ClaudeCodeSection } from './claude-code-section';
import { FeatureSections } from './feature-sections';
import { ComparisonSection } from './comparison-section';
import { CTASection } from './cta-section';
import { Footer } from './footer';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <StatsSection />
      <HowItWorks />
      <ClaudeCodeSection />
      <FeatureSections />
      <ComparisonSection />
      <CTASection />
      <Footer />
    </>
  );
}
