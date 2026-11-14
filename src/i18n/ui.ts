import type { Locale } from './routes';
const pt = {
  updatedOn: 'Atualizado em', editorialPolicy: 'Política editorial', contactLabel: 'Contacto', reviewedBy: 'Preparado por',
  skipToContent: 'Ir para o conteúdo', mainNav: 'Navegação principal', breadcrumbLabel: 'Percurso', breadcrumbHome: 'Início', menuOpen: 'Abrir o menu',
  faqTitle: 'Perguntas frequentes', relatedCalculators: 'Para continuar', sourcesTitle: 'Fontes oficiais desta página', writtenBy: 'Preparado por',
  asOf: 'Atualizado a', lastUpdated: 'Lista dos feriados (Código do Trabalho, art. 234.º e 235.º) e feriados municipais verificados em', footerValidated: 'Fontes: Código do Trabalho, art. 234.º a 239.º; Decreto Regional n.º 13/80/A (Açores); Decretos Legislativos Regionais n.º 18/2002/M e 17/2024/M (Madeira); sítios das câmaras municipais',
  footerBrowser: 'Tudo corre no seu navegador · nada do que escreve é enviado ou guardado · sem conta',
  footerDisclaimer: 'Sítio independente publicado pela Radif Partners, sem ligação ao Governo, a um ministério, a uma região autónoma ou a uma câmara municipal. O seu contrato ou convenção coletiva pode dar outros dias de folga; o sítio não substitui um aconselhamento.',
  footerPopular: 'Ferramentas',
  notFound: 'Não há nenhuma página neste endereço. Na página inicial encontra o feriado municipal do seu concelho, as pontes de 2027 e o calendário.',
  readMore: 'Continuar a ler',
  moreOptions: 'Mais opções', moreOptionsHint: 'tem algum destes dias livres?', copyLink: 'Copiar a ligação', copied: 'Ligação copiada', print: 'Imprimir', howComputed: 'Como se calcula', openFull: 'Abrir a ferramenta completa',
  countdownTo: 'Faltam para', days: 'dias', hours: 'h', minutes: 'min', seconds: 's', tzNote: 'Contagem feita com a hora do seu telemóvel ou computador.', passed: 'Esta data já passou.',
};
const en: typeof pt = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Prepared by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Common questions', relatedCalculators: 'Keep going', sourcesTitle: 'Official sources for this page', writtenBy: 'Prepared by',
  asOf: 'As of', lastUpdated: 'List of holidays (Labour Code, art. 234 and 235) and municipal holidays checked on', footerValidated: 'Sources: Labour Code, art. 234 to 239; Regional Decree 13/80/A (Azores); Regional Legislative Decrees 18/2002/M and 17/2024/M (Madeira); municipal council websites',
  footerBrowser: 'Everything runs in your browser · nothing you type is sent or stored · no account',
  footerDisclaimer: 'Independent site published by Radif Partners, not affiliated with the Portuguese government, any ministry, autonomous region or municipal council. Your contract or collective agreement may give other days off; this site does not replace professional advice.',
  footerPopular: 'Tools',
  notFound: 'Nothing lives at this address. The home page has your municipality\'s holiday, the 2027 long weekends and the calendar.',
  readMore: 'Read more',
  moreOptions: 'More options', moreOptionsHint: 'do you have any of these days off?', copyLink: 'Copy share link', copied: 'Link copied', print: 'Print', howComputed: 'How this is calculated', openFull: 'Open the full tool',
  countdownTo: 'Time left until', days: 'days', hours: 'hrs', minutes: 'min', seconds: 'sec', tzNote: 'Counted with your phone or computer clock.', passed: 'This date has passed.',
};
const ALL = { pt, en };
export function t(lang: Locale) { return ALL[lang] ?? pt; }
