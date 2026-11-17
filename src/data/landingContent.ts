export const HERO_IMAGE = '/src/assets/images/hero_systemkw_cfdi_1794923402213.jpg';
export const PAIN_IMAGE = '/src/assets/images/pain_fiscal_stress_1794923403868.jpg';
export const SOLUTION_IMAGE = '/src/assets/images/solution_modern_control_1794923403694.jpg';

export interface ProofMetric {
  value: string;
  label: string;
  detail: string;
}

export const HERO_PROOF_METRICS: ProofMetric[] = [
  {
    value: '$0 MXN',
    label: 'Costo por folio extra',
    detail: 'Emite 50 o 5,000 CFDIs sin recargos',
  },
  {
    value: 'CFDI 4.0',
    label: 'Validación SAT al día',
    detail: 'Regímenes, códigos postales y uso CFDI',
  },
  {
    value: '< 30 min',
    label: 'Instalación remota',
    detail: 'Lista para timbrar el mismo día',
  },
  {
    value: '55 3566 0861',
    label: 'WhatsApp directo',
    detail: 'Sin bots ni tickets eternos',
  },
];

export interface PainPoint {
  index: string;
  title: string;
  description: string;
  impact: string;
}

export const PAIN_POINTS: PainPoint[] = [
  {
    index: '01.',
    title: 'La trampa silenciosa de pagar por cada timbre',
    description:
      'Cada factura, cada nota de crédito y cada complemento de pago te descuenta dinero. Cuando tu negocio crece, tu proveedor de timbres te castiga cobrándote más.',
    impact: 'Hasta $9,600 MXN perdidos al año en paquetes de folios',
  },
  {
    index: '02.',
    title: 'Bloqueos a fin de mes y cierres detenidos',
    description:
      'Viernes 6:00 p.m., cierre de quincena y un cliente esperando su factura para liberar tu pago... pero el sistema te avisa que te quedaste sin timbres disponibles.',
    impact: 'Cobranzas retrasadas y clientes molestos',
  },
  {
    index: '03.',
    title: 'Terror a los errores del CFDI 4.0 y rechazos del SAT',
    description:
      'Códigos postales mal validados, claves de producto confusas y portales lentos que parecen diseñados en 2005 obligan a tu equipo a perder horas corrigiendo cancelaciones.',
    impact: '3 a 5 horas semanales desperdiciadas en retrabajo',
  },
];

export interface SolutionPillar {
  index: string;
  title: string;
  description: string;
}

export const SOLUTION_PILLARS: SolutionPillar[] = [
  {
    index: '01.',
    title: 'Tarifa fija anual. Timbra todo lo que vendas.',
    description:
      'Olvídate de contar folios o comprar recargas de emergencia. Con SystemKW emites facturas, recibos de pago y notas de crédito sin límite real.',
  },
  {
    index: '02.',
    title: 'Blindaje automático contra errores CFDI 4.0.',
    description:
      'Validación previa de RFC, régimen fiscal y código postal antes de timbrar para evitar cancelaciones costosas y rechazos ante el SAT.',
  },
  {
    index: '03.',
    title: 'Control total en una pantalla limpia.',
    description:
      'Encuentra cualquier XML o PDF en segundos, envía comprobantes por correo en un clic y visualiza tu facturación del mes al instante.',
  },
];

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  outcome: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      'Antes gastábamos más de $1,100 al mes en paquetes de folios entre dos sucursales. Cambiamos al Plan Corporativo en una tarde y recuperamos la inversión antes del cuarto mes.',
    author: 'Carlos Mendoza',
    role: 'Director Administrativo',
    company: 'Ferretería Industrial del Bajío',
    outcome: '-68% gasto anual en facturación',
  },
  {
    quote:
      'Lo que más valoramos es que cuando tenemos duda en un complemento de pago nos responden directo por WhatsApp en minutos, no con un robot.',
    author: 'Lic. Mariana Salgado',
    role: 'Socia Contable',
    company: 'Despacho Salgado & Asociados CDMX',
    outcome: '14 empresas timbrando sin límites',
  },
];

export interface BenefitCard {
  index: string;
  title: string;
  summary: string;
  bullets: string[];
  highlight?: boolean;
}

export const BENEFITS: BenefitCard[] = [
  {
    index: '01.',
    title: 'Timbrado Ilimitado Real (Cero Folios)',
    summary:
      'Factura 20, 400 o 3,000 comprobantes al mes sin pagar un peso adicional ni preocuparte por caducidad de timbres.',
    bullets: [
      'Facturas de ingreso, egreso y traslados sin tope mensual',
      'Complementos de pago (REP 2.0) ilimitados para cobranza a crédito',
      'Cero penalizaciones por crecer tu volumen de ventas',
    ],
    highlight: true,
  },
  {
    index: '02.',
    title: 'Interfaz Intuitiva en 3 Clics',
    summary:
      'Diseñada para dueños, vendedores y auxiliares administrativos que quieren facturar rápido sin menús laberínticos.',
    bullets: [
      'Catálogo inteligente de clientes y claves SAT frecuentes',
      'Envío automático de PDF + XML al correo de tu cliente',
    ],
  },
  {
    index: '03.',
    title: 'Instalación y Puesta en Marcha Gratis',
    summary:
      'No te dejamos solo con un manual en PDF. Nuestro equipo técnico configura tu CSD, logos y series en sesión remota.',
    bullets: [
      'Configuración completa de sellos digitales (CSD) incluida',
      'Capacitación exprés de 20 minutos para tu equipo',
    ],
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-sat',
    question: '¿Qué pasa si el SAT cambia las reglas o actualiza el esquema del CFDI 4.0?',
    answer:
      'Todas las actualizaciones obligatorias ante el SAT están cubiertas dentro de tu licencia anual. Cuando hay cambios en catálogos, complementos de pago o esquemas de cancelación, actualizamos SystemKW para que sigas timbrando sin pagar desarrollos extra.',
  },
  {
    id: 'faq-ilimitado',
    question: '¿De verdad es timbrado ilimitado o hay letras chiquitas después de cierto número de facturas?',
    answer:
      'Es ilimitado de verdad para la operación comercial de tu empresa. No vendemos paquetes ocultos ni te cortamos el servicio a mitad de mes. Tu inversión anual fija ($2,690 en Esencial o $3,990 en Corporativo) cubre todas tus facturas y complementos.',
  },
  {
    id: 'faq-migracion',
    question: 'Ya facturo con otro PAC o sistema tradicional, ¿pierdo mis clientes o es difícil migrar?',
    answer:
      'No pierdes nada. Cargamos tus sellos digitales vigentes (CSD) e importamos tu catálogo de clientes y productos desde Excel o XML en la misma sesión de instalación gratuita. En menos de 30 minutos estás emitiendo desde SystemKW.',
  },
  {
    id: 'faq-curva',
    question: 'No soy contador ni experto en sistemas, ¿qué tan complicado es aprender a usarlo?',
    answer:
      'SystemKW elimina los menús técnicos innecesarios. Seleccionas al cliente, agregas el concepto y presionas Timbrar. Además, durante tu instalación remota gratuita capacitamos a la persona encargada para que emita su primera factura real en vivo.',
  },
  {
    id: 'faq-soporte',
    question: 'Si tengo un problema urgente con una factura o sello digital, ¿quién me atiende?',
    answer:
      'Te atiende un especialista humano directamente por WhatsApp en el 55 3566 0861. Nada de levantar tickets que tardan 72 horas mientras tu cliente espera su factura para pagarte.',
  },
];
