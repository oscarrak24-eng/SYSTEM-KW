import { useEffect, useState } from 'react';
import { BenefitsAndCalculatorSection } from './components/BenefitsAndCalculatorSection';
import { D3SavingsComparisonSection } from './components/D3SavingsComparisonSection';
import { FaqSection } from './components/FaqSection';
import { FooterCtaSection } from './components/FooterCtaSection';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { PainSection } from './components/PainSection';
import { PricingSection } from './components/PricingSection';
import { SecurityTrustStrip } from './components/SecurityTrustStrip';
import { SolutionSection } from './components/SolutionSection';
import { WhatsAppDrawer } from './components/WhatsAppDrawer';
import { initGoogleAnalytics, trackEvent } from './utils/analytics';
import { PlanId } from './utils/conversion';

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPlan, setDrawerPlan] = useState<PlanId>('corporativo');
  const [drawerInvoices, setDrawerInvoices] = useState<number>(200);

  useEffect(() => {
    initGoogleAnalytics();
  }, []);

  const handleOpenWhatsAppModal = (
    planId: PlanId = 'corporativo',
    monthlyInvoices = 200,
    source = 'general'
  ) => {
    setDrawerPlan(planId);
    setDrawerInvoices(monthlyInvoices);
    setDrawerOpen(true);
    trackEvent('open_whatsapp_drawer', {
      source,
      plan_id: planId,
      monthly_invoices: monthlyInvoices,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F8FC] text-[#062B5B]">
      <Navbar
        onOpenWhatsAppModal={(planId) =>
          handleOpenWhatsAppModal(planId ?? 'corporativo', 200, 'navbar')
        }
      />

      <main className="flex-1">
        <HeroSection
          onOpenWhatsAppModal={() => handleOpenWhatsAppModal('corporativo', 200, 'hero')}
        />
        <SecurityTrustStrip />
        <PainSection />
        <SolutionSection />
        <BenefitsAndCalculatorSection
          onSelectPlanForWhatsApp={(planId, invoices) =>
            handleOpenWhatsAppModal(planId, invoices, 'benefits_guarantee')
          }
        />
        <D3SavingsComparisonSection
          onSelectPlanForWhatsApp={(planId, invoices) =>
            handleOpenWhatsAppModal(planId, invoices, 'd3_comparison')
          }
        />
        <PricingSection
          onSelectPlanForWhatsApp={(planId) =>
            handleOpenWhatsAppModal(planId, 200, `pricing_${planId}`)
          }
        />
        <FaqSection />
      </main>

      <FooterCtaSection
        onOpenWhatsAppModal={() => handleOpenWhatsAppModal('corporativo', 200, 'footer')}
      />

      <WhatsAppDrawer
        isOpen={drawerOpen}
        initialPlanId={drawerPlan}
        initialMonthlyInvoices={drawerInvoices}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
