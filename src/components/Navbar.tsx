import { MessageCircle } from 'lucide-react';
import { PlanId } from '../utils/conversion';
import { SystemKwCubeMark } from './SystemKwCubeMark';

interface NavbarProps {
  onOpenWhatsAppModal: (planId?: PlanId) => void;
}

export function Navbar({ onOpenWhatsAppModal }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 h-16 bg-[#041E42]/95 backdrop-blur-sm border-b border-[#123B72]">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-8">
        <a
          href="#inicio"
          className="inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded-sm"
        >
          <SystemKwCubeMark className="w-7 h-7 shrink-0" />
          <span>
            System<span className="text-[#38BDF8]">KW</span>
          </span>
        </a>

        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-200"
        >
          <a
            href="#problema"
            className="hover:text-[#F5B400] transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            El Problema
          </a>
          <a
            href="#beneficios"
            className="hover:text-[#F5B400] transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            Beneficios
          </a>
          <a
            href="#comparativa-ahorro"
            className="hover:text-[#F5B400] transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            Comparativa
          </a>
          <a
            href="#precios"
            className="hover:text-[#F5B400] transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            Planes
          </a>
          <a
            href="#preguntas"
            className="hover:text-[#F5B400] transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
          >
            Preguntas
          </a>
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={() => onOpenWhatsAppModal()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#0E8A3E] hover:bg-[#0B7132] text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Cotizar por WhatsApp</span>
          </button>
        </div>
      </div>
    </header>
  );
}
