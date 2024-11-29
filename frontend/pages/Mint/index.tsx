import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";

export default function MintPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <HeroSection />
      <StatsSection />
    </div>
  );
}
