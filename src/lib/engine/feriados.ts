/**
 * Feriados em Portugal, calculados e não copiados.
 *
 * - Feriados obrigatórios: Código do Trabalho, art. 234.º, n.º 1 (redação da Lei n.º 8/2016, de 1 de abril, que repôs
 *   Corpo de Deus, 5 de outubro, 1 de novembro e 1 de dezembro): 13 dias.
 * - Feriados facultativos: art. 235.º, n.º 1 — terça-feira de Carnaval e feriado municipal da localidade, observados só
 *   por instrumento de regulamentação coletiva ou contrato de trabalho.
 * - Feriados regionais: Açores, segunda-feira do Espírito Santo (Dia da Região, Páscoa + 50); Madeira, 2 de abril
 *   (Dia da Autonomia, Decreto Legislativo Regional n.º 17/2024/M, desde 2025), 1 de julho (Dia da Região) e 26 de
 *   dezembro (Primeira Oitava, DLR n.º 18/2002/M).
 * - Páscoa: cômputo gregoriano (forma de Gauss), confirmado contra o algoritmo de Meeus nos testes.
 * - Um feriado que calhe ao sábado ou ao domingo não passa para outro dia (o art. 234.º, n.º 3, só o permite por lei
 *   específica, que não existe hoje).
 */

const MS = 86400000;
export const dayNum = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d) / MS;
export const fromIso = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return dayNum(y, m, d); };
export const toIso = (n: number) => new Date(n * MS).toISOString().slice(0, 10);
/** 0 = domingo … 6 = sábado */
export const weekday = (n: number) => new Date(n * MS).getUTCDay();
export const isWeekend = (n: number) => { const w = weekday(n); return w === 0 || w === 6; };
export const addDays = (iso: string, d: number) => toIso(fromIso(iso) + d);

/** Domingo de Páscoa, cômputo gregoriano na forma de Gauss. */
export function pascoa(x: number): string {
  const K = Math.floor(x / 100);
  const M = 15 + Math.floor((3 * K + 3) / 4) - Math.floor((8 * K + 13) / 25);
  const S = 2 - Math.floor((3 * K + 3) / 4);
  const A = x % 19;
  const D = (19 * A + M) % 30;
  const R = Math.floor((D + Math.floor(A / 11)) / 29);
  const OG = 21 + D - R;
  const SZ = 7 - ((x + Math.floor(x / 4) + S) % 7);
  const OE = 7 - (((OG - SZ) % 7) + 7) % 7;
  return toIso(dayNum(x, 3, 1) + OG + OE - 1);
}
/** Segunda via independente (Meeus/Jones/Butcher), usada nos testes. */
export function pascoaMeeus(y: number): string {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return toIso(dayNum(y, month, day));
}
/** n-ésimo dia da semana do mês (n = −1: último). wd 0 = domingo. */
export function nthWeekday(y: number, m: number, wd: number, n: number): string {
  if (n > 0) { const first = dayNum(y, m, 1); return toIso(first + ((wd - weekday(first) + 7) % 7) + 7 * (n - 1)); }
  const last = dayNum(y, m + 1, 1) - 1; return toIso(last - ((weekday(last) - wd + 7) % 7));
}

export type Regiao = 'continente' | 'acores' | 'madeira';
export type Tipo = 'nacional' | 'facultativo' | 'regional' | 'municipal';
export interface FeriadoDef { id: string; name: { pt: string; en: string }; date: (y: number) => string; tipo: Tipo; regiao?: Regiao; desde?: number; domingo?: boolean }
const fix = (m: number, d: number) => (y: number) => toIso(dayNum(y, m, d));
const P = (o: number) => (y: number) => addDays(pascoa(y), o);

export const NACIONAIS: FeriadoDef[] = [
  { id: 'ano-novo', name: { pt: 'Ano Novo', en: "New Year's Day" }, date: fix(1, 1), tipo: 'nacional' },
  { id: 'sexta-santa', name: { pt: 'Sexta-Feira Santa', en: 'Good Friday' }, date: P(-2), tipo: 'nacional' },
  { id: 'pascoa', name: { pt: 'Domingo de Páscoa', en: 'Easter Sunday' }, date: pascoa, tipo: 'nacional', domingo: true },
  { id: 'liberdade', name: { pt: 'Dia da Liberdade (25 de Abril)', en: 'Freedom Day (25 April)' }, date: fix(4, 25), tipo: 'nacional' },
  { id: 'trabalhador', name: { pt: 'Dia do Trabalhador', en: 'Labour Day' }, date: fix(5, 1), tipo: 'nacional' },
  { id: 'corpo-deus', name: { pt: 'Corpo de Deus', en: 'Corpus Christi' }, date: P(60), tipo: 'nacional' },
  { id: 'portugal', name: { pt: 'Dia de Portugal, de Camões e das Comunidades', en: 'Portugal Day (10 June)' }, date: fix(6, 10), tipo: 'nacional' },
  { id: 'assuncao', name: { pt: 'Assunção de Nossa Senhora', en: 'Assumption Day' }, date: fix(8, 15), tipo: 'nacional' },
  { id: 'republica', name: { pt: 'Implantação da República', en: 'Republic Day (5 October)' }, date: fix(10, 5), tipo: 'nacional' },
  { id: 'todos-santos', name: { pt: 'Dia de Todos os Santos', en: "All Saints' Day" }, date: fix(11, 1), tipo: 'nacional' },
  { id: 'restauracao', name: { pt: 'Restauração da Independência', en: 'Restoration of Independence (1 December)' }, date: fix(12, 1), tipo: 'nacional' },
  { id: 'imaculada', name: { pt: 'Imaculada Conceição', en: 'Immaculate Conception' }, date: fix(12, 8), tipo: 'nacional' },
  { id: 'natal', name: { pt: 'Natal', en: 'Christmas Day' }, date: fix(12, 25), tipo: 'nacional' },
];
export const CARNAVAL: FeriadoDef = { id: 'carnaval', name: { pt: 'Terça-feira de Carnaval', en: 'Carnival Tuesday' }, date: P(-47), tipo: 'facultativo' };
export const REGIONAIS: FeriadoDef[] = [
  { id: 'dia-acores', name: { pt: 'Dia da Região Autónoma dos Açores', en: 'Azores Day' }, date: P(50), tipo: 'regional', regiao: 'acores' },
  { id: 'autonomia-madeira', name: { pt: 'Dia da Autonomia da Madeira', en: 'Madeira Autonomy Day' }, date: fix(4, 2), tipo: 'regional', regiao: 'madeira', desde: 2025 },
  { id: 'dia-madeira', name: { pt: 'Dia da Região Autónoma da Madeira', en: 'Madeira Day' }, date: fix(7, 1), tipo: 'regional', regiao: 'madeira' },
  { id: 'oitava-madeira', name: { pt: 'Primeira Oitava (26 de dezembro)', en: 'Boxing Day in Madeira (Primeira Oitava)' }, date: fix(12, 26), tipo: 'regional', regiao: 'madeira' },
];

/** Regra do feriado municipal: 'MM-DD' (data fixa), 'P+N' (dias depois do Domingo de Páscoa) ou
 *  'N:MM:k:wd:+d' (k-ésimo dia da semana wd do mês MM, mais d dias; k = −1: último). */
export type Regra = string;
export function dataRegra(y: number, r: Regra): string {
  let m = /^P([+-]\d+)$/.exec(r);
  if (m) return addDays(pascoa(y), Number(m[1]));
  m = /^N:(\d{2}):(-?\d):(\d):\+(\d)$/.exec(r);
  if (m) return addDays(nthWeekday(y, Number(m[1]), Number(m[3]), Number(m[2])), Number(m[4]));
  if (!/^\d{2}-\d{2}$/.test(r)) throw new Error(`regra inválida: ${r}`);
  return `${y}-${r}`;
}

export interface Local { nome: string; regiao: Regiao; feriado?: { regra: Regra; nome: string } | null }
export interface Feriado { id: string; date: string; name: { pt: string; en: string }; tipo: Tipo }
export interface Opcoes { local?: Local | null; carnaval?: boolean }

/** Os feriados de um ano, por ordem de data: os 13 nacionais, os regionais do arquipélago do concelho, e — se pedidos —
 *  a terça de Carnaval e o feriado municipal (quando não coincide já com outro). */
export function feriados(y: number, o: Opcoes = {}): Feriado[] {
  const out: Feriado[] = NACIONAIS.map((f) => ({ id: f.id, date: f.date(y), name: f.name, tipo: f.tipo }));
  const reg = o.local?.regiao;
  for (const f of REGIONAIS) if (f.regiao === reg && (!f.desde || y >= f.desde)) out.push({ id: f.id, date: f.date(y), name: f.name, tipo: 'regional' });
  if (o.carnaval) out.push({ id: 'carnaval', date: CARNAVAL.date(y), name: CARNAVAL.name, tipo: 'facultativo' });
  const fm = o.local?.feriado;
  if (o.local && fm) {
    const d = dataRegra(y, fm.regra);
    if (!out.some((f) => f.date === d)) out.push({ id: 'municipal', date: d, name: { pt: `${fm.nome} (feriado municipal de ${o.local.nome})`, en: `${fm.nome} (municipal holiday in ${o.local.nome})` }, tipo: 'municipal' });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}
/** O feriado municipal coincide com outro feriado nesse ano? */
export function municipalCoincide(y: number, l: Local): Feriado | undefined {
  if (!l.feriado) return undefined;
  const d = dataRegra(y, l.feriado.regra);
  return feriados(y, { local: { ...l, feriado: null } }).find((f) => f.date === d);
}
export const emDiaUtil = (list: Feriado[]) => list.filter((f) => !isWeekend(fromIso(f.date)));
export const aoFimDeSemana = (list: Feriado[]) => list.filter((f) => f.id !== 'pascoa' && isWeekend(fromIso(f.date)));
/** Carnaval: domingo gordo (Páscoa − 49), terça (− 47), Quarta-feira de Cinzas (− 46). */
export const carnaval = (y: number) => { const p = pascoa(y); return { domingo: addDays(p, -49), terca: addDays(p, -47), cinzas: addDays(p, -46) }; };
/** Hora de verão na UE (Diretiva 2000/84/CE): último domingo de março a último domingo de outubro, à 1:00 UTC. */
export const horaVerao = (y: number) => ({ inicio: nthWeekday(y, 3, 0, -1), fim: nthWeekday(y, 10, 0, -1) });
