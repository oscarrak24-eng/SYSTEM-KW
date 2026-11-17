import { FileCheck2, Headphones, Lock, ShieldCheck } from 'lucide-react';

interface TrustItem {
  id: string;
  title: string;
  description: string;
  Icon: typeof ShieldCheck;
}

const TRUST_ITEMS: TrustItem[] = [
  {
    id: 'sat-compliant',
    title: 'Cumplimiento SAT CFDI 4.0',
    description: 'Esquemas, catálogos y reglas fiscales actualizados ante el SAT.',
    Icon: ShieldCheck,
  },
  {
    id: 'secure-data',
    title: 'Datos y Sellos CSD Seguros',
    description: 'Cifrado SSL y resguardo protegido de tus certificados digitales.',
    Icon: Lock,
  },
  {
    id: 'support-24-7',
    title: 'Soporte Directo 24/7',
    description: 'Asistencia técnica humana por WhatsApp al 55 3566 0861.',
    Icon: Headphones,
  },
  {
    id: 'xml-backup',
    title: 'Respaldo XML y PDF',
    description: 'Descarga inmediata y resguardo automático para tu contabilidad.',
    Icon: FileCheck2,
  },
];

export function SecurityTrustStrip() {
  return (
    <section
      aria-label="Seguridad y respaldo fiscal"
      data-testid="security-trust-strip"
      className="bg-white border-b border-[#D6E4F2] py-7 sm:py-8"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_ITEMS.map(({ id, title, description, Icon }) => (
            <div key={id} className="flex items-start gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#062B5B] border border-[#123B72] flex items-center justify-center text-[#F5B400] shrink-0">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display font-bold text-sm text-[#062B5B] leading-snug">
                  {title}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
