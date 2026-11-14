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

/* ------------------------------------------------------------------ ce que la page a fixé, en une phrase */
/**
 * Phrase courte qui dit, sous un mini-simulateur, ce que la page a déjà fixé (testeurs naïfs du 2026-11-14, tour 2 :
 * « Já escolhido nesta página: Ano: 2027 · Semana de trabalho: seg-sex · Terça de Carnaval: Trabalha-se · 24 e 31 de
 * dezembro: Trabalha-se » renvoyait à des options cachées). On ne nomme que ce qui change la conta : l'année, le lieu,
 * le jour choisi, et les jours libres EN PLUS des feriados nacionais ; « trabalha-se » (le cas de la loi) se tait.
 * Chaîne vide quand rien n'est à dire.
 */
export function phraseFixe(kind: string, lang: string, d: Record<string, number | string> = {}, locked: string[] = []): string {
  const l = L(lang);
  const spec = getTool(kind, l, d);
  const v = resolve(spec.inputs, { ...defaults(spec.inputs), ...d });
  const lab = (id: string) => { const i = spec.inputs.find((x) => x.id === id); const o = i ? optList(i, v) : null; return o?.find((x) => x.value === String(v[id]))?.label ?? String(v[id]); };
  const has = (id: string) => locked.includes(id) && spec.inputs.some((x) => x.id === id);
  const T = (pt: string, en: string) => (l === 'pt' ? pt : en);
  const c = has('concelho') ? concelhoById(String(v.concelho ?? '')) : null;
  const quem: string[] = [];
  if (has('feriado')) quem.push(T(`o feriado ${lab('feriado')}`, lab('feriado')));
  if (has('santo')) quem.push(lab('santo'));
  if (has('regiao')) quem.push(T(`os feriados ${String(v.regiao) === 'madeira' ? 'da Madeira' : 'dos Açores'}`, `${lab('regiao')}'s holidays`));
  if (has('ano')) quem.push(String(v.ano));
  let f = quem.length ? T(`Conta feita para ${quem.join(', ')}`, `Worked out for ${quem.join(', ')}`) : '';
  if (c) f += f ? ` ${T(emNome(c.nome), `in ${c.nome}`)}` : T(`Conta feita ${emNome(c.nome)}`, `Worked out for ${c.nome}`);
  const extra: string[] = [];
  if (has('semana') && String(v.semana) === '6') extra.push(T('de segunda a sábado', 'Monday to Saturday'));
  const livres: string[] = [];
  if (has('municipal') && String(v.municipal) === 'sim' && c?.feriado) livres.push(T('o feriado municipal', 'the municipal holiday'));
  if (has('carnaval') && String(v.carnaval) === 'sim') livres.push(T('a terça de Carnaval', 'Carnival Tuesday'));
  if (has('vesperas') && String(v.vesperas) === 'sim') livres.push(T('24 e 31 de dezembro', '24 and 31 December'));
  if (livres.length) extra.push(T(`com ${livres.join(' e ')} ${livres.length > 1 || livres[0].startsWith('24') ? 'livres' : 'livre'}`, `with ${livres.join(' and ')} off`));
  if (!f && !extra.length) return '';
  if (!f) f = T('Conta feita', 'Worked out');
  return `${f}${extra.length ? `, ${extra.join(', ')}` : ''}.`;
}

/** Ce que l'exemple suppose, dit par le premier champ que le lecteur peut changer (la phrase fixe dit le reste). */
export function exempleMini(kind: string, lang: string, d: Record<string, number | string> = {}, locked: string[] = []): string {
  const l = L(lang);
  const spec = getTool(kind, l, d);
  const v = resolve(spec.inputs, { ...defaults(spec.inputs), ...d });
  const T = (pt: string, en: string) => (l === 'pt' ? pt : en);
  const vis = spec.inputs.filter((i) => !locked.includes(i.id) && (!i.showIf || i.showIf(v)));
  const i = vis[0]; if (!i) return '';
  const o = optList(i, v), lab = o?.find((x) => x.value === String(v[i.id]))?.label ?? String(v[i.id]);
  if (i.id === 'ferias') return T(`Exemplo com ${v.ferias} dias de férias`, `Example with ${v.ferias} leave days`);
  if (i.id === 'n') return T(`Exemplo com ${v.n} dias úteis`, `Example with ${v.n} working days`);
  if (i.id === 'concelho') { const c = concelhoById(String(v.concelho ?? '')); return c ? T(`Exemplo ${emNome(c.nome)}`, `Example for ${c.nome}`) : T('Exemplo para todo o país', 'Example for the whole country'); }
  if (i.id === 'ano') return T(`Exemplo para ${v.ano}`, `Example for ${v.ano}`);
  if (i.id === 'caso') return String(v.caso) === 'admissao' ? T('Exemplo para quem entrou este ano', 'Example for someone hired this year') : T('Exemplo para quem já trabalhava antes deste ano', 'Example for someone already employed before this year');
  if (i.id === 'mes') return T(`Exemplo a partir de ${v.dia ?? 1} de ${lab}`, `Example from ${v.dia ?? 1} ${lab}`);
  return T(`Exemplo: ${lab}`, `Example: ${lab}`);
}
