import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, Copy, MessageCircle, X } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import {
  PLANS,
  PlanId,
  WHATSAPP_DISPLAY,
  buildWhatsAppUrl,
  validateLeadForm,
} from '../utils/conversion';
import { MascotCharacter } from './MascotCharacter';

interface WhatsAppDrawerProps {
  isOpen: boolean;
  initialPlanId: PlanId;
  initialMonthlyInvoices: number;
  onClose: () => void;
}

export function WhatsAppDrawer({
  isOpen,
  initialPlanId,
  initialMonthlyInvoices,
  onClose,
}: WhatsAppDrawerProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(initialPlanId);
  const [companyName, setCompanyName] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [monthlyInvoices, setMonthlyInvoices] = useState(
    initialMonthlyInvoices > 0 ? String(initialMonthlyInvoices) : '200'
  );
  const [errors, setErrors] = useState<{
    companyName?: string;
    contactValue?: string;
    monthlyInvoices?: string;
  }>({});
  const [submitted, setSubmitted] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  useEffect(() => {
    setSelectedPlan(initialPlanId);
    if (initialMonthlyInvoices > 0) {
      setMonthlyInvoices(String(initialMonthlyInvoices));
    }
    setSubmitted(false);
    setErrors({});
  }, [initialPlanId, initialMonthlyInvoices, isOpen]);

  if (!isOpen) {
    return null;
  }

  const parsedVolume = Number(monthlyInvoices) || 0;
  const generatedUrl = buildWhatsAppUrl({
    planId: selectedPlan,
    companyName,
    monthlyInvoices: parsedVolume > 0 ? parsedVolume : undefined,
    source: 'Asistente de Activación',
  });

  const plainMessage = decodeURIComponent(generatedUrl.split('?text=')[1] || '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateLeadForm({
      companyName,
      contactValue,
      monthlyInvoices,
    });
    if (!validation.valid) {
      setErrors(validation.errors);
      setSubmitted(false);
      return;
    }
    setErrors({});
    setSubmitted(true);
    trackEvent('whatsapp_drawer_submit', {
      plan_id: selectedPlan,
      monthly_invoices: parsedVolume,
    });
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(plainMessage);
      setCopiedMsg(true);
      trackEvent('copy_whatsapp_message', { plan_id: selectedPlan });
      setTimeout(() => setCopiedMsg(false), 2500);
    } catch {
      setCopiedMsg(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#041E42]/80 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-modal-title"
    >
      <div className="w-full max-w-lg bg-white text-[#062B5B] rounded-2xl border border-[#C6DCF0] shadow-2xl overflow-hidden">
        <div className="px-6 py-5 bg-[#062B5B] text-white flex items-center justify-between gap-4 border-b border-[#123B72]">
          <div className="flex items-center gap-3.5">
            <MascotCharacter
              variant="avatar"
              alt="Asesor SystemKW"
              className="w-12 h-12 rounded-xl border border-[#F5B400] shrink-0"
            />
            <div>
              <h2 id="whatsapp-modal-title" className="font-display font-bold text-xl">
                Activar System<span className="text-[#38BDF8]">KW</span> por WhatsApp
              </h2>
              <p className="text-xs text-[#F5B400] mt-0.5">
                Atención directa en el {WHATSAPP_DISPLAY} · Instalación gratuita
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar asistente de WhatsApp"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#123B72] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          <div>
            <span className="block text-xs font-semibold text-slate-600 mb-2">
              Plan seleccionado
            </span>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#F4F8FC] rounded-xl border border-[#D6E4F2]">
              <button
                type="button"
                onClick={() => {
                  setSelectedPlan('esencial');
                  setSubmitted(false);
                }}
                className={`py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedPlan === 'esencial'
                    ? 'bg-[#062B5B] text-[#F5B400] shadow-sm'
                    : 'text-[#062B5B] hover:bg-white'
                }`}
              >
                Esencial ($2,690 + IVA)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlan('corporativo');
                  setSubmitted(false);
                }}
                className={`py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedPlan === 'corporativo'
                    ? 'bg-[#062B5B] text-[#F5B400] shadow-sm'
                    : 'text-[#062B5B] hover:bg-white'
                }`}
              >
                Corporativo ($3,990 + IVA)
              </button>
            </div>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="lead-company"
                  className="block text-sm font-semibold text-[#062B5B] mb-1"
                >
                  Nombre de tu empresa o razón social
                </label>
                <input
                  id="lead-company"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ej. Comercializadora del Valle SA"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#C6DCF0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                />
                {errors.companyName && (
                  <p role="alert" className="text-xs font-medium text-red-700 mt-1">
                    {errors.companyName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="lead-contact"
                    className="block text-sm font-semibold text-[#062B5B] mb-1"
                  >
                    Tu WhatsApp o correo
                  </label>
                  <input
                    id="lead-contact"
                    type="text"
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    placeholder="55 1234 5678"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#C6DCF0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                  />
                  {errors.contactValue && (
                    <p role="alert" className="text-xs font-medium text-red-700 mt-1">
                      {errors.contactValue}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lead-volume"
                    className="block text-sm font-semibold text-[#062B5B] mb-1"
                  >
                    Facturas aprox. al mes
                  </label>
                  <input
                    id="lead-volume"
                    type="number"
                    min={1}
                    value={monthlyInvoices}
                    onChange={(e) => setMonthlyInvoices(e.target.value)}
                    placeholder="200"
                    className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums border border-[#C6DCF0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                  />
                  {errors.monthlyInvoices && (
                    <p role="alert" className="text-xs font-medium text-red-700 mt-1">
                      {errors.monthlyInvoices}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="submit"
                  className="w-full py-3.5 px-5 text-sm font-bold bg-[#062B5B] hover:bg-[#041E42] text-white rounded-xl transition-colors cursor-pointer"
                >
                  Preparar mi solicitud y abrir WhatsApp
                </button>
                <a
                  href={generatedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('whatsapp_cta_click', {
                      location: 'drawer_direct',
                      plan_id: selectedPlan,
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 text-sm font-bold bg-[#0E8A3E] hover:bg-[#0B7132] text-white rounded-xl transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Ir directo a WhatsApp ({WHATSAPP_DISPLAY})</span>
                </a>
              </div>
            </form>
          ) : (
            <div data-testid="whatsapp-ready-state" className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2
                  className="w-5 h-5 text-[#0E8A3E] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-bold text-[#062B5B]">
                    Solicitud lista para {companyName.trim()}
                  </p>
                  <p className="text-xs text-slate-700 mt-0.5">
                    {PLANS[selectedPlan].name} ({PLANS[selectedPlan].priceFormatted} + IVA) ·{' '}
                    {parsedVolume > 0 ? `${parsedVolume} facturas/mes` : 'Timbrado ilimitado'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#F4F8FC] border border-[#D6E4F2] text-xs text-slate-700 leading-relaxed">
                {plainMessage}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={generatedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('whatsapp_cta_click', {
                      location: 'drawer_ready',
                      plan_id: selectedPlan,
                      monthly_invoices: parsedVolume,
                    })
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 text-sm font-bold bg-[#0E8A3E] hover:bg-[#0B7132] text-white rounded-xl transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Enviar ahora al {WHATSAPP_DISPLAY}</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-semibold text-[#062B5B] border border-[#C6DCF0] hover:border-[#009FE3] rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{copiedMsg ? 'Copiado' : 'Copiar texto'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
