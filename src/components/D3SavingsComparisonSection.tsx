import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ArrowDownRight, ArrowUpRight, BarChart3, MessageCircle, TrendingUp } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { PLANS, PlanId, buildWhatsAppUrl, formatMxn } from '../utils/conversion';
import {
  MonthlyComparisonPoint,
  generateMonthlyComparisonSeries,
} from '../utils/savingsSeries';
import { MascotCharacter } from './MascotCharacter';

interface D3SavingsComparisonSectionProps {
  onSelectPlanForWhatsApp: (planId: PlanId, monthlyInvoices: number) => void;
}

const VOLUME_PRESETS = [
  { value: 100, label: '100/mes · PyME' },
  { value: 350, label: '350/mes · Comercial' },
  { value: 800, label: '800/mes · Multi-RFC' },
  { value: 1500, label: '1,500/mes · Alto vol.' },
];

const FOLIO_COST_PRESETS = [2.5, 3.5, 5.0];

export function D3SavingsComparisonSection({
  onSelectPlanForWhatsApp,
}: D3SavingsComparisonSectionProps) {
  const [monthlyInvoices, setMonthlyInvoices] = useState<number>(350);
  const [costPerFolio, setCostPerFolio] = useState<number>(3.5);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('esencial');
  const [tableView, setTableView] = useState<'monthly' | 'quarterly'>('monthly');
  const [activeMonth, setActiveMonth] = useState<number>(12);

  const chartWrapperRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [chartWidth, setChartWidth] = useState<number>(640);

  const series = useMemo(
    () =>
      generateMonthlyComparisonSeries({
        monthlyInvoices,
        costPerFolioMxn: costPerFolio,
        planId: selectedPlan,
        horizonMonths: 12,
      }),
    [monthlyInvoices, costPerFolio, selectedPlan]
  );

  const activePoint: MonthlyComparisonPoint =
    series.points.find((p) => p.month === activeMonth) ??
    series.points[series.points.length - 1];

  const displayedRows = useMemo(() => {
    if (tableView === 'quarterly') {
      return series.points.filter((p) => p.month % 3 === 0);
    }
    return series.points;
  }, [series.points, tableView]);

  const recommendedSpec = PLANS[series.recommendedPlan];
  const directWaUrl = buildWhatsAppUrl({
    planId: selectedPlan,
    monthlyInvoices,
    source: 'Comparativa Interactiva D3',
  });

  // Measure chart container width smoothly on resize
  useEffect(() => {
    const el = chartWrapperRef.current;
    if (!el) return;

    const updateSize = () => {
      const next = Math.max(300, Math.floor(el.getBoundingClientRect().width));
      setChartWidth(next);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Render D3 interactive cumulative savings chart
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const height = chartWidth < 480 ? 280 : 340;
    const margin = {
      top: 22,
      right: 22,
      bottom: 38,
      left: chartWidth < 480 ? 52 : 66,
    };
    const innerWidth = Math.max(180, chartWidth - margin.left - margin.right);
    const innerHeight = Math.max(140, height - margin.top - margin.bottom);

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${chartWidth} ${height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const maxY = Math.max(
      series.totalTraditionalAnnual,
      series.totalSystemKwAnnual,
      1000
    );

    const xScale = d3.scaleLinear().domain([1, 12]).range([0, innerWidth]);
    const yScale = d3
      .scaleLinear()
      .domain([0, maxY * 1.12])
      .nice()
      .range([innerHeight, 0]);

    // Horizontal gridlines
    const yTicks = yScale.ticks(5);
    g.append('g')
      .attr('class', 'd3-grid')
      .selectAll('line')
      .data(yTicks)
      .join('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', '#DCE8F5')
      .attr('stroke-dasharray', '3,3');

    // Positive net savings shaded delta area (where Traditional > SystemKW)
    const savingsArea = d3
      .area<MonthlyComparisonPoint>()
      .x((d) => xScale(d.month))
      .y0((d) => yScale(Math.min(d.traditionalCumulative, d.systemKwCumulative)))
      .y1((d) =>
        yScale(
          d.traditionalCumulative > d.systemKwCumulative
            ? d.traditionalCumulative
            : d.systemKwCumulative
        )
      )
      .curve(d3.curveMonotoneX);

    const defs = svg.append('defs');
    const areaGrad = defs
      .append('linearGradient')
      .attr('id', 'kwSavingsAreaGrad')
      .attr('x1', '0')
      .attr('y1', '0')
      .attr('x2', '0')
      .attr('y2', '1');
    areaGrad.append('stop').attr('offset', '0%').attr('stop-color', '#0E8A3E').attr('stop-opacity', 0.28);
    areaGrad.append('stop').attr('offset', '100%').attr('stop-color', '#0E8A3E').attr('stop-opacity', 0.04);

    g.append('path')
      .datum(series.points)
      .attr('fill', 'url(#kwSavingsAreaGrad)')
      .attr('d', savingsArea);

    // Traditional folio cost curve
    const traditionalLine = d3
      .line<MonthlyComparisonPoint>()
      .x((d) => xScale(d.month))
      .y((d) => yScale(d.traditionalCumulative))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(series.points)
      .attr('fill', 'none')
      .attr('stroke', '#C2410C')
      .attr('stroke-width', 3)
      .attr('d', traditionalLine);

    // SystemKW flat fixed investment line
    const systemKwLine = d3
      .line<MonthlyComparisonPoint>()
      .x((d) => xScale(d.month))
      .y((d) => yScale(d.systemKwCumulative));

    g.append('path')
      .datum(series.points)
      .attr('fill', 'none')
      .attr('stroke', '#062B5B')
      .attr('stroke-width', 3.5)
      .attr('d', systemKwLine);

    // Break-even vertical guide
    if (series.breakEvenMonthWhole !== null) {
      const beX = xScale(series.breakEvenMonthWhole);
      g.append('line')
        .attr('x1', beX)
        .attr('x2', beX)
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke', '#0E8A3E')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,4');

      g.append('text')
        .attr('x', Math.min(beX + 6, innerWidth - 95))
        .attr('y', 12)
        .attr('fill', '#0D7A36')
        .attr('font-size', '11px')
        .attr('font-weight', '700')
        .attr('font-family', 'JetBrains Mono, monospace')
        .text(`Equilibrio: M${series.breakEvenMonthWhole}`);
    }

    // Axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(chartWidth < 460 ? 6 : 12)
      .tickFormat((d) => `M${Number(d)}`);

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => {
        const val = Number(d);
        if (val === 0) return '$0';
        return val >= 1000 ? `$${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k` : `$${val}`;
      });

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .call((axisG) => {
        axisG.select('.domain').attr('stroke', '#CBD5E1');
        axisG.selectAll('line').attr('stroke', '#CBD5E1');
        axisG
          .selectAll('text')
          .attr('fill', '#334155')
          .attr('font-size', '11px')
          .attr('font-family', 'JetBrains Mono, monospace');
      });

    g.append('g')
      .call(yAxis)
      .call((axisG) => {
        axisG.select('.domain').remove();
        axisG.selectAll('line').remove();
        axisG
          .selectAll('text')
          .attr('fill', '#334155')
          .attr('font-size', '11px')
          .attr('font-family', 'JetBrains Mono, monospace');
      });

    // All monthly dots (subtle)
    g.selectAll('.dot-trad')
      .data(series.points)
      .join('circle')
      .attr('cx', (d) => xScale(d.month))
      .attr('cy', (d) => yScale(d.traditionalCumulative))
      .attr('r', (d) => (d.month === activeMonth ? 6 : 3))
      .attr('fill', (d) => (d.month === activeMonth ? '#C2410C' : '#FFFFFF'))
      .attr('stroke', '#C2410C')
      .attr('stroke-width', 2);

    g.selectAll('.dot-kw')
      .data(series.points)
      .join('circle')
      .attr('cx', (d) => xScale(d.month))
      .attr('cy', (d) => yScale(d.systemKwCumulative))
      .attr('r', (d) => (d.month === activeMonth ? 6 : 3))
      .attr('fill', (d) => (d.month === activeMonth ? '#009FE3' : '#FFFFFF'))
      .attr('stroke', '#062B5B')
      .attr('stroke-width', 2);

    // Active month vertical focus line
    const focusX = xScale(activePoint.month);
    g.append('line')
      .attr('x1', focusX)
      .attr('x2', focusX)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#009FE3')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.8);

    // Interactive pointer overlay for scrubbing months cleanly
    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')
      .on('mousemove click', function (event) {
        const [mx] = d3.pointer(event, this);
        const rawMonth = Math.round(xScale.invert(mx));
        const clamped = Math.max(1, Math.min(12, rawMonth));
        setActiveMonth(clamped);
      });
  }, [series, chartWidth, activeMonth, activePoint]);

  return (
    <section
      id="comparativa-ahorro"
      className="scroll-mt-20 bg-[#F4F8FC] py-16 lg:py-24 border-b border-[#D6E4F2]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-10">
          <p className="text-xs sm:text-sm font-semibold text-[#0284C7] mb-3">
            Análisis financiero acumulado a 12 meses (D3.js)
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#062B5B] mb-4">
            Compara cuánto cuesta seguir pagando folios vs. invertir en SystemKW
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Ajusta tu volumen mensual y el costo promedio por folio de tu proveedor actual. Pasa el
            cursor sobre la gráfica o haz clic en cualquier mes de la tabla para ver el punto exacto
            de recuperación.
          </p>
        </div>

        {/* Executive Controls Bar */}
        <div className="bg-white border border-[#D6E4F2] rounded-2xl p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="d3-monthly-invoices"
                  className="text-sm font-bold text-[#062B5B]"
                >
                  Comprobantes emitidos al mes
                </label>
                <span className="font-mono text-sm font-bold text-[#062B5B] tabular-nums">
                  {monthlyInvoices.toLocaleString('en-US')} / mes
                </span>
              </div>
              <input
                id="d3-monthly-invoices"
                type="range"
                min={30}
                max={2000}
                step={10}
                value={monthlyInvoices}
                onChange={(e) => setMonthlyInvoices(Number(e.target.value))}
                className="w-full accent-[#062B5B] cursor-pointer"
              />
              <div className="flex flex-wrap gap-2" role="group" aria-label="Perfiles de volumen">
                {VOLUME_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      setMonthlyInvoices(preset.value);
                      trackEvent('calculator_preset_click', { monthly_invoices: preset.value });
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      monthlyInvoices === preset.value
                        ? 'bg-[#062B5B] text-[#F5B400] border-[#062B5B]'
                        : 'bg-[#F4F8FC] text-[#062B5B] border-[#D6E4F2] hover:border-[#009FE3]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="d3-folio-cost"
                  className="text-sm font-bold text-[#062B5B]"
                >
                  Costo por folio tradicional
                </label>
                <span className="font-mono text-sm font-bold text-[#C2410C] tabular-nums">
                  ${costPerFolio.toFixed(2)} MXN
                </span>
              </div>
              <input
                id="d3-folio-cost"
                type="range"
                min={1.5}
                max={8.0}
                step={0.5}
                value={costPerFolio}
                onChange={(e) => setCostPerFolio(Number(e.target.value))}
                className="w-full accent-[#C2410C] cursor-pointer"
              />
              <div className="flex flex-wrap gap-2" role="group" aria-label="Costos por folio típicos">
                {FOLIO_COST_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setCostPerFolio(preset);
                      trackEvent('d3_comparison_interact', { folio_cost: preset });
                    }}
                    className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      costPerFolio === preset
                        ? 'bg-[#C2410C] text-white border-[#C2410C]'
                        : 'bg-[#F4F8FC] text-[#062B5B] border-[#D6E4F2] hover:border-[#C2410C]'
                    }`}
                  >
                    ${preset.toFixed(2)}/folio
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <span className="block text-sm font-bold text-[#062B5B]">
                Licencia SystemKW anual
              </span>
              <div className="grid grid-cols-1 gap-2 p-1 bg-[#F4F8FC] rounded-xl border border-[#D6E4F2]">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlan('esencial');
                    trackEvent('calculator_plan_change', { plan_id: 'esencial' });
                  }}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedPlan === 'esencial'
                      ? 'bg-[#062B5B] text-[#F5B400] shadow-sm'
                      : 'text-[#062B5B] hover:bg-white'
                  }`}
                >
                  Plan Esencial ($2,690 + IVA)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlan('corporativo');
                    trackEvent('calculator_plan_change', { plan_id: 'corporativo' });
                  }}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedPlan === 'corporativo'
                      ? 'bg-[#062B5B] text-[#F5B400] shadow-sm'
                      : 'text-[#062B5B] hover:bg-white'
                  }`}
                >
                  Plan Corporativo ($3,990 + IVA)
                </button>
              </div>
            </div>
          </div>

          {/* 4-Metric Financial Summary Row */}
          <div className="mt-7 pt-6 border-t border-[#D6E4F2] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <p className="text-xs font-medium text-slate-600">Gasto en folios (12 meses)</p>
              <p
                data-testid="d3-total-traditional"
                className="font-mono text-2xl font-bold text-[#C2410C] tabular-nums mt-1"
              >
                {formatMxn(series.totalTraditionalAnnual)} MXN
              </p>
              <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                {(monthlyInvoices * 12).toLocaleString('en-US')} timbres pagados uno a uno
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600">Licencia anual {series.planName}</p>
              <p
                data-testid="d3-total-systemkw"
                className="font-mono text-2xl font-bold text-[#062B5B] tabular-nums mt-1"
              >
                {formatMxn(series.totalSystemKwAnnual)} MXN
              </p>
              <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                ${series.effectiveAnnualCostPerCfdi.toFixed(2)} MXN promedio por timbre
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600">Ahorro neto acumulado anual</p>
              <p
                data-testid="d3-net-savings"
                className={`font-mono text-2xl font-bold tabular-nums mt-1 flex items-center gap-1.5 ${
                  series.netAnnualSavings >= 0 ? 'text-[#0D7A36]' : 'text-[#062B5B]'
                }`}
              >
                {series.netAnnualSavings >= 0 ? (
                  <>
                    <ArrowDownRight className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span>{formatMxn(series.netAnnualSavings)} MXN</span>
                  </>
                ) : (
                  <span>Tarifa fija protegida</span>
                )}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Flujo libre retenido en tu empresa
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600">Recuperación y ROI anual</p>
              <p className="font-mono text-2xl font-bold text-[#062B5B] tabular-nums mt-1 flex items-center gap-1.5">
                <TrendingUp className="w-5 h-5 text-[#009FE3] shrink-0" aria-hidden="true" />
                <span>
                  {series.roiPercent > 0 ? `+${series.roiPercent}% ROI` : 'Licencia anual'}
                </span>
              </p>
              <p className="text-xs text-[#0D7A36] font-semibold mt-0.5">
                {series.breakEvenMonthWhole !== null
                  ? `Se paga sola en el Mes ${series.breakEvenMonthWhole}`
                  : 'Timbrado sin tope todo el año'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Interactive Grid: D3 SVG Chart + Synchronized Interactive Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: D3 Cumulative Chart */}
          <div className="lg:col-span-6 bg-white border border-[#D6E4F2] rounded-2xl p-6 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-5 h-5 text-[#062B5B] shrink-0" aria-hidden="true" />
                  <h3 className="font-display font-bold text-lg text-[#062B5B]">
                    Curva acumulada a 12 meses
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-[#C2410C] inline-block" aria-hidden="true" />
                    Cobro por folio
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-[#062B5B] inline-block" aria-hidden="true" />
                    SystemKW fijo
                  </span>
                </div>
              </div>

              {/* Active month readout strip above D3 SVG */}
              <div className="mb-4 px-4 py-3 rounded-xl bg-[#062B5B] text-white flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-mono font-bold text-[#F5B400] tabular-nums">
                  {activePoint.label} ({activePoint.cumulativeInvoices.toLocaleString('en-US')} CFDIs)
                </span>
                <div className="flex flex-wrap items-center gap-4 font-mono tabular-nums">
                  <span>Folios: {formatMxn(activePoint.traditionalCumulative)}</span>
                  <span>SystemKW: {formatMxn(activePoint.systemKwCumulative)}</span>
                  <span
                    className={
                      activePoint.cumulativeSavings >= 0
                        ? 'text-emerald-300 font-bold'
                        : 'text-slate-300'
                    }
                  >
                    {activePoint.cumulativeSavings >= 0
                      ? `Ahorro: +${formatMxn(activePoint.cumulativeSavings)}`
                      : `Saldo: ${formatMxn(activePoint.cumulativeSavings)}`}
                  </span>
                </div>
              </div>

              <div ref={chartWrapperRef} className="w-full" data-testid="d3-chart-container">
                <svg
                  ref={svgRef}
                  role="img"
                  aria-label="Gráfica D3 interactiva comparando el gasto acumulado por folios contra el pago único anual de SystemKW"
                  className="w-full h-auto block select-none"
                />
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-[#D6E4F2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MascotCharacter
                  variant="avatar"
                  alt="Asesor SystemKW recomendando el plan ideal"
                  className="w-11 h-11 rounded-full border border-[#009FE3]/40 shrink-0"
                />
                <div>
                  <p className="text-xs text-slate-600">Recomendación comercial</p>
                  <p className="text-sm font-bold text-[#062B5B]">
                    {recommendedSpec.name} ({recommendedSpec.priceFormatted} + IVA)
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={directWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('whatsapp_cta_click', {
                      location: 'd3_comparison_cta',
                      plan_id: selectedPlan,
                      monthly_invoices: monthlyInvoices,
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-[#0E8A3E] hover:bg-[#0B7132] text-white rounded-xl transition-colors whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>
                    {series.netAnnualSavings > 0
                      ? `Amarrar ahorro de ${formatMxn(series.netAnnualSavings)}`
                      : 'Activar tarifa fija anual'}
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => onSelectPlanForWhatsApp(selectedPlan, monthlyInvoices)}
                  className="px-3.5 py-2.5 text-xs font-semibold text-[#062B5B] border border-[#C6DCF0] hover:border-[#009FE3] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Personalizar envío
                </button>
              </div>
            </div>
          </div>

          {/* Right: Interactive Synchronized Comparison Table */}
          <div className="lg:col-span-6 bg-white border border-[#D6E4F2] rounded-2xl overflow-hidden flex flex-col min-w-0">
            <div className="px-5 py-4 bg-[#062B5B] text-white flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Tabla comparativa mes a mes
                </h3>
                <p className="text-xs text-slate-300">
                  Haz clic en cualquier fila para resaltar ese mes en la gráfica
                </p>
              </div>

              <div
                className="inline-flex p-1 bg-[#041E42] rounded-lg border border-[#123B72]"
                role="group"
                aria-label="Granularidad de la tabla"
              >
                <button
                  type="button"
                  onClick={() => {
                    setTableView('monthly');
                    trackEvent('d3_comparison_interact', { view: 'monthly' });
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    tableView === 'monthly'
                      ? 'bg-[#009FE3] text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  12 Meses
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTableView('quarterly');
                    setActiveMonth(12);
                    trackEvent('d3_comparison_interact', { view: 'quarterly' });
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    tableView === 'quarterly'
                      ? 'bg-[#009FE3] text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Trimestral
                </button>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table
                data-testid="d3-comparison-table"
                className="w-full text-left text-xs sm:text-sm border-collapse"
              >
                <thead>
                  <tr className="border-b border-[#D6E4F2] bg-[#F4F8FC] text-[#062B5B]">
                    <th className="py-3 px-4 font-display font-bold">Mes</th>
                    <th className="py-3 px-3 font-display font-bold text-right">CFDIs</th>
                    <th className="py-3 px-3 font-display font-bold text-right">Folios acum.</th>
                    <th className="py-3 px-3 font-display font-bold text-right">SystemKW</th>
                    <th className="py-3 px-4 font-display font-bold text-right">Ahorro neto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6EFF8]">
                  {displayedRows.map((row) => {
                    const isSelected = row.month === activeMonth;
                    const isPositive = row.cumulativeSavings >= 0;

                    return (
                      <tr
                        key={row.month}
                        onMouseEnter={() => setActiveMonth(row.month)}
                        onClick={() => {
                          setActiveMonth(row.month);
                          trackEvent('d3_comparison_interact', { month: row.month });
                        }}
                        aria-selected={isSelected}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#EBF3FA] text-[#062B5B] font-semibold'
                            : 'bg-white text-slate-700 hover:bg-[#F8FBFE]'
                        }`}
                      >
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-semibold text-[#062B5B] tabular-nums">
                            {row.label}
                          </span>
                          {row.isBreakEvenMonth && (
                            <span className="ml-1.5 text-[11px] font-semibold text-[#0D7A36]">
                              · Equilibrio
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-600">
                          {row.cumulativeInvoices.toLocaleString('en-US')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#C2410C]">
                          {formatMxn(row.traditionalCumulative)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#062B5B]">
                          {formatMxn(row.systemKwCumulative)}
                        </td>
                        <td
                          className={`py-2.5 px-4 text-right font-mono tabular-nums whitespace-nowrap ${
                            isPositive ? 'text-[#0D7A36] font-bold' : 'text-slate-500'
                          }`}
                        >
                          <span className="inline-flex items-center justify-end gap-1">
                            {isPositive ? (
                              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            ) : null}
                            <span>
                              {isPositive ? '+' : ''}
                              {formatMxn(row.cumulativeSavings)}
                            </span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
