import { route, hasRoute, type Locale } from './routes';
import { GUIDES, guideById } from '../lib/pages';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<Locale, Record<string, string>> = {
  pt: { home: 'Feriados 2027', method: 'Método', about: 'Quem somos', widget: 'Ferramentas para incorporar', contact: 'Contacto', editorial: 'Política editorial', privacy: 'Privacidade', terms: 'Informação legal', cookies: 'Cookies' },
  en: { home: 'Holidays 2027', method: 'Method', about: 'About', widget: 'Embed the tools', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' },
};
/** `short` : intitulé du menu du haut (un ou deux mots, RECETTE §10.3) ; `label` : intitulé complet. */
export const GROUPS: Array<{ id: Group; label: Record<Locale, string>; short: Record<Locale, string> }> = [
  { id: 'ferramentas', label: { pt: 'Pontes e férias', en: 'Long weekends and leave' }, short: { pt: 'Pontes', en: 'Long weekends' } },
  { id: 'feriados', label: { pt: 'Feriados e calendários', en: 'Holidays and calendars' }, short: { pt: 'Feriados', en: 'Holidays' } },
  { id: 'municipais', label: { pt: 'Feriados municipais', en: 'Municipal holidays' }, short: { pt: 'Municipais', en: 'Municipal' } },
  { id: 'datas', label: { pt: 'Datas do ano', en: 'Dates of the year' }, short: { pt: 'Datas', en: 'Dates' } },
];
export const label = (id: string, lang: Locale) => CORE[lang][id] ?? guideById(id)?.[lang]?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
export const inGroup = (g: Group, lang: Locale): NavLink[] => GUIDES.filter((p) => p.group === g && hasRoute(p.id, lang)).map((p) => link(p.id, lang));
export function navCategories(lang: Locale, short = true): NavCategory[] {
  return GROUPS.map((g) => ({ label: (short ? g.short : g.label)[lang], links: g.id === 'ferramentas' ? [{ ...link('home', lang), label: { pt: 'Pontes 2027', en: 'Long weekends 2027' }[lang] }, ...inGroup(g.id, lang)] : inGroup(g.id, lang) })).filter((c) => c.links.length);
}
/** O Método não está no menu de cima (RECETTE §10.3): debaixo do título e no fundo da página. */
export const navDirect = (_lang: Locale): NavLink[] => [];
export const footerColumns = (lang: Locale): NavCategory[] => {
  const site = { label: { pt: 'Este sítio', en: 'This site' }[lang], links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) };
  return [
    { label: GROUPS[1].label[lang], links: inGroup('feriados', lang) },
    { label: `${GROUPS[2].label[lang]} · ${GROUPS[3].label[lang]}`, links: [...inGroup('municipais', lang), ...inGroup('datas', lang)] },
    { label: GROUPS[0].label[lang], links: [link('home', lang), ...inGroup('ferramentas', lang)] },
    site,
  ];
};
/** As ferramentas, a um clique de cada página (RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => [link('home', lang), ...inGroup('ferramentas', lang)];
