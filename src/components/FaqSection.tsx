import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/landingContent';
import { trackEvent } from '../utils/analytics';

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleItem = (id: string) => {
    const nextOpen = openId !== id;
    setOpenId(nextOpen ? id : null);
    trackEvent('faq_toggle', {
      faq_id: id,
      action: nextOpen ? 'expand' : 'collapse',
    });
  };

  return (
    <section
      id="preguntas"
      className="scroll-mt-20 bg-[#F4F8FC] py-16 lg:py-24 border-b border-[#D6E4F2]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <p className="text-xs sm:text-sm font-semibold text-[#0284C7] mb-3">
            Resolvemos tus dudas antes de cambiar de sistema
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#062B5B]">
            Las 5 preguntas clave antes de activar SystemKW
          </h2>
        </div>

        <div className="divide-y divide-[#D6E4F2] border border-[#D6E4F2] rounded-2xl bg-white overflow-hidden">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${item.id}-panel`}
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-[#F4F8FC] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#062B5B]"
                >
                  <span className="font-display font-semibold text-base sm:text-lg text-[#062B5B]">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#009FE3]' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div
                    id={`${item.id}-panel`}
                    className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
