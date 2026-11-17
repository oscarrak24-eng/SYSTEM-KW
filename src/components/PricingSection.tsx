import { Building2, Check, MessageCircle } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { PLANS, PlanId, WHATSAPP_DISPLAY, buildWhatsAppUrl } from '../utils/conversion';
import { MascotCharacter } from './MascotCharacter';

interface PricingSectionProps {
  onSelectPlanForWhatsApp: (planId: PlanId) => void;
}

export function PricingSection({ onSelectPlanForWhatsApp }: PricingSectionProps) {
  const orderedPlans = [PLANS.esencial, PLANS.corporativo];

  return (
    <section
      id="precios"
      className="scroll-mt-20 bg-white py-16 lg:py-24 border-b border-[#D6E4F2]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="w-16 h-1 bg-[#F5B400] rounded-full mx-auto mb-4" aria-hidden="true" />
          <p className="text-xs sm:text-sm font-semibold text-[#0284C7] mb-2">
            Facturación profesional para cada etapa de tu negocio
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#062B5B] mb-4">
            Elige tu plan de timbrado ilimitado
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Ambos planes incluyen cumplimiento total CFDI 4.0, instalación gratuita y atención
            directa por WhatsApp al{' '}
            <span className="font-semibold text-[#062B5B] tabular-nums">{WHATSAPP_DISPLAY}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {orderedPlans.map((plan) => {
            const isCorporate = plan.id === 'corporativo';
            const directWaUrl = buildWhatsAppUrl({
              planId: plan.id,
              source: `Tabla de Precios - ${plan.name}`,
            });

            return (
              <article
                key={plan.id}
                data-testid={`pricing-card-${plan.id}`}
                className={`rounded-2xl overflow-hidden flex flex-col justify-between border min-w-0 ${
                  isCorporate
                    ? 'bg-[#041E42] text-slate-100 border-[#123B72]'
                    : 'bg-[#F4F8FC] text-[#062B5B] border-[#C6DCF0]'
                }`}
              >
                <div>
                  {/* Brand poster Navy + Gold plan header */}
                  <div className="bg-[#062B5B] px-6 sm:px-8 py-5 border-b border-[#123B72] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-6 h-6 text-[#F5B400] shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-xs font-semibold text-white tracking-wider">PLAN</p>
                        <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#F5B400] leading-none">
                          {isCorporate ? 'CORPORATIVO' : 'ESENCIAL'}
                        </h3>
                      </div>
                    </div>
                    {plan.badgeText && (
                      <span className="text-xs font-semibold text-[#38BDF8] whitespace-nowrap shrink-0">
                        {plan.badgeText}
                      </span>
                    )}
                  </div>

                  <div className="p-6 sm:p-8">
                    <p
                      className={`text-sm font-semibold mb-4 ${
                        isCorporate ? 'text-[#38BDF8]' : 'text-[#062B5B]'
                      }`}
                    >
                      {isCorporate ? 'Multiempresa · varios RFC' : '1 RFC emisor'}
                    </p>

                    <div className="bg-[#062B5B] text-white rounded-xl p-5 mb-6 border border-[#123B72]">
                      <div className="flex items-baseline gap-2.5 flex-wrap">
                        <span className="font-mono text-4xl sm:text-5xl font-bold tracking-tight tabular-nums text-white">
                          {plan.priceFormatted}
                        </span>
                        <span className="font-display font-bold text-base text-[#F5B400]">
                          + IVA
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 mt-1.5">
                        / licencia anual · {plan.recommendedFor}
                      </p>
                    </div>

                    <p
                      className={`text-sm leading-relaxed mb-6 ${
                        isCorporate ? 'text-slate-200' : 'text-slate-600'
                      }`}
                    >
                      {plan.tagline}
                    </p>

                    <ul className="space-y-3.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm">
                          <Check
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isCorporate ? 'text-[#F5B400]' : 'text-[#0E8A3E]'
                            }`}
                            aria-hidden="true"
                          />
                          <span className={isCorporate ? 'text-slate-100' : 'text-slate-700'}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-3">
                  <a
                    href={directWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent('whatsapp_cta_click', {
                        location: `pricing_card_${plan.id}`,
                        plan_id: plan.id,
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-4 text-sm sm:text-base font-bold bg-[#0E8A3E] hover:bg-[#0B7132] text-white rounded-xl transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Activar {plan.name}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => onSelectPlanForWhatsApp(plan.id)}
                    className={`w-full py-2.5 px-3 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isCorporate
                        ? 'border-[#1E4E8C] text-slate-200 hover:text-[#F5B400] hover:border-[#38BDF8]'
                        : 'border-[#C6DCF0] text-[#062B5B] hover:border-[#009FE3]'
                    }`}
                  >
                    Solicitar cotización ({plan.priceFormatted} + IVA)
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mascot + direct WhatsApp banner inspired by the SystemKW poster */}
        <div className="mt-10 max-w-5xl mx-auto rounded-2xl bg-[#062B5B] text-white p-5 sm:p-6 border border-[#123B72] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <MascotCharacter
              variant="avatar"
              alt="Asesor SystemKW invitándote a contactar por WhatsApp"
              className="w-16 h-16 rounded-xl border-2 border-[#F5B400] shrink-0"
            />
            <div>
              <p className="text-xs font-semibold text-[#F5B400]">
                ¿Dudas entre Esencial o Corporativo?
              </p>
              <p className="font-display font-bold text-lg sm:text-xl text-white">
                Escríbenos directo y te ayudamos a elegir en 2 minutos
              </p>
            </div>
          </div>

          <a
            href={buildWhatsAppUrl({ source: 'Banner Asesor Precios' })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_cta_click', { location: 'pricing_banner' })}
            className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-[#0E8A3E] hover:bg-[#0B7132] text-white font-bold rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="font-mono tabular-nums">CONTÁCTANOS {WHATSAPP_DISPLAY}</span>
          </a>
        </div>

        <div className="mt-10 max-w-5xl mx-auto overflow-x-auto border border-[#D6E4F2] rounded-xl bg-[#F4F8FC]">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#D6E4F2] bg-[#062B5B] text-white">
                <th className="py-3.5 px-5 font-display font-bold">Comparativa rápida</th>
                <th className="py-3.5 px-5 font-mono font-bold text-[#F5B400] tabular-nums">
                  Plan Esencial ($2,690 + IVA)
                </th>
                <th className="py-3.5 px-5 font-mono font-bold text-[#38BDF8] tabular-nums">
                  Plan Corporativo ($3,990 + IVA)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6E4F2] text-slate-700 bg-white">
              <tr>
                <td className="py-3 px-5 font-medium text-[#062B5B]">Timbres CFDI 4.0 incluidos</td>
                <td className="py-3 px-5 font-mono tabular-nums">Ilimitados</td>
                <td className="py-3 px-5 font-mono font-semibold text-[#062B5B] tabular-nums">
                  Ilimitados
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-medium text-[#062B5B]">RFCs emisores</td>
                <td className="py-3 px-5 font-mono tabular-nums">1 RFC</td>
                <td className="py-3 px-5 font-mono font-semibold text-[#062B5B] tabular-nums">
                  Multiempresa · varios RFC
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-medium text-[#062B5B]">Usuarios simultáneos</td>
                <td className="py-3 px-5 font-mono tabular-nums">Hasta 2</td>
                <td className="py-3 px-5 font-mono font-semibold text-[#062B5B] tabular-nums">
                  Ilimitados
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-medium text-[#062B5B]">Carta Porte 3.1 y addendas</td>
                <td className="py-3 px-5">Opcional</td>
                <td className="py-3 px-5 font-semibold text-[#0D7A36]">Incluido</td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-medium text-[#062B5B]">
                  Instalación y puesta en marcha
                </td>
                <td className="py-3 px-5 font-semibold text-[#0D7A36]">Gratis</td>
                <td className="py-3 px-5 font-semibold text-[#0D7A36]">Gratis prioritaria (24h)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Licencia se tiene que renovar cada año · * Soporte técnico prioritario con costo extra
        </p>
      </div>
    </section>
  );
}
