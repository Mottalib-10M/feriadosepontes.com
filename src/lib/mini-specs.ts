/** Mini-simulateurs du site (RECETTE §9.3) : chaque mini-simulateur réutilise une ferramenta de tool-specs.ts
 *  (même moteur, mêmes champs). Les champs à choix passent par l'indice de l'option (le MiniSim de la trame ne
 *  manipule que des nombres) ; `toNum`/`fromNum` font la conversion. */
import type { MiniSpec, MiniInput } from './mini-types';
import { getTool } from './tool-specs';
import { optsOf, resolve, type Input, type V } from './tool-types';
import type { Lang } from './format';
import { concelhoById, emNome } from './engine/concelhos';

const L = (lang: string): Lang => (lang === 'pt' ? 'pt' : 'en');
const optList = (i: Input, v: V) => (i.kind === 'select' ? optsOf(i, v) : i.kind === 'choice' ? i.options : null);
const defaults = (inputs: Input[]): V => Object.fromEntries(inputs.map((i) => [i.id, i.def]));

/** Valeurs de la spec (texte) → valeurs du MiniSim (nombres). */
export function toNum(kind: string, lang: string, d: Record<string, number | string> = {}): Record<string, number> {
  const spec = getTool(kind, L(lang), d);
  const v = resolve(spec.inputs, { ...defaults(spec.inputs), ...d });
  return Object.fromEntries(spec.inputs.map((i) => {
    const o = optList(i, v);
    return [i.id, o ? Math.max(0, o.findIndex((x) => x.value === String(v[i.id]))) : Number(v[i.id])];
  }));
}
function fromNum(inputs: Input[], n: Record<string, number>): V {
  const v: V = defaults(inputs);
  for (const i of inputs) { const o = optList(i, v); v[i.id] = o ? (o[n[i.id]] ?? o[0]).value : n[i.id]; }
  return resolve(inputs, v);
}

export function getSpec(kind: string, lang: string): MiniSpec {
  const l = L(lang);
  const spec = getTool(kind, l);
  const base = defaults(spec.inputs);
  const inputs: MiniInput[] = spec.inputs.map((i) => {
    const o = optList(i, base);
    return o
      ? { id: i.id, label: i.label, def: Math.max(0, o.findIndex((x) => x.value === String(i.def))), help: i.help, options: o.map((x, k) => ({ value: String(k), label: x.label })) }
      : { id: i.id, label: i.label, def: Number(i.def), unit: (i as { unit?: string }).unit, max: (i as { max?: number }).max, help: i.help };
  }).map((m, k) => { const si = spec.inputs[k].showIf; return si ? { ...m, showIf: (n: Record<string, number>) => si(fromNum(spec.inputs, n)) } : m; });
  return {
    title: l === 'pt' ? 'Faça a conta' : 'Work it out',
    // Dit l'année (et le concelho) de l'exemple au lieu de « Exemplo com valores habituais », qui n'avait pas de sens
    // sur un simple choix de date et cachait le passage de 2027 à 2028 (testeurs naïfs du 2026-11-14).
    exemple: (n) => {
      const v = fromNum(spec.inputs, n), c = concelhoById(String(v.concelho ?? ''));
      const ano = v.ano !== undefined ? String(v.ano) : '';
      if (!ano) return '';
      return l === 'pt' ? `Exemplo para ${ano}${c ? ` ${emNome(c.nome)}` : ''}` : `Example for ${ano}${c ? ` in ${c.nome}` : ''}`;
    },
    cta: l === 'pt' ? 'Abrir a ferramenta completa' : 'Open the full tool',
    inputs,
    run: (n) => {
      const out = spec.run(fromNum(spec.inputs, n));
      return { head: [out.label, out.value], rows: out.rows.slice(0, 4).map(([a, b]) => [a, b] as [string, string]), note: out.note ?? out.sub };
    },
  };
}
