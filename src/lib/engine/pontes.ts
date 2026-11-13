/**
 * Pontes e marcação de férias.
 *
 * O ano divide-se em blocos alternados: blocos livres (sábado, domingo, feriados e, à escolha, Carnaval, feriado
 * municipal, 24 e 31 de dezembro) e blocos de trabalho (segunda a sexta sem feriado). Quem tira férias em todos os dias
 * de um bloco de trabalho junta os dois blocos livres vizinhos num só.
 *
 * - `pontes`: cada bloco de trabalho de no máximo quatro dias ao lado de um feriado, com o rendimento (dias livres
 *   seguidos por dia de férias), do melhor para o pior.
 * - `otimiza`: a melhor escolha para um número de dias de férias. Programação dinâmica exata sobre os blocos de trabalho
 *   (escolhido / não escolhido, dias usados): maximiza os dias livres dentro dos blocos criados; em caso de empate ganha
 *   a solução com menos férias.
 */
import { feriados, fromIso, toIso, isWeekend, dayNum, type Local } from './feriados';

export interface Opcoes { local?: Local | null; carnaval?: boolean; /** 24 e 31 de dezembro livres (tolerância, acordo). */ vesperas?: boolean }
interface Bloco { libero: boolean; start: number; len: number; festa: boolean }

function festiviSet(y: number, o: Opcoes): Set<number> {
  const s = new Set<number>();
  for (const yy of [y - 1, y, y + 1]) for (const f of feriados(yy, o)) s.add(fromIso(f.date));
  if (o.vesperas) for (const yy of [y - 1, y, y + 1]) { s.add(dayNum(yy, 12, 24)); s.add(dayNum(yy, 12, 31)); }
  return s;
}
/** Blocchi liberi e di lavoro dall'inizio di dicembre dell'anno prima alla fine di gennaio dell'anno dopo. */
export function blocchi(y: number, o: Opcoes = {}): Bloco[] {
  const hol = festiviSet(y, o);
  const a = dayNum(y - 1, 12, 1), b = dayNum(y + 1, 1, 31);
  const out: Bloco[] = [];
  for (let d = a; d <= b; d++) {
    const isHol = hol.has(d), libero = isHol || isWeekend(d);
    // Solo una festività in un giorno feriale fa di un blocco un ponte; il 15 agosto di domenica no.
    const conta = isHol && !isWeekend(d);
    const last = out[out.length - 1];
    if (last && last.libero === libero) { last.len++; last.festa ||= conta; }
    else out.push({ libero, start: d, len: 1, festa: conta });
  }
  return out;
}

export interface Ponte {
  /** Giorni di ferie: primo e ultimo (ISO). */
  ferieDal: string; ferieAl: string; ferie: number;
  /** Bloco libero di fila che si ottiene. */
  liberoDal: string; liberoAl: string; liberi: number;
  /** Festività dentro il blocco (id). */
  feste: string[];
}
const mk = (bl: Bloco[], i: number, j: number, y: number, o: Opcoes): Ponte => {
  const pre = bl[i - 1], post = bl[j + 1];
  const dal = pre ? pre.start : bl[i].start, al = post ? post.start + post.len - 1 : bl[j].start + bl[j].len - 1;
  let ferie = 0; for (let k = i; k <= j; k++) if (!bl[k].libero) ferie += bl[k].len;
  const ids = new Set<string>();
  for (const yy of [y - 1, y, y + 1]) for (const f of feriados(yy, o)) { const n = fromIso(f.date); if (n >= dal && n <= al) ids.add(f.id); }
  return { ferieDal: toIso(bl[i].start), ferieAl: toIso(bl[j].start + bl[j].len - 1), ferie, liberoDal: toIso(dal), liberoAl: toIso(al), liberi: al - dal + 1, feste: [...ids] };
};
const nellAnno = (b: Bloco, y: number) => b.start >= dayNum(y, 1, 1) && b.start + b.len - 1 <= dayNum(y, 12, 31);

/** Tutti i ponti di un anno: blocchi di lavoro fino a `max` giorni accanto a una festività, dal migliore. */
export function pontes(y: number, o: Opcoes = {}, max = 4): Ponte[] {
  const bl = blocchi(y, o), out: Ponte[] = [];
  for (let i = 1; i < bl.length - 1; i++) {
    const b = bl[i];
    if (b.libero || b.len > max || !nellAnno(b, y)) continue;
    if (!bl[i - 1].festa && !bl[i + 1].festa) continue;
    out.push(mk(bl, i, i, y, o));
  }
  return out.sort((a, b) => b.liberi / b.ferie - a.liberi / a.ferie || b.liberi - a.liberi || a.ferieDal.localeCompare(b.ferieDal));
}
/** Ponti veri: un solo giorno feriale tra una festività e il fine settimana (o tra due festività). */
export const pontesDeUmDia = (y: number, o: Opcoes = {}) => pontes(y, o, 1);

export interface Piano { blocchi: Ponte[]; ferie: number; liberi: number; /** Giorni di ferie che non allungano più nessun ponte. */ resto: number }
/** Distribuzione migliore di `budget` giorni di ferie nell'anno y (consumano ferie solo i giorni dell'anno y). */
export function otimiza(y: number, budget: number, o: Opcoes = {}): Piano {
  const B = Math.max(0, Math.min(60, Math.floor(budget)));
  const bl = blocchi(y, o);
  const runs: number[] = []; for (let i = 0; i < bl.length; i++) if (!bl[i].libero) runs.push(i);
  const n = runs.length, NEG = -1e9;
  const ok = (r: number) => { const i = runs[r]; return i > 0 && i < bl.length - 1 && nellAnno(bl[i], y) && bl[i].len <= 10; };
  const fr = (i: number) => (bl[i] && bl[i].libero ? bl[i].len : 0);
  // dp[r][s][c]: valore migliore dopo il blocco r con c giorni usati. s = 0: blocco r non scelto; 1: scelto e la catena
  // tocca già una festività; 2: scelto, ancora senza festività (non può finire così: una settimana di ferie senza
  // festività non è un ponte e resta tra i giorni liberi da pianificare). Valore = 100·liberi − ferie.
  const dp: Float64Array[][] = [], from: Int32Array[][] = [];
  for (let r = 0; r <= n; r++) { dp.push([0, 1, 2].map(() => new Float64Array(B + 1).fill(NEG))); from.push([0, 1, 2].map(() => new Int32Array(B + 1).fill(-1))); }
  dp[0][0][0] = 0;
  const hol = (i: number) => !!(bl[i] && bl[i].libero && bl[i].festa);
  for (let r = 0; r < n; r++) {
    const i = runs[r], cost = bl[i].len;
    for (let c = 0; c <= B; c++) for (let s = 0; s < 3; s++) {
      const v = dp[r][s][c]; if (v <= NEG / 2) continue;
      if (s !== 2 && v > dp[r + 1][0][c]) { dp[r + 1][0][c] = v; from[r + 1][0][c] = s; }
      if (ok(r) && c + cost <= B) {
        const gain = s ? cost + fr(i + 1) : fr(i - 1) + cost + fr(i + 1);
        const has = (s === 1) || (s === 0 && hol(i - 1)) || hol(i + 1);
        const t = has ? 1 : 2, nv = v + 100 * gain - cost;
        if (nv > dp[r + 1][t][c + cost]) { dp[r + 1][t][c + cost] = nv; from[r + 1][t][c + cost] = s; }
      }
    }
  }
  let best = 0, bc = 0, bs = 0;
  for (let c = 0; c <= B; c++) for (let s = 0; s < 2; s++) if (dp[n][s][c] > best) { best = dp[n][s][c]; bc = c; bs = s; }
  const chosen: boolean[] = new Array(n).fill(false);
  for (let r = n, c = bc, s = bs; r > 0; r--) { const p = from[r][s][c]; if (s) { chosen[r - 1] = true; c -= bl[runs[r - 1]].len; } s = p < 0 ? 0 : p; }
  const plan: Ponte[] = [];
  for (let r = 0; r < n; r++) {
    if (!chosen[r]) continue;
    let e = r; while (e + 1 < n && chosen[e + 1]) e++;
    plan.push(mk(bl, runs[r], runs[e], y, o)); r = e;
  }
  const ferie = plan.reduce((a, b) => a + b.ferie, 0);
  return { blocchi: plan, ferie, liberi: plan.reduce((a, b) => a + b.liberi, 0), resto: B - ferie };
}

/* ------------------------------------------------------------------ giorni lavorativi, settimane */
/** Giorni lavorativi per mese. `settimana` 5 = dal lunedì al venerdì, 6 = dal lunedì al sabato. */
export function diasUteis(y: number, o: Opcoes = {}, settimana: 5 | 6 = 5): number[] {
  const hol = new Set(feriados(y, o).map((f) => fromIso(f.date)));
  if (o.vesperas) { hol.add(dayNum(y, 12, 24)); hol.add(dayNum(y, 12, 31)); }
  const out: number[] = [];
  for (let m = 1; m <= 12; m++) {
    let c = 0;
    for (let d = dayNum(y, m, 1); d < dayNum(y, m + 1, 1); d++) {
      const w = new Date(d * 86400000).getUTCDay();
      const lav = settimana === 6 ? w !== 0 : w !== 0 && w !== 6;
      if (lav && !hol.has(d)) c++;
    }
    out.push(c);
  }
  return out;
}
/** Giorni dal lunedì al venerdì di un anno, festività comprese. */
export const diasSemana5 = (y: number) => { let c = 0; for (let d = dayNum(y, 1, 1); d <= dayNum(y, 12, 31); d++) if (!isWeekend(d)) c++; return c; };
/** Settimana ISO 8601 (la settimana 1 è quella che contiene il primo giovedì dell'anno). */
export function isoWeek(iso: string): { year: number; week: number } {
  const n = fromIso(iso), wd = (new Date(n * 86400000).getUTCDay() + 6) % 7;
  const thu = n - wd + 3, ty = new Date(thu * 86400000).getUTCFullYear();
  return { year: ty, week: Math.floor((thu - dayNum(ty, 1, 1)) / 7) + 1 };
}
export const weeksInYear = (y: number) => isoWeek(`${y}-12-28`).week;
/** Lunedì della settimana ISO w dell'anno y. */
export const segundaDaSemana = (y: number, w: number) => { const j4 = dayNum(y, 1, 4); return toIso(j4 - ((new Date(j4 * 86400000).getUTCDay() + 6) % 7) + 7 * (w - 1)); };
