/** llms.txt (RECETTE §21), gerado a partir do registo das páginas. */
import { GUIDES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
import { KIT as K } from '../lib/kit';
export function GET() {
  const p10 = K.otimiza(2027, 10);
  const lines = [
    `# ${SITE_NAMES.pt}`, '',
    `> Portuguese public holidays (feriados), long weekends (pontes) and municipal holidays for 2026 to 2028, in European Portuguese and English. National holidays are computed from Labour Code article 234 as amended by Law 8/2016 (13 compulsory holidays); Carnival Tuesday and the municipal holiday are optional under article 235. Regional holidays: Azores Day on Whit Monday (Regional Decree 13/80/A); Madeira on 2 April since 2025 (DLR 17/2024/M), 1 July and 26 December. Sources read on ${K.P.retrieved_at}. Easter by Gauss's formula, cross-checked against the Meeus algorithm. Easter Sunday 2027: ${K.pascoa(2027)}; Corpus Christi 2027: ${K.addDays(K.pascoa(2027), 60)}. The municipal holiday is published for ${K.CONFIRMADOS.length} of the ${K.CONCELHOS.length} municipalities, each read on the council's own website with a link and date; the others are shown as not yet confirmed, never guessed. Leave planner: exact dynamic programming over the year's working blocks; example mainland Portugal 2027, ${p10.ferie} leave days give ${p10.liberi} days off. Everything runs in the browser; nothing entered is sent. Independent site by Radif Partners. Last updated ${LAST_UPDATED}.`, '',
    '## Long-weekend planner / Otimizador de pontes', `- [Feriados e pontes 2027](${SITE_URL}${route('home', 'pt')})`, `- [Holidays and long weekends 2027](${SITE_URL}${route('home', 'en')})`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label.en} / ${g.label.pt}`, ...GUIDES.filter((p) => p.group === g.id).flatMap((p) => [
      `- [${p.pt.nav}](${SITE_URL}${route(p.id, 'pt')}): ${p.pt.card}`,
      `- [${p.en.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.en.card}`,
    ]), '']),
    '## About', `- [Método](${SITE_URL}${route('method', 'pt')})`, `- [Method](${SITE_URL}${route('method', 'en')})`, `- [Quem somos](${SITE_URL}${route('about', 'pt')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
