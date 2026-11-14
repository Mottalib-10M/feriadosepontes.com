/** Blocos de conteúdo calculados, partilhados por várias páginas (tabelas: fora do controlo de unicidade). */
import type { Helpers } from './page-types';
import { feriados, fromIso, weekday, dataRegra, emDiaUtil, type Local } from './engine/feriados';
import { pontes, otimiza, diasUteis } from './engine/pontes';
import { CONFIRMADOS, REGIAO_NOME, type Concelho } from './engine/concelhos';
import { dLong, dShort, span, wdLong, feriadoName, MESES } from './tool-specs';

const tipo = (h: Helpers, t: string) => ({ nacional: h.T('nacional', 'national'), facultativo: h.T('facultativo', 'optional'), regional: h.T('regional', 'regional'), municipal: h.T('municipal', 'municipal') } as Record<string, string>)[t] ?? t;
const onde = (h: Helpers, c: Local | null) => (c ? h.T(`em ${c.nome}`, `in ${c.nome}`) : h.T('em Portugal', 'in Portugal'));

/** Todos os feriados de um ano, com o dia da semana. */
export function tabelaAno(h: Helpers, y: number, c: Local | null = null, carnaval = false) {
  const rows = feriados(y, { local: c, carnaval }).map((f) => [dLong(f.date, h.lang), wdLong(f.date, h.lang), f.name[h.lang], tipo(h, f.tipo)]);
  return h.table([h.T('Data', 'Date'), h.T('Dia', 'Day'), h.T('Feriado', 'Holiday'), h.T('Tipo', 'Type')], rows, h.T(`Feriados ${y} ${onde(h, c)}`, `Public holidays ${y} ${onde(h, c)}`));
}
/** As melhores pontes de um ano. */
export function tabelaPontes(h: Helpers, y: number, c: Local | null = null, max = 8) {
  const rows = pontes(y, { local: c }).slice(0, max).map((b) => [span(b.ferieDal, b.ferieAl, h.lang), b.ferie, span(b.liberoDal, b.liberoAl, h.lang), b.liberi, b.feste.map((id) => feriadoName(id, h.lang, c as Concelho | null)).join(', ')]);
  return h.table([h.T('Tirar férias', 'Take leave'), h.T('Dias de férias', 'Leave days'), h.T('Período livre', 'Time off'), h.T('Dias livres', 'Days off'), h.T('Feriado', 'Holiday')], rows, h.T(`As melhores pontes de ${y} ${onde(h, c)}`, `Best long weekends ${y} ${onde(h, c)}`), ['l', 'r', 'l', 'r', 'l']);
}
/** Dias livres no total com 5, 10 e 15 dias de férias, ano a ano. */
export function tabelaRendimento(h: Helpers, anos: number[], c: Local | null = null) {
  const rows = anos.map((y) => [String(y), ...[5, 10, 15].map((b) => otimiza(y, b, { local: c }).liberi)]);
  return h.table([h.T('Ano', 'Year'), h.T('5 dias de férias', '5 leave days'), h.T('10 dias de férias', '10 leave days'), h.T('15 dias de férias', '15 leave days')], rows, h.T('Dias livres no total, somando as pontes, com a melhor distribuição das férias', 'Total days off across the long weekends, with the best spread of leave'), ['l', 'r', 'r', 'r']);
}
/** Os feriados nacionais de três anos, uma linha por feriado. */
export function tabelaTresAnos(h: Helpers, anos = [2026, 2027, 2028]) {
  const by = anos.map((y) => new Map(feriados(y).map((f) => [f.id, f.date])));
  const ids = feriados(anos[0]).map((f) => f.id);
  const rows = ids.map((id) => [feriadoName(id, h.lang), ...by.map((m) => dShort(m.get(id)!, h.lang))]);
  return h.table([h.T('Feriado', 'Holiday'), ...anos.map(String)], rows, h.T(`Feriados nacionais ${anos[0]}-${anos[anos.length - 1]}`, `National holidays ${anos[0]}-${anos[anos.length - 1]}`));
}
/** Dias úteis por mês em vários anos. */
export function tabelaDiasUteis(h: Helpers, anos: number[]) {
  const by = anos.map((y) => diasUteis(y));
  const rows: Array<Array<string | number>> = MESES(h.lang).map((m, i) => [m, ...by.map((x) => x[i])]);
  rows.push([h.T('<strong>Total</strong>', '<strong>Total</strong>'), ...by.map((x) => `<strong>${h.n(x.reduce((a, b) => a + b, 0))}</strong>`)]);
  return h.table([h.T('Mês', 'Month'), ...anos.map(String)], rows, h.T('Dias úteis de segunda a sexta, sem feriado municipal (continente)', 'Working days Monday to Friday, without a municipal holiday (mainland)'), ['l', 'r', 'r', 'r']);
}
/** Os feriados municipais confirmados, por ordem alfabética, numa linha cada (testeurs naïfs du 2026-11-14, tour 3 :
 *  fiches de 5 lignes triées par date, « interminable », « impossible de retrouver ma commune »). Deux colonnes : le
 *  tableau ne s'empile pas sur téléphone ; le nom du concelho est le lien vers la page de la câmara (la source). */
export function tabelaMunicipais(h: Helpers, y: number, list: Concelho[] = CONFIRMADOS) {
  const rows = [...list].sort((a, b) => a.nome.localeCompare(b.nome, 'pt')).map((c) => {
    const d = dataRegra(y, c.feriado!.regra);
    const ilha = c.regiao === 'continente' ? '' : ` (${REGIAO_NOME[c.regiao][h.lang]})`;
    return [`<a class="underline" href="${c.feriado!.url}" rel="nofollow noopener" target="_blank">${c.nome.replace(/ \((Açores|Madeira)\)$/, '')}</a>${ilha}`, dShort(d, h.lang)];
  });
  return h.table([h.T('Concelho', 'Municipality'), h.T(`Feriado em ${y}`, `Holiday in ${y}`)], rows, h.T(`Feriados municipais ${y}: os ${list.length} concelhos confirmados no sítio da câmara, de A a Z`, `Municipal holidays ${y}: the ${list.length} municipalities confirmed on the council website, A to Z`));
}
/** Mês a mês: dias, fins de semana, feriados em dia útil, dias úteis. */
export function tabelaMeses(h: Helpers, y: number) {
  const du = diasUteis(y);
  const fs = emDiaUtil(feriados(y));
  const rows = MESES(h.lang).map((m, i) => {
    const a = Date.UTC(y, i, 1) / 864e5, b = Date.UTC(y, i + 1, 1) / 864e5;
    let we = 0; for (let d = a; d < b; d++) if (weekday(d) % 6 === 0) we++;
    return [m, b - a, we, fs.filter((f) => Number(f.date.slice(5, 7)) === i + 1).length, du[i]];
  });
  return h.table([h.T('Mês', 'Month'), h.T('Dias', 'Days'), h.T('Sábados e domingos', 'Weekend days'), h.T('Feriados em dia útil', 'Weekday holidays'), h.T('Dias úteis', 'Working days')], rows, h.T(`${y} mês a mês (continente)`, `${y} month by month (mainland)`), ['l', 'r', 'r', 'r', 'r']);
}
export const diaUtil = (iso: string) => weekday(fromIso(iso)) % 6 !== 0;
