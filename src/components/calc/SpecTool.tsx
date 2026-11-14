/**
 * Rend un simulateur déclaratif (src/lib/tool-specs.ts) : champs à gauche, carte de résultat à droite
 * (data-resultat), options repliées, lien de partage écrit seulement après une action de l'utilisateur.
 * Premier rendu = valeurs par défaut du build ; un lien partagé est lu après le montage (RECETTE §17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Choice, ResultCard, Rows, ShareRow } from './parts';
import { readParams, updateURL } from '../../lib/url-state';
import { getTool } from '../../lib/tool-specs';
import { optsOf, resolve, type Input, type V } from '../../lib/tool-types';
import { t } from '../../i18n/ui';
import type { Lang } from '../../lib/format';

interface Props { kind: string; lang: Lang; arg?: string; methodHref?: string; idPrefix?: string }

/** Valeur d'un champ telle qu'on la lit (libellé de l'option, ou nombre). */
const valeurDe = (i: Input, v: V) => (i.kind === 'choice' ? i.options.find((o) => o.value === String(v[i.id]))?.label : i.kind === 'select' ? optsOf(i, v).find((o) => o.value === String(v[i.id]))?.label : undefined) ?? String(v[i.id]);

export default function SpecTool({ kind, lang, arg, methodHref, idPrefix = 't' }: Props) {
  const ui = t(lang);
  const spec = useMemo(() => getTool(kind, lang, arg ? JSON.parse(arg) : undefined), [kind, lang, arg]);
  const defaults = useMemo(() => Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])) as V, [spec]);
  const [v, setV] = useState<V>(defaults);
  useEffect(() => {
    const u = readParams(window.location.search);
    if (![...u.keys()].length) return;
    const next: V = { ...defaults };
    for (const i of spec.inputs) {
      const x = u.get(i.id);
      if (x === null) continue;
      if (i.kind === 'choice') { if (i.options.some((o) => o.value === x)) next[i.id] = x; }
      else if (i.kind === 'select') { if (optsOf(i, next).some((o) => o.value === x)) next[i.id] = x; }
      else { const f = parseFloat(x); if (!isNaN(f)) next[i.id] = Math.min(f, i.max ?? Infinity); }
    }
    setV(next);
  }, []);
  const rv = useMemo(() => resolve(spec.inputs, v), [v, spec]);
  useEffect(() => updateURL(rv as Record<string, string | number>), [rv]);
  const out = useMemo(() => spec.run(rv), [rv, spec]);
  const set = (id: string) => (x: number | string) => setV((o) => ({ ...o, [id]: x }));
  const field = (i: Input) => {
    const id = `${idPrefix}-${i.id}`;
    const cls = i.wide ? 'sm:col-span-2' : '';
    if (i.kind === 'choice') return <div key={i.id} className={`grid grid-rows-subgrid row-span-3 ${cls}`}><Choice id={id} label={i.label} value={String(rv[i.id])} options={i.options} onChange={set(i.id)} /></div>;
    if (i.kind === 'select') return <SelectField key={i.id} id={id} label={i.label} value={String(rv[i.id])} onChange={set(i.id)} options={optsOf(i, rv)} help={i.help} className={cls} />;
    return <NumberField key={i.id} id={id} label={i.label} value={Number(rv[i.id])} onChange={set(i.id)} unit={i.unit} max={i.max} decimals={i.decimals} help={i.help} className={cls} lang={lang} />;
  };
  const vis = spec.inputs.filter((i) => !i.showIf || i.showIf(rv));
  const main = vis.filter((i) => !i.adv), adv = vis.filter((i) => i.adv);
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
        <form className="grid content-start grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          {main.map(field)}
          {adv.length > 0 && (
            <details className="sm:col-span-2 rounded-lg border border-navy-200 px-3 py-2">
              {/* Le titre du repli dit ce qu'il contient et la valeur en vigueur (testeurs naïfs du 2026-11-14, tour 2 :
                  « Mais opções » fermé, « on ne sait pas ce qu'il contient », options citées ailleurs restées invisibles). */}
              {/* Tour 3 : le résumé cite TOUTES les options réglées, y compris la question conditionnelle montrée plus haut
                  (« No feriado municipal »), et dit à quoi sert le repli (« tem algum destes dias livres? »). */}
              <summary data-repli-outil className="cursor-pointer text-sm font-medium text-navy-700">{ui.moreOptions}{adv.some((i) => i.kind === 'choice') ? `: ${ui.moreOptionsHint}` : ''}
                <span className="mt-0.5 block text-xs font-normal text-navy-600">{[...main.filter((i) => i.showIf && i.kind === 'choice'), ...adv].map((i) => `${i.label}: ${valeurDe(i, rv)}`).join(' · ')}</span></summary>
              <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">{adv.map(field)}</div>
            </details>
          )}
        </form>
        <ResultCard label={out.label} value={out.value} sub={out.sub}>
          <Rows rows={out.rows} />
          {out.note && <p className="mt-2 text-xs text-navy-600 [overflow-wrap:anywhere]">{out.note}</p>}
          <ShareRow methodHref={methodHref} labels={ui} />
        </ResultCard>
      </div>
      {/* Tableaux du résultat (testeurs naïfs du 2026-11-14) : le script de BaseLayout ne touche pas aux îlots React,
          les tableaux de 5 colonnes restaient coupés à droite sur téléphone. Dès 3 colonnes, le composant pose lui-même
          .empile et data-label (fiches sous 768 px, global.css). Les tableaux en plus (« Todas as pontes ») sont repliés. */}
      {[out.table, ...(out.tables ?? [])].filter((x) => !!x).map((tb, ti) => {
        const tableau = (
          <table className={`w-full text-sm ${tb!.headers.length >= 3 ? 'empile' : ''}`}>
            {tb!.caption && ti === 0 && <caption className="mb-2 text-left text-sm font-semibold text-navy-900">{tb!.caption}</caption>}
            <thead><tr>{tb!.headers.map((h, i) => <th key={h} scope="col" className={`border-b border-navy-300 px-2 py-1.5 font-semibold text-navy-900 ${tb!.align?.[i] === 'r' ? 'text-right' : 'text-left'}`}>{h}</th>)}</tr></thead>
            <tbody>{tb!.rows.map((r, k) => <tr key={k}>{r.map((c, i) => <td key={i} data-label={tb!.headers[i]} className={`border-b border-navy-100 px-2 py-1.5 text-navy-800 ${tb!.align?.[i] === 'r' ? 'tabular-nums text-right' : 'text-left'}`} dangerouslySetInnerHTML={{ __html: c }} />)}</tr>)}</tbody>
          </table>
        );
        return ti === 0
          ? <div key={ti} className="mt-4 overflow-x-auto">{tableau}</div>
          : <details key={ti} className="mt-4 rounded-lg border border-navy-200 px-3 py-2"><summary className="cursor-pointer text-sm font-semibold text-accent-700">{tb!.caption ?? ''}</summary><div className="mt-2 overflow-x-auto">{tableau}</div></details>;
      })}
    </div>
  );
}
