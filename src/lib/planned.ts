/** Todas as páginas previstas (id = nome do ficheiro de src/content/guides, ou id de uma entrada de um ficheiro com várias páginas). */
export const PLANNED_GUIDES = [
  'pontes-2026', 'pontes-2028', 'ferias', 'dias-uteis-2027',
  'feriados-2026', 'feriados-2028', 'calendario-2027', 'corpo-de-deus-2027',
  'feriado-municipal', 'santos-populares', 'acores-madeira', 'feriado-lisboa', 'feriado-porto',
  'pascoa-2027', 'carnaval-2027',
];
export const PLANNED_IDS = new Set<string>([...PLANNED_GUIDES, 'home', 'method', 'about', 'widget', 'contact', 'editorial', 'privacy', 'terms', 'cookies']);
