import { useState } from 'react';
import { Check, Copy, MessageCircle } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { WHATSAPP_DISPLAY, buildWhatsAppUrl } from '../utils/conversion';
import { MascotCharacter } from './MascotCharacter';
import { SystemKwCubeMark } from './SystemKwCubeMark';

interface FooterCtaSectionProps {
  onOpenWhatsAppModal: () => void;
}

export function FooterCtaSection({ onOpenWhatsAppModal }: FooterCtaSectionProps) {
  const [copied, setCopied] = useState(false);
  const finalWaUrl = buildWhatsAppUrl({
    source: 'Cierre Final Footer',
  });

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText('5535660861');
      setCopied(true);
      trackEvent('copy_whatsapp_number', { location: 'footer' });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <footer className="bg-[#041E42] text-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-20 border-b border-[#123B72]">
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#062B5B] border border-[#123B72] p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-8">
          <MascotCharacter
            variant="avatar"
            alt="Asesor SystemKW listo para activar tu facturación por WhatsApp"
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-2 border-[#F5B400] shrink-0"
          />

          <div className="text-center lg:text-left flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-[#F5B400] mb-3">
              Bonificación activa esta semana · Instalación gratuita y migración de catálogos
            </p>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight text-white mb-4">
              Tu próximo cierre de mes puede ser el último en que pagues por folios.
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-7">
              Escríbenos ahora mismo por WhatsApp. En menos de 10 minutos validamos tu RFC, te
              mostramos el sistema en vivo y agendamos tu instalación gratuita.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3">
              <a
                href={finalWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_cta_click', { location: 'footer_cta' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 sm:px-7 py-4 text-sm sm:text-base font-bold bg-[#0E8A3E] hover:bg-[#0B7132] text-white rounded-xl transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
              >
                <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>Activar por WhatsApp ({WHATSAPP_DISPLAY})</span>
              </a>

              <button
                type="button"
                onClick={handleCopyNumber}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 text-sm font-semibold text-slate-100 hover:text-[#F5B400] border border-[#1E4E8C] hover:border-[#38BDF8] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#F5B400] shrink-0" aria-hidden="true" />
                    <span>Número copiado: 5535660861</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Copiar WhatsApp: {WHATSAPP_DISPLAY}</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={onOpenWhatsAppModal}
                className="text-xs font-medium text-slate-300 hover:text-[#F5B400] underline underline-offset-4 cursor-pointer"
              >
                ¿Prefieres armar tu mensaje con plan y volumen de facturas primero? Haz clic aquí.
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <SystemKwCubeMark className="w-5 h-5 shrink-0" />
          <span className="font-display font-bold text-sm text-white">
            System<span className="text-[#38BDF8]">KW</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>Gestión Fiscal Inteligente · CFDI 4.0</span>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <a href="#problema" className="hover:text-[#F5B400] transition-colors">
            El Problema
          </a>
          <a href="#beneficios" className="hover:text-[#F5B400] transition-colors">
            Beneficios
          </a>
          <a href="#comparativa-ahorro" className="hover:text-[#F5B400] transition-colors">
            Comparativa
          </a>
          <a href="#precios" className="hover:text-[#F5B400] transition-colors">
            Planes
          </a>
          <a href="#preguntas" className="hover:text-[#F5B400] transition-colors">
            Preguntas
          </a>
          <span className="font-mono text-[#F5B400] tabular-nums">WhatsApp {WHATSAPP_DISPLAY}</span>
        </div>
      </div>
    </footer>
  );
}
