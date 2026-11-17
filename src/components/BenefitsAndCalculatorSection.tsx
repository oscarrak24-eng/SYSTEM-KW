import { ArrowRight, Check, MessageCircle, ShieldCheck } from 'lucide-react';
import { BENEFITS } from '../data/landingContent';
import { trackEvent } from '../utils/analytics';
import { PlanId, buildWhatsAppUrl } from '../utils/conversion';

interface BenefitsAndCalculatorSectionProps {
  onSelectPlanForWhatsApp: (planId: PlanId, monthlyInvoices: number) => void;
}

export function BenefitsAndCalculatorSection({
  onSelectPlanForWhatsApp,
}: BenefitsAndCalculatorSectionProps) {
  const guaranteeWaUrl = buildWhatsAppUrl({
    source: 'Sección Beneficios - Garantía Instalación',
  });

  return (
    <section
      id="beneficios"
      className="scroll-mt-20 bg-[#F4F8FC] py-16 lg:py-24 border-b border-[#D6E4F2]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-12">
          <p className="text-xs sm:text-sm font-semibold text-[#0284C7] mb-3">
            Ventaja competitiva diseñada para dirección y finanzas
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#062B5B] mb-4">
            Todo lo que necesitas para timbrar sin límites desde el día uno
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Sin módulos innecesarios ni curvas de aprendizaje eternas. Tres pilares comerciales que
            eliminan el costo variable por timbre en tu empresa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {BENEFITS.slice(0, 2).map((benefit) => (
            <article
              key={benefit.index}
              className={`rounded-2xl p-6 sm:p-8 border flex flex-col justify-between ${
                benefit.highlight
                  ? 'lg:col-span-2 bg-[#062B5B] text-slate-100 border-[#123B72]'
                  : 'bg-white text-[#062B5B] border-[#D6E4F2]'
              }`}
            >
              <div>
                <p
                  className={`text-xs font-mono font-semibold mb-2 ${
                    benefit.highlight ? 'text-[#F5B400]' : 'text-[#0284C7]'
                  }`}
                >
                  {benefit.index} BENEFICIO CLAVE
                </p>
                <h3
                  className={`font-display font-bold text-xl sm:text-2xl mb-3 ${
                    benefit.highlight ? 'text-white' : 'text-[#062B5B]'
                  }`}
                >
                  {benefit.title}
                </h3>
                <p
                  className={`text-sm sm:text-base leading-relaxed mb-6 ${
                    benefit.highlight ? 'text-slate-200' : 'text-slate-600'
                  }`}
                >
                  {benefit.summary}
                </p>
              </div>

              <ul className="space-y-3">
                {benefit.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-sm">
                    <Check
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        benefit.highlight ? 'text-[#F5B400]' : 'text-[#0E8A3E]'
                      }`}
                      aria-hidden="true"
                    />
                    <span className={benefit.highlight ? 'text-slate-100' : 'text-slate-700'}>
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}

          {/* Full-width 3rd Bento Card with Executive Onboarding Guarantee */}
          <article className="lg:col-span-3 rounded-2xl p-6 sm:p-8 border border-[#D6E4F2] bg-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-mono font-semibold text-[#0284C7] mb-2">
                {BENEFITS[2].index} BENEFICIO CLAVE
              </p>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#062B5B] mb-3">
                {BENEFITS[2].title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5">
                {BENEFITS[2].summary}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BENEFITS[2].bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-[#0E8A3E] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 rounded-xl bg-[#041E42] text-white p-6 border border-[#123B72] space-y-4">
              <div className="flex items-center gap-2.5 text-[#F5B400]">
                <ShieldCheck className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span className="font-display font-bold text-sm">
                  Garantía de arranque el mismo día
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Agenda hoy por WhatsApp: en menos de 30 minutos dejamos cargados tus sellos CSD,
                logotipo y series para emitir tu primera factura CFDI 4.0 en vivo.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                <a
                  href={guaranteeWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('whatsapp_cta_click', { location: 'benefits_guarantee' })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-[#0E8A3E] hover:bg-[#0B7132] text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Agendar instalación gratis</span>
                </a>
                <button
                  type="button"
                  onClick={() => onSelectPlanForWhatsApp('corporativo', 350)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:text-[#F5B400] border border-[#1E4E8C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Cotizar equipo</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
