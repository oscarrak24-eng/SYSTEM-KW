import { ArrowRight, MessageCircle } from 'lucide-react';
import { HERO_PROOF_METRICS } from '../data/landingContent';
import { trackEvent } from '../utils/analytics';
import { WHATSAPP_DISPLAY, buildWhatsAppUrl } from '../utils/conversion';
import { MascotCharacter } from './MascotCharacter';

interface HeroSectionProps {
  onOpenWhatsAppModal: () => void;
}

export function HeroSection({ onOpenWhatsAppModal }: HeroSectionProps) {
  const directHeroWaUrl = buildWhatsAppUrl({
    source: 'Botón Principal Hero',
  });

  return (
    <section
      id="inicio"
      className="scroll-mt-20 bg-[#041E42] text-slate-100 border-b border-[#123B72] pt-10 pb-14 lg:pt-16 lg:pb-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center min-w-0">
            <div className="w-16 h-1 bg-[#F5B400] rounded-full mb-4" aria-hidden="true" />
            <p className="text-xs sm:text-sm font-semibold text-[#38BDF8] tracking-wide mb-3">
              Gestión Fiscal Inteligente · Facturación CFDI 4.0 en México
            </p>

            <h1 className="font-display font-extrabold text-[clamp(2.15rem,4vw,3.55rem)] leading-[1.06] tracking-tight text-white mb-6">
              Deja de pagar por cada factura que emites. Timbra sin límites hoy mismo.
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mb-8">
              Mientras otros sistemas te cobran folio por folio y te frenan a fin de mes,{' '}
              <strong className="text-white font-semibold">SystemKW</strong> te entrega timbrado
              CFDI 4.0 ilimitado, interfaz intuitiva y productiva e instalación gratuita desde{' '}
              <span className="font-semibold text-[#F5B400] tabular-nums">$2,690 + IVA</span> por
              licencia anual.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
              <a
                href={directHeroWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_cta_click', { location: 'hero_primary' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3.5 text-sm sm:text-base font-bold bg-[#0E8A3E] hover:bg-[#0B7132] text-white rounded-xl transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
              >
                <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>Activar por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onOpenWhatsAppModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-100 hover:text-[#F5B400] border border-[#1E4E8C] hover:border-[#38BDF8] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
              >
                <span>Personalizar mensaje ({WHATSAPP_DISPLAY})</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-300">
              <span>Instalación gratuita</span>
              <span aria-hidden="true" className="text-[#F5B400]">
                ·
              </span>
              <span>Cumplimiento SAT CFDI 4.0</span>
              <span aria-hidden="true" className="text-[#F5B400]">
                ·
              </span>
              <span>Atención directa en WhatsApp {WHATSAPP_DISPLAY}</span>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="relative flex-1 rounded-2xl overflow-hidden border-2 border-[#1E4E8C] bg-[#EBF3FA] shadow-[0_24px_60px_-15px_rgba(0,159,227,0.22)] flex flex-col justify-between">
              <MascotCharacter
                variant="pointing"
                highPriority
                alt="Asesor principal de SystemKW señalando al usuario con tableta CFDI 4.0"
                className="w-full flex-1"
              />
              <div className="bg-[#062B5B] border-t border-[#123B72] px-5 py-4">
                <p className="text-xs font-mono font-semibold text-[#F5B400] tabular-nums">
                  ACTIVACIÓN INMEDIATA · WHATSAPP {WHATSAPP_DISPLAY}
                </p>
                <p className="text-sm font-medium text-white mt-1">
                  Facturación profesional para cada etapa de tu negocio, sin topes de timbres.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#123B72] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HERO_PROOF_METRICS.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <p className="font-mono text-2xl font-bold text-[#F5B400] tabular-nums">
                {metric.value}
              </p>
              <p className="text-sm font-semibold text-white">{metric.label}</p>
              <p className="text-xs text-slate-300">{metric.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
