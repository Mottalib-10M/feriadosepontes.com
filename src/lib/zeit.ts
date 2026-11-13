/** Hora de Lisboa → instante UTC (Diretiva 2000/84/CE: hora de verão do último domingo de março à 1:00 UTC até ao
 *  último domingo de outubro à 1:00 UTC; Portugal continental está em UTC+0 no inverno e UTC+1 no verão). Serve às
 *  contagens decrescentes. Os Açores estão uma hora atrás; a contagem usa a hora de Lisboa e di-lo. */
import { nthWeekday, fromIso } from './engine/feriados';
export function lisboaInstant(dateIso: string, time = '00:00'): string {
  const y = Number(dateIso.slice(0, 4)), [hh, mm] = time.split(':').map(Number);
  const local = Date.UTC(y, Number(dateIso.slice(5, 7)) - 1, Number(dateIso.slice(8, 10)), hh, mm);
  const b = fromIso(nthWeekday(y, 3, 0, -1)) * 864e5 + 3600e3;
  const e = fromIso(nthWeekday(y, 10, 0, -1)) * 864e5 + 3600e3;
  const off = local > b && local - 3600e3 < e ? 1 : 0;
  return new Date(local - off * 3600e3).toISOString();
}
