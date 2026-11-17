import { AlertTriangle } from 'lucide-react';
import { PAIN_IMAGE, PAIN_POINTS } from '../data/landingContent';
import { ResilientImage } from './ResilientImage';

export function PainSection() {
  return (
    <section
      id="problema"
      className="scroll-mt-20 bg-[#F4F8FC] py-16 lg:py-24 border-b border-[#D6E4F2]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-12">
          <p className="text-xs sm:text-sm font-semibold text-[#B45309] mb-3">
            El problema que frena tu flujo de efectivo
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#062B5B] mb-4">
            ¿Por qué sigues pagando una multa cada vez que vendes?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            El modelo tradicional de paquetes de folios fue diseñado para exprimir a las empresas
            que facturan más. Entre timbres vencidos y rechazos del CFDI 4.0, tu equipo termina
            trabajando para el software en lugar de cobrar a tiempo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[300px] rounded-2xl overflow-hidden border border-[#C6DCF0] bg-[#062B5B]">
              <ResilientImage
                src={PAIN_IMAGE}
                alt="Escritorio saturado de papeles, recibos y calculadora reflejando estrés fiscal y errores de CFDI"
                fallbackTitle="Saturación administrativa"
                fallbackSubtitle="Facturación lenta, folios agotados y estrés de fin de mes."
                className="w-full h-full object-cover contrast-[1.05] saturate-[0.92]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#041E42]/90 via-[#041E42]/35 to-transparent"
              />
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white">
                <p className="font-mono text-xs font-semibold text-[#F5B400] tabular-nums">
                  FUGA INVISIBLE DE CAPITAL
                </p>
                <p className="font-display font-bold text-base sm:text-lg mt-1 leading-snug">
                  Cada folio extra y cada cancelación mal hecha reduce el margen neto de tu negocio.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            {PAIN_POINTS.map((pain) => (
              <article
                key={pain.index}
                className="bg-white border border-[#D6E4F2] rounded-xl p-6 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-display font-bold text-lg sm:text-xl text-[#062B5B]">
                    {pain.index} {pain.title}
                  </h3>
                  <AlertTriangle
                    className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-3">
                  {pain.description}
                </p>
                <p className="text-xs font-mono font-semibold text-[#B45309] tabular-nums">
                  Impacto real: {pain.impact}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
