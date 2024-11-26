import { StatsSection } from "@/pages/Stake/components/StatsSection";
import { HowToStakeSection } from "@/pages/Stake/components/HowToStakeSection";
import { FAQSection } from "@/pages/Stake/components/FAQSection";
import { BenefitsOfStakingSection } from "./components/BenefitsOfStakingSection";
import { AboutUsSection } from "./components/AboutUsSection";
import { UserOperationsSection } from "./components/UserOperations";

export const Stake: React.FC = () => {

  return (
    <div style={{ overflow: "hidden" }} className="overflow-hidden">
      <main className="flex flex-col gap-10 md:gap-16 mt-6">
        <StatsSection />
        <section className="flex flex-col md:flex-row items-start justify-between px-4 py-2 gap-4 max-w-screen-xl mx-auto">
          <AboutUsSection />
          <UserOperationsSection />
        </section>
        <HowToStakeSection />
        <BenefitsOfStakingSection />
        <FAQSection />
      </main>
    </div>
  );
};
