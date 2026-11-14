/**
 * Calendário anual com as semanas ISO 8601, os feriados nacionais e, à escolha, os regionais e o feriado municipal do
 * concelho. Primeiro desenho = valores do build; o endereço partilhado é lido depois da montagem (RECETTE §17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { ResultCard, Rows, ShareRow } from '../calc/parts';
import { readParams, updateURL } from '../../lib/url-state';
import { feriados, dayNum, weekday } from '../../lib/engine/feriados';
import { diasUteis, isoWeek, weeksInYear, segundaDaSemana } from '../../lib/engine/pontes';
import { CONCELHOS, concelhoById } from '../../lib/engine/concelhos';
import { concelhoLabel, dLong, TAG } from '../../lib/tool-specs';
import { t } from '../../i18n/ui';
import type { Lang } from '../../lib/format';

interface Props { lang: Lang; year: number; concelho?: string; methodHref?: string; idPrefix?: string }

export default function Calendario({ lang, year, concelho: c0 = '', methodHref, idPrefix = 'k' }: Props) {
  const ui = t(lang), T = (pt: string, en: string) => (lang === 'pt' ? pt : en);
  const [concelho, setConcelho] = useState<string>(c0);
  const [touched, setTouched] = useState(false);
  useEffect(() => { const c = readParams(window.location.search).get('concelho'); if (c && concelhoById(c)) setConcelho(c); }, []);
  useEffect(() => { if (touched) updateURL({ concelho }); }, [concelho, touched]);
  const c = concelhoById(concelho);
  const list = useMemo(() => feriados(year, { local: c }), [year, c]);
  const hol = useMemo(() => new Map(list.map((f) => [f.date, f])), [list]);
  const du = useMemo(() => diasUteis(year, { local: c }).reduce((a, b) => a + b, 0), [year, c]);
  const wk = list.filter((f) => { const w = weekday(dayNum(Number(f.date.slice(0, 4)), Number(f.date.slice(5, 7)), Number(f.date.slice(8, 10)))); return w !== 0 && w !== 6; }).length;
  // En-têtes courts écrits à la main (testeurs naïfs du 2026-11-14) : en pt-PT, `weekday: 'short'` rend « segunda »,
  // « terça »… qui se collaient sur 320-390 px. Le nom complet reste lisible au survol et pour les lecteurs d'écran.
  const wdHead = (lang === 'pt'
    ? [['seg', 'segunda-feira'], ['ter', 'terça-feira'], ['qua', 'quarta-feira'], ['qui', 'quinta-feira'], ['sex', 'sexta-feira'], ['sáb', 'sábado'], ['dom', 'domingo']]
    : [['Mon', 'Monday'], ['Tue', 'Tuesday'], ['Wed', 'Wednesday'], ['Thu', 'Thursday'], ['Fri', 'Friday'], ['Sat', 'Saturday'], ['Sun', 'Sunday']]) as Array<[string, string]>;
  const months = Array.from({ length: 12 }, (_, m) => {
    const first = dayNum(year, m + 1, 1), last = dayNum(year, m + 2, 1) - 1;
    const lead = (weekday(first) + 6) % 7;
    const cells: Array<number | null> = [...Array(lead).fill(null)];
    for (let d = first; d <= last; d++) cells.push(d);
    while (cells.length % 7) cells.push(null);
    const weeks: Array<Array<number | null>> = []; for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return { name: new Date(first * 864e5).toLocaleDateString(TAG(lang), { month: 'long', timeZone: 'UTC' }), weeks };
  });
  const iso = (d: number) => new Date(d * 864e5).toISOString().slice(0, 10);
  const opts = [{ value: '', label: T('Só feriados nacionais', 'National holidays only') }, ...CONCELHOS.map((x) => ({ value: x.id, label: concelhoLabel(x, lang) }))];
  const onde = c ? c.nome : 'Portugal';
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start grid-cols-1 gap-x-4 gap-y-3" onSubmit={(e) => e.preventDefault()}>
          <SelectField id={`${idPrefix}-concelho`} label={T('Junte os feriados do seu concelho', 'Add your municipality\'s holidays')} value={concelho} onChange={(v) => { setConcelho(v); setTouched(true); }} options={opts} />
          {c && !c.feriado && <p className="text-sm text-navy-700">{T(`O feriado municipal de ${c.nome} ainda não foi confirmado no sítio da câmara: não aparece no calendário.`, `${c.nome}'s municipal holiday is not yet confirmed on the council's website: it is not shown.`)}</p>}
        </form>
        <ResultCard label={T(`Calendário ${year}, ${onde}`, `Calendar ${year}, ${onde}`)} value={T(`${list.length} feriados`, `${list.length} holidays`)} sub={T(`${du} dias úteis, ${weeksInYear(year)} semanas`, `${du} working days, ${weeksInYear(year)} weeks`)}>
          <Rows rows={[[T('Feriados em dia útil', 'Holidays on a weekday'), String(wk)], [T('A semana 1 começa a', 'Week 1 starts on'), dLong(segundaDaSemana(year, 1), lang)]]} />
          <ShareRow methodHref={methodHref} labels={ui} />
        </ResultCard>
      </div>
      <div className="kal-grid mt-6">
        {months.map((mo) => (
          <table key={mo.name} data-pas-de-fiches>
            <caption className="mb-1 text-left text-sm font-semibold text-navy-900">{mo.name} {year}</caption>
            <thead><tr><th scope="col" className="kw"><abbr title={T('Semana do ano', 'Week of the year')}>{T('Sem.', 'Wk')}</abbr></th>{wdHead.map(([h, full]) => <th key={h} scope="col"><abbr title={full}>{h}</abbr></th>)}</tr></thead>
            <tbody>{mo.weeks.map((w, i) => {
              const firstDay = w.find((x) => x !== null)!;
              return (
                <tr key={i}><td className="kw">{isoWeek(iso(firstDay)).week}</td>
                  {w.map((d, j) => {
                    if (d === null) return <td key={j} />;
                    const f = hol.get(iso(d));
                    const cls = f ? (f.tipo === 'nacional' ? 'ft' : 'tf') : j >= 5 ? 'we' : '';
                    return <td key={j} className={cls} title={f ? f.name[lang] : undefined}>{new Date(d * 864e5).getUTCDate()}</td>;
                  })}
                </tr>
              );
            })}</tbody>
          </table>
        ))}
      </div>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy-700"><span><span className="kal-cle ft" aria-hidden="true" />{T('feriado nacional', 'national holiday')}</span><span><span className="kal-cle tf" aria-hidden="true" />{T('feriado regional ou municipal', 'regional or municipal holiday')}</span><span><span className="kal-cle kw-cle" aria-hidden="true">1</span>{T('número da semana', 'week number')}</span></p>
      <ul className="mt-4 grid gap-x-6 gap-y-1 text-sm text-navy-800 sm:grid-cols-2">
        {list.map((f) => <li key={f.id}><span>{dLong(f.date, lang)}</span> · {f.name[lang]}</li>)}
      </ul>
    </div>
  );
}
