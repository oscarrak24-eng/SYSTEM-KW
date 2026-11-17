import { CheckCircle2, MessageCircle } from 'lucide-react';
import { SOLUTION_PILLARS, TESTIMONIALS } from '../data/landingContent';
import { trackEvent } from '../utils/analytics';
import { buildWhatsAppUrl } from '../utils/conversion';
import { MascotCharacter } from './MascotCharacter';
import { SystemKwCubeMark } from './SystemKwCubeMark';

export function SolutionSection() {
  const waUrl = buildWhatsAppUrl({ source: 'Sección Solución' });

  return (
    <section
      id="solucion"
      className="scroll-mt-20 bg-white py-16 lg:py-24 border-b border-[#D6E4F2]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-[#0284C7] mb-3">
              La solución definitiva para tu operación fiscal
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#062B5B] mb-5">
              SystemKW convierte tu facturación en un proceso predecible de 30 segundos.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              Diseñamos un sistema directo al grano: sin contadores de timbres, sin recargas
              sorpresa y con validación automática ante el SAT para que cada factura salga limpia a
              la primera.
            </p>

            <div className="space-y-6 mb-8">
              {SOLUTION_PILLARS.map((pillar) => (
                <div
                  key={pillar.index}
                  className="flex items-start gap-4 pb-6 border-b border-slate-100 last:border-b-0 last:pb-0"
                >
                  <CheckCircle2
                    className="w-5 h-5 text-[#0E8A3E] shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#062B5B] mb-1">
                      {pillar.index} {pillar.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_cta_click', { location: 'solution_demo' })}
                className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3.5 text-sm sm:text-base font-semibold bg-[#0E8A3E] hover:bg-[#0B7132] text-white rounded-xl transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3]"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Ver demo en vivo por WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="flex-1 rounded-2xl overflow-hidden border border-[#C6DCF0] bg-[#EBF3FA] flex flex-col justify-between">
              <div className="px-5 py-4 bg-[#062B5B] text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <SystemKwCubeMark className="w-6 h-6 shrink-0" />
                  <span className="font-display font-bold text-sm">
                    System<span className="text-[#38BDF8]">KW</span> CFDI 4.0
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-[#F5B400] whitespace-nowrap">
                  Laptop · Tablet · XML
                </span>
              </div>

              <MascotCharacter
                variant="full-advisor"
                alt="Asesor SystemKW operando laptop, tableta y factura electrónica CFDI 4.0 con código QR"
                className="w-full flex-1"
              />
            </div>
          </div>
        </div>

        <div className="mt-14 pt-12 border-t border-[#D6E4F2] grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((item) => (
            <blockquote
              key={item.author}
              className="bg-[#F4F8FC] border border-[#D6E4F2] rounded-xl p-6 flex flex-col justify-between gap-5"
            >
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                “{item.quote}”
              </p>
              <footer className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#D6E4F2]">
                <div className="flex items-center gap-3">
                  <MascotCharacter
                    variant="avatar"
                    alt="Distintivo de cliente verificado SystemKW"
                    className="w-10 h-10 rounded-full border border-[#062B5B]/20 shrink-0"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#062B5B]">{item.author}</p>
                    <p className="text-xs text-slate-600">
                      {item.role} · {item.company}
                    </p>
                  </div>
                </div>
                <p className="text-xs font-mono font-semibold text-[#0D7A36] tabular-nums">
                  {item.outcome}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
