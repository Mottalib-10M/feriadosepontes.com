/**
 * As ferramentas do sítio. Cada número e cada data vêm do motor (engine/feriados.ts, engine/pontes.ts,
 * engine/concelhos.ts) ou dos parâmetros datados (params-2026.json): nada é copiado à mão.
 * Uma spec lista os campos (visíveis primeiro, `adv` no quadro « Mais opções ») e uma função `run` que devolve o
 * cartão do resultado. O calendário anual e « É feriado hoje? » são componentes próprios.
 */
import type { ToolSpec, V, ToolOut, Opt } from './tool-types';
import { resolve } from './tool-types';
import { formatNumber, formatDecimal, type Lang } from './format';
import { NACIONAIS, CARNAVAL, REGIONAIS, feriados, pascoa, nthWeekday, fromIso, toIso, isWeekend, weekday, dataRegra, municipalCoincide, emDiaUtil, aoFimDeSemana, carnaval, addDays } from './engine/feriados';
import { otimiza, pontes, pontesDeUmDia, diasUteis, diasSemana5, isoWeek, somaDiasUteis } from './engine/pontes';
import { CONCELHOS, CONFIRMADOS, concelhoById, REGIAO_NOME, deNome, emNome, type Concelho } from './engine/concelhos';
import P from '../data/params-2026.json';

export type Args = Record<string, number | string>;
const T = (l: Lang, pt: string, en: string) => (l === 'pt' ? pt : en);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k] ?? '');
const num = (x: number, l: Lang) => formatNumber(x, 0, l);
export const TAG = (l: Lang) => (l === 'pt' ? 'pt-PT' : 'en-GB');
const fmt = (iso: string, l: Lang, o: Intl.DateTimeFormatOptions) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(TAG(l), { ...o, timeZone: 'UTC' });
/** « 28 de março de 2027 » / « 28 March 2027 » */
export const dLong = (iso: string, l: Lang) => fmt(iso, l, { day: 'numeric', month: 'long', year: 'numeric' });
/** « domingo, 28 de março de 2027 » */
export const dWeek = (iso: string, l: Lang) => fmt(iso, l, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
/** « sex., 7 de maio » / « Fri 7 May » */
export const dShort = (iso: string, l: Lang) => fmt(iso, l, { weekday: 'short', day: 'numeric', month: 'long' });
export const wdLong = (iso: string, l: Lang) => fmt(iso, l, { weekday: 'long' });
export const span = (a: string, b: string, l: Lang) => (a === b ? dShort(a, l) : `${dShort(a, l)} – ${dShort(b, l)}`);
/** « 4 de outubro » / « 4 October » */
export const dmo = (iso: string, l: Lang) => fmt(iso, l, { day: 'numeric', month: 'long' });
export const nn = (x: number, l: Lang) => formatNumber(x, 0, l);
/** « 1 dia de férias → 4 dias livres » / « 1 leave day → 4 days off » (testeurs naïfs du 2026-11-14 : « 1 férias → 4 dias »). */
const troca = (f: number, d: number, l: Lang) => T(l, `${num(f, l)} ${f === 1 ? 'dia' : 'dias'} de férias → ${num(d, l)} dias livres`, `${num(f, l)} leave ${f === 1 ? 'day' : 'days'} → ${num(d, l)} days off`);
const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
const dias = (x: number, l: Lang) => `${num(x, l)} ${x === 1 ? T(l, 'dia', 'day') : T(l, 'dias', 'days')}`;
export const yearRange = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

/* ------------------------------------------------------------------ campos */
const ANOS = P.anos as number[];
const anoOpts = (ys: number[]): Opt[] => ys.map((y) => ({ value: String(y), label: String(y) }));
const regLabel = (c: Concelho, l: Lang) => (c.regiao === 'continente' ? c.nome : `${c.nome.replace(/ \((Açores|Madeira)\)$/, '')} (${REGIAO_NOME[c.regiao][l]})`);
export const concelhoLabel = (c: Concelho, l: Lang = 'pt') => regLabel(c, l);
const concelhoOpts = (l: Lang, vazio = true): Opt[] => [...(vazio ? [{ value: '', label: T(l, 'Só feriados nacionais', 'National holidays only') }] : []), ...CONCELHOS.map((c) => ({ value: c.id, label: regLabel(c, l) }))];
const fAno = (l: Lang, def: number, ys = ANOS) => ({ kind: 'select' as const, id: 'ano', label: T(l, 'Ano', 'Year'), def: String(def), options: anoOpts(ys) });
const fConcelho = (l: Lang, def = '', adv = false) => ({ kind: 'select' as const, id: 'concelho', label: T(l, 'O seu concelho', 'Your municipality'), def, options: concelhoOpts(l), adv, wide: true, help: T(l, 'Nas ilhas junta os feriados regionais. O feriado municipal só conta se responder « Tenho o dia livre » abaixo.', 'On the islands it adds the regional holidays. The municipal holiday only counts if you answer "I have the day off" below.') });
/** Feriado municipal: facultativo (art. 235.º), por isso só conta como dia livre quando a pessoa o diz (testeurs naïfs
 *  du 2026-11-14, tour 2 : « 1 dia de férias → 4 dias livres » com o feriado municipal, e logo abaixo « É obrigatório? Não »).
 *  Pergunta visível, só quando o concelho escolhido tem a data confirmada. */
const fMunicipal = (l: Lang, def = 'nao') => ({ kind: 'choice' as const, id: 'municipal', label: T(l, 'No feriado municipal', 'On the municipal holiday'), def, wide: true,
  options: [{ value: 'nao', label: T(l, 'Trabalho', 'I work') }, { value: 'sim', label: T(l, 'Tenho o dia livre', 'I have the day off') }],
  showIf: (v: V) => !!concelhoById(String(v.concelho ?? ''))?.feriado });
const fCarnaval = (l: Lang, def = 'nao') => ({ kind: 'choice' as const, id: 'carnaval', label: T(l, 'Terça de Carnaval', 'Carnival Tuesday'), def, adv: true, options: [{ value: 'nao', label: T(l, 'Trabalha-se', 'Working day') }, { value: 'sim', label: T(l, 'Livre', 'Day off') }] });
const fVesperas = (l: Lang) => ({ kind: 'choice' as const, id: 'vesperas', label: T(l, '24 e 31 de dezembro', '24 and 31 December'), def: 'nao', adv: true, options: [{ value: 'nao', label: T(l, 'Trabalha-se', 'Working days') }, { value: 'sim', label: T(l, 'Livres', 'Days off') }] });
const ctx = (v: V) => { const c = concelhoById(s(v, 'concelho')); return { y: n(v, 'ano'), c, o: { local: c, carnaval: s(v, 'carnaval') === 'sim', vesperas: s(v, 'vesperas') === 'sim', municipal: v.municipal === undefined ? undefined : s(v, 'municipal') === 'sim' } }; };
const ALL = [...NACIONAIS, CARNAVAL, ...REGIONAIS];
export const feriadoName = (id: string, l: Lang, c?: Concelho | null) => (id === 'municipal' && c?.feriado ? T(l, `${c.feriado.nome} (${c.nome})`, `${c.feriado.nome} (${c.nome})`) : ALL.find((f) => f.id === id)?.name[l] ?? id);
const onde = (c: Concelho | null, l: Lang) => (c ? T(l, emNome(c.nome), `in ${c.nome}`) : T(l, 'em Portugal', 'in Portugal'));
const tipoNome = (t: string, l: Lang) => ({ nacional: T(l, 'nacional', 'national'), facultativo: T(l, 'facultativo', 'optional'), regional: T(l, 'regional', 'regional'), municipal: T(l, 'municipal', 'municipal') } as Record<string, string>)[t] ?? t;
const semFeriado = (c: Concelho | null, l: Lang) => (c && !c.feriado ? T(l, `Feriado municipal ${deNome(c.nome)} ainda não confirmado no sítio da câmara: não entra nas contas.`, `${c.nome}'s municipal holiday is not yet confirmed on the council's website: it is left out.`) : undefined);
/** Feriado municipal deixado de fora porque a pessoa trabalha nesse dia: dito no resultado, com a data. */
const municipalFora = (c: Concelho | null, y: number, o: { municipal?: boolean }, l: Lang) => (c?.feriado && o.municipal === false && !municipalCoincide(y, c)
  ? T(l, `O feriado municipal ${deNome(c.nome)} (${dmo(dataRegra(y, c.feriado.regra), l)}) não entra na conta: responda « Tenho o dia livre » se o seu contrato o der.`, `${c.nome}'s municipal holiday (${dmo(dataRegra(y, c.feriado.regra), l)}) is left out: answer "I have the day off" if your contract gives it.`)
  : undefined);

/* ------------------------------------------------------------------ otimizador de pontes */
function ptSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fAno(l, Number(a.ano ?? 2027)), { id: 'ferias', label: T(l, 'Dias de férias a usar', 'Leave days to use'), def: Number(a.ferias ?? 8), unit: T(l, 'dias', 'days'), max: 60 }, fConcelho(l, String(a.concelho ?? '')), fMunicipal(l, String(a.municipal ?? 'nao')), fCarnaval(l, String(a.carnaval ?? 'nao')), fVesperas(l)],
    run: (v) => {
      const { y, c, o } = ctx(v);
      const pedidos = Math.round(n(v, 'ferias'));
      const plano = otimiza(y, pedidos, o);
      const todas = pontes(y, o);
      const rend = plano.ferie ? plano.liberi / plano.ferie : 0;
      return {
        // Le titre reprend le nombre saisi (testeurs naïfs du 2026-11-14 : « 8 saisis, “com 7 dias” affiché ») ;
        // l'écart entre saisis et utilisés est dit dans la phrase sous le gros chiffre.
        // Titre qui dit ce que mesure le gros chiffre (testeurs naïfs du 2026-11-14, tour 2 : « 22 dias livres », « 22 dias
        // úteis », « 54 », « 27 » sur l'accueil, « je ne sais plus lequel est le mien »).
        label: T(l, `Dias livres seguidos que ganha nas pontes de ${y} ${onde(c, l)}, com ${dias(pedidos, l)} de férias`, `Days off in a row on the ${y} long weekends ${onde(c, l)}, with ${num(pedidos, l)} leave ${pedidos === 1 ? 'day' : 'days'}`),
        value: T(l, `${num(plano.liberi, l)} dias livres`, `${num(plano.liberi, l)} days off`),
        sub: !plano.ferie ? T(l, 'Indique pelo menos um dia de férias.', 'Enter at least one leave day.')
          : plano.resto > 0 ? T(l, `As pontes abaixo usam ${num(plano.ferie, l)} dos seus ${num(pedidos, l)} dias de férias: em média, cada um dá ${formatDecimal(rend, 1, l)} dias livres.`, `The bridges below use ${num(plano.ferie, l)} of your ${num(pedidos, l)} leave days: on average each one gives ${formatDecimal(rend, 1, l)} days off.`)
          : T(l, `Em média, cada dia de férias dá ${formatDecimal(rend, 1, l)} dias livres.`, `On average each leave day gives ${formatDecimal(rend, 1, l)} days off.`),
        rows: plano.blocchi.slice(0, 6).map((b) => [span(b.liberoDal, b.liberoAl, l), troca(b.ferie, b.liberi, l), b.liberi] as [string, string, number]),
        table: plano.blocchi.length ? {
          caption: T(l, `O seu plano ${y}: quando tirar férias`, `Your ${y} plan: when to take leave`),
          headers: [T(l, 'Tirar férias', 'Take leave'), T(l, 'Dias de férias', 'Leave days'), T(l, 'Período livre', 'Time off'), T(l, 'Dias livres', 'Days off'), T(l, 'Graças a', 'Thanks to')],
          rows: plano.blocchi.map((b) => [span(b.ferieDal, b.ferieAl, l), num(b.ferie, l), span(b.liberoDal, b.liberoAl, l), num(b.liberi, l), b.feste.map((id) => feriadoName(id, l, c)).join(', ')]),
          align: ['l', 'r', 'l', 'r', 'l'],
        } : undefined,
        tables: todas.length ? [{
          caption: T(l, `Ver todas as pontes de ${y} ${onde(c, l)}, da mais rentável`, `See every long weekend in ${y} ${onde(c, l)}, best first`),
          headers: [T(l, 'Tirar férias', 'Take leave'), T(l, 'Dias de férias', 'Leave days'), T(l, 'Período livre', 'Time off'), T(l, 'Dias livres', 'Days off'), T(l, 'Feriado', 'Holiday')],
          rows: todas.map((b) => [span(b.ferieDal, b.ferieAl, l), num(b.ferie, l), span(b.liberoDal, b.liberoAl, l), num(b.liberi, l), b.feste.map((id) => feriadoName(id, l, c)).join(', ')]),
          align: ['l', 'r', 'l', 'r', 'l'],
        }] : undefined,
        note: [semFeriado(c, l) ?? municipalFora(c, y, o, l), plano.resto > 0 ? T(l, `${plano.resto === 1 ? 'Sobra 1 dia de férias: não alonga' : `Sobram ${num(plano.resto, l)} dias de férias: não alongam`} nenhuma ponte e fica${plano.resto === 1 ? '' : 'm'} para marcar quando quiser, por exemplo no verão.`, `${dias(plano.resto, l)} left over: ${plano.resto === 1 ? 'it does' : 'they do'} not lengthen any bridge, so book ${plano.resto === 1 ? 'it' : 'them'} whenever you like, in summer for instance.`) : undefined].filter(Boolean).join(' ') || undefined,
      };
    },
  };
}

/* ------------------------------------------------------------------ feriados de um ano */
function feSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fAno(l, Number(a.ano ?? 2027)), fConcelho(l, String(a.concelho ?? '')), fCarnaval(l, String(a.carnaval ?? 'nao'))],
    run: (v) => {
      const { y, c, o } = ctx(v);
      const list = feriados(y, o);
      const util = emDiaUtil(list);
      const um = pontesDeUmDia(y, o);
      const du = diasUteis(y, o).reduce((x, z) => x + z, 0);
      const co = c && c.feriado ? municipalCoincide(y, c) : undefined;
      return {
        label: T(l, `Feriados ${y} ${onde(c, l)}`, `Public holidays ${y} ${onde(c, l)}`),
        value: T(l, `${num(list.length, l)} feriados`, `${num(list.length, l)} holidays`),
        sub: T(l, `${num(util.length, l)} calham de segunda a sexta; o Domingo de Páscoa conta.`, `${num(util.length, l)} fall on a weekday; Easter Sunday is counted.`),
        rows: [
          [T(l, 'Feriados em dia útil', 'Holidays on a weekday'), num(util.length, l)],
          [T(l, 'Feriados ao sábado ou domingo', 'Holidays on a Saturday or Sunday'), num(aoFimDeSemana(list).length, l)],
          [T(l, 'Pontes de um só dia de férias', 'Long weekends for one leave day'), num(um.length, l)],
          [T(l, 'Dias úteis (seg-sex)', 'Working days (Mon-Fri)'), num(du, l)],
        ],
        table: {
          caption: T(l, `Feriados ${y} ${onde(c, l)}`, `Public holidays ${y} ${onde(c, l)}`),
          headers: [T(l, 'Data', 'Date'), T(l, 'Dia', 'Day'), T(l, 'Feriado', 'Holiday'), T(l, 'Tipo', 'Type')],
          rows: list.map((f) => [dLong(f.date, l), wdLong(f.date, l), f.name[l], tipoNome(f.tipo, l)]),
          align: ['l', 'l', 'l', 'l'],
        },
        note: semFeriado(c, l) ?? (co && c ? T(l, `Em ${y} o feriado municipal ${deNome(c.nome)} coincide com ${co.name.pt}: não há dia livre a mais.`, `In ${y} ${c.nome}'s municipal holiday falls on ${co.name.en}: no extra day off.`) : undefined),
      };
    },
  };
}

/* ------------------------------------------------------------------ feriado municipal de um concelho */
function fmSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    // Sans concelho choisi, la page générale part d'une question vide plutôt que de Braga (testeurs naïfs du 2026-11-14,
    // tour 2 : « pourquoi Braga ? ») et dit d'emblée combien de dates sont confirmées (« 308 promis, 84 listés »).
    inputs: [{ kind: 'select', id: 'concelho', label: T(l, 'O seu concelho', 'Your municipality'), def: String(a.concelho ?? ''), options: [{ value: '', label: T(l, 'Escolha o seu concelho', 'Choose your municipality') }, ...concelhoOpts(l, false)] }, fAno(l, Number(a.ano ?? 2027))],
    run: (v) => {
      const c = concelhoById(s(v, 'concelho')), y = n(v, 'ano');
      if (!c) return {
        label: T(l, `Feriado municipal ${y}: escolha o seu concelho acima`, `Municipal holiday ${y}: choose your municipality above`),
        value: T(l, `${num(CONFIRMADOS.length, l)} de ${num(CONCELHOS.length, l)}`, `${num(CONFIRMADOS.length, l)} of ${num(CONCELHOS.length, l)}`),
        sub: T(l, `concelhos já têm a data confirmada no sítio da câmara. Para os outros ${num(CONCELHOS.length - CONFIRMADOS.length, l)}, damos a ligação para a câmara.`, `municipalities already have the date confirmed on the council's website. For the other ${num(CONCELHOS.length - CONFIRMADOS.length, l)}, we give the link to the council.`),
        rows: [
          [T(l, 'Com data confirmada', 'Date confirmed'), num(CONFIRMADOS.length, l)],
          [T(l, 'Ainda por confirmar', 'Not yet confirmed'), num(CONCELHOS.length - CONFIRMADOS.length, l)],
          [T(l, `Com feriado num dia útil em ${y}`, `Holiday on a weekday in ${y}`), num(CONFIRMADOS.filter((x) => { const w = weekday(fromIso(dataRegra(y, x.feriado!.regra))); return w !== 0 && w !== 6; }).length, l)],
        ],
      };
      if (!c.feriado) return {
        label: T(l, `Feriado municipal ${deNome(c.nome)}`, `Municipal holiday in ${c.nome}`),
        value: T(l, 'Por confirmar', 'Not yet confirmed'),
        sub: T(l, 'Ainda não encontrámos a data escrita no sítio da câmara. Não mostramos datas que não lemos na fonte.', 'We have not yet found the date written on the council\'s website. We never show a date we have not read at the source.'),
        rows: [[T(l, 'Região', 'Region'), REGIAO_NOME[c.regiao][l]], [T(l, 'Sítio da câmara', 'Council website'), c.camara.replace(/^https?:\/\/(www\.)?/, '')]],
        note: T(l, `Confirme em ${c.camara}.`, `Check on ${c.camara}.`),
      };
      const d = dataRegra(y, c.feriado.regra), co = municipalCoincide(y, c), w = weekday(fromIso(d));
      // Au week-end ou confondu avec un férié national, le férié municipal ne donne aucune ponte à lui seul
      // (testeurs naïfs du 2026-11-14, Lisbonne 2027 : « nenhum dia livre a mais » puis « 1 de férias → 4 dias »,
      // ponte qui venait en fait du Dia de Portugal et englobait le dimanche 13 juin).
      const fds = w === 0 || w === 6;
      const pt = co || fds ? [] : pontes(y, { local: c }).filter((b) => b.feste.includes('municipal'));
      const facult = T(l, 'Não por lei: é dia livre se o seu contrato ou o acordo do seu setor o derem. Câmaras e escolas costumam fechar. Na dúvida, pergunte no trabalho.', 'Not by law: it is a day off if your contract or your sector\'s agreement gives it. Councils and schools usually close. If unsure, ask at work.');
      return {
        label: T(l, `Feriado municipal ${deNome(c.nome)}, ${y}`, `Municipal holiday in ${c.nome}, ${y}`),
        value: dWeek(d, l),
        sub: co ? T(l, `Em ${y} coincide com ${co.name.pt}: nenhum dia livre a mais.`, `In ${y} it coincides with ${co.name.en}: no extra day off.`) : fds ? T(l, `Em ${y} calha a um ${wdLong(d, l)}: nenhum dia livre a mais.`, `In ${y} it falls on a ${wdLong(d, l)}: no extra day off.`) : T(l, `${c.feriado.nome}, num dia útil em ${y}.`, `${c.feriado.nome}, on a weekday in ${y}.`),
        rows: [
          // Les deux cas, puisque le jour n'est pas obligatoire (testeurs naïfs du 2026-11-14, tour 2).
          [T(l, 'Ponte, se tiver o dia livre', 'Bridge, if you have the day off'), pt.length ? troca(pt[0].ferie, pt[0].liberi, l) : co ? T(l, `nenhuma em ${y} (coincide com outro feriado)`, `none in ${y} (same day as another holiday)`) : fds ? T(l, `nenhuma em ${y} (calha a um ${wdLong(d, l)})`, `none in ${y} (falls on a ${wdLong(d, l)})`) : T(l, 'nenhuma', 'none')],
          ...(pt.length ? [[T(l, 'Se trabalhar nesse dia', 'If you work that day'), T(l, 'nenhuma ponte: é um dia de trabalho normal', 'no bridge: it is an ordinary working day')] as [string, string]] : []),
          [T(l, 'É obrigatório?', 'Is it compulsory?'), facult],
          [T(l, 'Região', 'Region'), REGIAO_NOME[c.regiao][l]],
          [T(l, 'Data lida no sítio oficial em', 'Date read on the official website on'), dLong(c.feriado.lido, l)],
        ],
        table: { caption: T(l, `Feriado municipal ${deNome(c.nome)} nos próximos anos`, `${c.nome}'s municipal holiday in the coming years`), headers: [T(l, 'Ano', 'Year'), T(l, 'Data', 'Date'), T(l, 'Dia', 'Day')], rows: yearRange(y, y + 4).map((x) => { const q = dataRegra(x, c.feriado!.regra); return [String(x), dLong(q, l), wdLong(q, l)]; }), align: ['l', 'l', 'l'] },
        // Source en nom de site court, pas en adresse brute (testeurs naïfs du 2026-11-14) ; le lien complet est dans la page.
        note: T(l, `Fonte: sítio oficial ${host(c.feriado.url)}`, `Source: official website ${host(c.feriado.url)}`),
      };
    },
  };
}

/* ------------------------------------------------------------------ dias úteis */
export const MESES = (l: Lang) => Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(2027, i, 15)).toLocaleDateString(TAG(l), { month: 'long', timeZone: 'UTC' }));
function duSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fAno(l, Number(a.ano ?? 2027)), { kind: 'choice', id: 'semana', label: T(l, 'Semana de trabalho', 'Working week'), def: '5', options: [{ value: '5', label: T(l, 'seg-sex', 'Mon-Fri') }, { value: '6', label: T(l, 'seg-sáb', 'Mon-Sat') }] }, fConcelho(l, String(a.concelho ?? '')), fMunicipal(l, String(a.municipal ?? 'nao')), fCarnaval(l), fVesperas(l)],
    run: (v) => {
      const { y, c, o } = ctx(v);
      const w = s(v, 'semana') === '6' ? 6 : 5;
      const m = diasUteis(y, o, w), sum = m.reduce((x, z) => x + z, 0);
      const bruto = w === 5 ? diasSemana5(y) : diasUteis(y, {}, 6).reduce((x, z) => x + z, 0) + feriados(y).filter((f) => weekday(fromIso(f.date)) !== 0).length;
      return {
        label: T(l, `Dias úteis ${y} ${onde(c, l)}`, `Working days ${y} ${onde(c, l)}`),
        value: num(sum, l),
        sub: w === 5 ? T(l, 'De segunda a sexta, sem contar os feriados.', 'Monday to Friday, public holidays excluded.') : T(l, 'De segunda a sábado, sem contar os feriados.', 'Monday to Saturday, public holidays excluded.'),
        rows: [
          [w === 5 ? T(l, 'Dias de segunda a sexta no ano', 'Mondays to Fridays in the year') : T(l, 'Dias de segunda a sábado no ano', 'Mondays to Saturdays in the year'), num(bruto, l)],
          [o.carnaval || o.vesperas ? T(l, 'dos quais feriados e dias livres escolhidos', 'of which holidays and chosen days off') : T(l, 'dos quais feriados', 'of which public holidays'), num(bruto - sum, l)],
          [T(l, 'Primeiro semestre', 'First half'), num(m.slice(0, 6).reduce((x, z) => x + z, 0), l)],
          [T(l, 'Segundo semestre', 'Second half'), num(m.slice(6).reduce((x, z) => x + z, 0), l)],
        ],
        table: { caption: T(l, `Dias úteis por mês, ${y}`, `Working days per month, ${y}`), headers: [T(l, 'Mês', 'Month'), T(l, 'Dias úteis', 'Working days')], rows: MESES(l).map((mn, i) => [mn, num(m[i], l)]), align: ['l', 'r'] },
        note: semFeriado(c, l) ?? municipalFora(c, y, o, l),
      };
    },
  };
}

/* ------------------------------------------------------------------ Páscoa (fórmula de Gauss) */
export function gaussPassos(x: number) {
  const K = Math.floor(x / 100), M = 15 + Math.floor((3 * K + 3) / 4) - Math.floor((8 * K + 13) / 25), S = 2 - Math.floor((3 * K + 3) / 4);
  const A = x % 19, D = (19 * A + M) % 30, R = Math.floor((D + Math.floor(A / 11)) / 29), OG = 21 + D - R;
  const SZ = 7 - ((x + Math.floor(x / 4) + S) % 7), OE = 7 - ((((OG - SZ) % 7) + 7) % 7);
  return { K, M, S, A, D, R, OG, SZ, OE, OS: OG + OE };
}
function paSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fAno(l, Number(a.ano ?? 2027), yearRange(2000, 2060))],
    run: (v) => {
      const y = n(v, 'ano'), ps = pascoa(y), g = gaussPassos(y);
      return {
        label: T(l, `Páscoa ${y}`, `Easter Sunday ${y}`),
        value: dLong(ps, l),
        sub: T(l, `Sexta-Feira Santa, feriado nacional, é a ${dLong(addDays(ps, -2), l)}; Corpo de Deus, a ${dLong(addDays(ps, 60), l)}.`, `Good Friday, a national holiday, is ${dLong(addDays(ps, -2), l)}; Corpus Christi is ${dLong(addDays(ps, 60), l)}.`),
        rows: [
          [T(l, 'Terça-feira de Carnaval', 'Carnival Tuesday'), dShort(addDays(ps, -47), l)],
          [T(l, 'Domingo de Ramos', 'Palm Sunday'), dShort(addDays(ps, -7), l)],
          [T(l, 'Sexta-Feira Santa (feriado)', 'Good Friday (holiday)'), dShort(addDays(ps, -2), l)],
          [T(l, 'Ascensão (Dia da Espiga)', 'Ascension Day'), dShort(addDays(ps, 39), l)],
          [T(l, 'Corpo de Deus (feriado)', 'Corpus Christi (holiday)'), dShort(addDays(ps, 60), l)],
        ],
        table: {
          caption: T(l, `Fórmula de Gauss para ${y}, passo a passo`, `Gauss's Easter formula for ${y}, step by step`),
          headers: [T(l, 'Grandeza', 'Quantity'), T(l, 'Significado', 'Meaning'), T(l, 'Valor', 'Value')],
          rows: [
            ['K', T(l, 'século', 'century number'), String(g.K)], ['M', T(l, 'correção lunar secular', 'lunar correction'), String(g.M)], ['S', T(l, 'correção solar secular', 'solar correction'), String(g.S)],
            ['A', T(l, 'parâmetro lunar (número áureo − 1)', 'lunar parameter (golden number − 1)'), String(g.A)], ['D', T(l, 'semente da primeira lua cheia da primavera', 'seed for the first spring full moon'), String(g.D)], ['R', T(l, 'correção de calendário', 'calendar correction'), String(g.R)],
            ['OG', T(l, 'lua cheia pascal (dia de março)', 'paschal full moon (day of March)'), String(g.OG)], ['SZ', T(l, 'primeiro domingo de março', 'first Sunday in March'), String(g.SZ)], ['OE', T(l, 'dias até ao Domingo de Páscoa', 'days to Easter Sunday'), String(g.OE)],
            ['OS', T(l, 'Páscoa como dia de março (32 = 1 de abril)', 'Easter as a day of March (32 = 1 April)'), String(g.OS)],
          ],
          align: ['l', 'l', 'r'],
        },
        tables: [{ caption: T(l, 'Páscoa e Sexta-Feira Santa nos próximos anos', 'Easter and Good Friday in the coming years'), headers: [T(l, 'Ano', 'Year'), T(l, 'Sexta-Feira Santa', 'Good Friday'), T(l, 'Domingo de Páscoa', 'Easter Sunday')], rows: yearRange(y, y + 7).map((z) => [String(z), dLong(addDays(pascoa(z), -2), l), dLong(pascoa(z), l)]), align: ['l', 'l', 'l'] }],
      };
    },
  };
}

/* ------------------------------------------------------------------ Carnaval */
function caSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fAno(l, Number(a.ano ?? 2027), yearRange(2020, 2040))],
    run: (v) => {
      const y = n(v, 'ano'), c = carnaval(y), w = weekday(fromIso(c.terca));
      const ponte = pontes(y, { carnaval: true }).find((b) => b.feste.includes('carnaval'));
      return {
        label: T(l, `Terça-feira de Carnaval ${y}`, `Carnival Tuesday ${y}`),
        value: dLong(c.terca, l),
        sub: T(l, 'Não é feriado obrigatório: só é dia livre se o seu contrato ou o acordo coletivo do seu setor o derem, ou, na função pública, se o Governo der o dia (a chamada tolerância de ponto).', 'Not a compulsory holiday: a day off only if your contract or your sector\'s collective agreement gives it, or, in the civil service, if the Government grants the day (a tolerância de ponto).'),
        rows: [
          [T(l, 'Domingo gordo', 'Carnival Sunday'), dShort(c.domingo, l)],
          [T(l, 'Segunda-feira de Carnaval', 'Carnival Monday'), dShort(addDays(c.terca, -1), l)],
          [T(l, 'Quarta-feira de Cinzas', 'Ash Wednesday'), dShort(c.cinzas, l)],
          [T(l, 'Ponte se a terça for livre', 'Bridge if Tuesday is off'), ponte && w === 2 ? troca(ponte.ferie, ponte.liberi, l) : '–'],
          // Le jour à poser, comme sur l'accueil (testeurs naïfs du 2026-11-14, tour 2 : « oui, mais lequel ? »).
          ...(ponte && w === 2 ? [[T(l, 'Tirar férias', 'Take leave'), span(ponte.ferieDal, ponte.ferieAl, l)] as [string, string]] : []),
        ],
        table: { caption: T(l, 'Carnaval nos próximos anos', 'Carnival in the coming years'), headers: [T(l, 'Ano', 'Year'), T(l, 'Terça de Carnaval', 'Carnival Tuesday'), T(l, 'Quarta de Cinzas', 'Ash Wednesday'), T(l, 'Páscoa', 'Easter')], rows: yearRange(y, y + 6).map((z) => { const q = carnaval(z); return [String(z), dLong(q.terca, l), dLong(q.cinzas, l), dLong(pascoa(z), l)]; }), align: ['l', 'l', 'l', 'l'] },
        note: T(l, 'Fonte: Código do Trabalho, artigo 235.º (feriados facultativos).', 'Source: Labour Code, article 235 (optional holidays).'),
      };
    },
  };
}

/* ------------------------------------------------------------------ um feriado nacional em detalhe */
const DETALHE = ['ano-novo', 'sexta-santa', 'liberdade', 'trabalhador', 'corpo-deus', 'portugal', 'assuncao', 'republica', 'todos-santos', 'restauracao', 'imaculada', 'natal'];
function fdSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [{ kind: 'select', id: 'feriado', label: T(l, 'Feriado', 'Holiday'), def: String(a.feriado ?? 'corpo-deus'), options: DETALHE.map((id) => ({ value: id, label: NACIONAIS.find((f) => f.id === id)!.name[l] })) }, fAno(l, Number(a.ano ?? 2027), yearRange(2026, 2032))],
    run: (v) => {
      const id = s(v, 'feriado'), y = n(v, 'ano'), f = NACIONAIS.find((x) => x.id === id)!;
      const d = f.date(y), w = weekday(fromIso(d));
      const b = pontes(y).find((q) => q.feste.includes(id));
      const tipo = w === 0 || w === 6 ? T(l, 'calha ao fim de semana: não há dia livre a mais', 'falls on a weekend: no extra day off') : w === 1 || w === 5 ? T(l, 'faz sozinho um fim de semana de três dias', 'makes a three-day weekend by itself') : w === 2 || w === 4 ? T(l, 'um dia de férias dá uma ponte de quatro dias', 'one leave day gives a four-day weekend') : T(l, 'calha a meio da semana', 'falls midweek');
      return {
        label: T(l, `${f.name.pt} ${y}`, `${f.name.en} ${y}`),
        value: dWeek(d, l),
        sub: T(l, `Em ${y} ${tipo}.`, `In ${y} it ${tipo}.`),
        rows: [
          [T(l, 'Dia da semana', 'Weekday'), wdLong(d, l)],
          [T(l, 'Melhor ponte', 'Best long weekend'), b ? span(b.liberoDal, b.liberoAl, l) : T(l, 'nenhuma', 'none')],
          [T(l, 'Tirar férias', 'Take leave'), b ? span(b.ferieDal, b.ferieAl, l) : T(l, 'não é preciso', 'not needed')],
          [T(l, 'Férias necessárias', 'Leave days needed'), b ? num(b.ferie, l) : '0'],
          [T(l, 'Dias livres seguidos', 'Days off in a row'), b ? num(b.liberi, l) : (w === 1 || w === 5 ? '3' : '1')],
        ],
        table: { caption: T(l, `${f.name.pt} nos próximos anos`, `${f.name.en} in the coming years`), headers: [T(l, 'Ano', 'Year'), T(l, 'Data', 'Date'), T(l, 'Dia', 'Day'), T(l, 'Ponte', 'Bridge')], rows: yearRange(y, y + 5).map((x) => { const q = f.date(x); const bb = pontes(x).find((z) => z.feste.includes(id)); return [String(x), dLong(q, l), wdLong(q, l), bb ? troca(bb.ferie, bb.liberi, l) : '–']; }), align: ['l', 'l', 'l', 'l'] },
      };
    },
  };
}

/* ------------------------------------------------------------------ feriados ao fim de semana */
function fsSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [fAno(l, Number(a.ano ?? 2027)), fConcelho(l, String(a.concelho ?? ''), true)],
    run: (v) => {
      const { y, c, o } = ctx(v);
      const all = feriados(y, o), list = aoFimDeSemana(all);
      const dom = list.filter((f) => weekday(fromIso(f.date)) === 0);
      return {
        label: T(l, `Feriados que calham ao fim de semana, ${y}`, `Holidays falling on a weekend, ${y}`),
        value: T(l, `${num(list.length, l)} de ${num(all.length - 1, l)}`, `${num(list.length, l)} of ${num(all.length - 1, l)}`),
        sub: T(l, 'Sem contar o Domingo de Páscoa. Em Portugal um feriado ao fim de semana não passa para segunda-feira.', 'Easter Sunday excluded. In Portugal a weekend holiday is not moved to Monday.'),
        rows: [
          [T(l, 'Ao domingo', 'On a Sunday'), num(dom.length, l)],
          [T(l, 'Ao sábado', 'On a Saturday'), num(list.length - dom.length, l)],
          [T(l, 'Em dia útil', 'On a weekday'), num(emDiaUtil(all).length, l)],
        ],
        table: list.length ? { caption: T(l, `Feriados de ${y} ao sábado ou ao domingo`, `${y} holidays on a Saturday or Sunday`), headers: [T(l, 'Data', 'Date'), T(l, 'Dia', 'Day'), T(l, 'Feriado', 'Holiday')], rows: list.map((f) => [dLong(f.date, l), wdLong(f.date, l), f.name[l]]), align: ['l', 'l', 'l'] } : undefined,
        note: semFeriado(c, l),
      };
    },
  };
}

/* ------------------------------------------------------------------ férias (CT art. 238.º e 239.º) */
function frSpec(l: Lang, a: Args = {}): ToolSpec {
  const F = P.ferias;
  return {
    inputs: [
      { kind: 'choice', id: 'caso', label: T(l, 'Quando começou neste emprego?', 'When did you start this job?'), def: String(a.caso ?? 'normal'), options: [{ value: 'normal', label: T(l, 'Antes deste ano', 'Before this year') }, { value: 'admissao', label: T(l, 'Este ano', 'This year') }] },
      { kind: 'select', id: 'meses', label: T(l, 'Meses completos de contrato no ano de admissão', 'Full months under contract in the year hired'), def: String(a.meses ?? 6), options: yearRange(1, 12).map((x) => ({ value: String(x), label: String(x) })), showIf: (v) => String(v.caso) === 'admissao' },
      fAno(l, Number(a.ano ?? 2027)),
    ],
    run: (v) => {
      const adm = s(v, 'caso') === 'admissao', m = Number(s(v, 'meses')) || 1, y = n(v, 'ano');
      const dd = adm ? Math.min(F.porMesAdmissao * m, F.maxAdmissao) : F.minimoAnual;
      const plano = otimiza(y, dd);
      return {
        // Gros chiffre nommé pour ne pas le confondre avec les « dias livres » de l'optimiseur (testeurs naïfs du
        // 2026-11-14, tour 2 : « 22 dias livres » puis « 22 dias úteis » sur la même page).
        label: adm ? T(l, `Dias de férias a que tem direito no ano em que entrou, ${y}`, `Leave you are owed in the year you were hired, ${y}`) : T(l, `Dias de férias a que tem direito por lei, ${y}`, `Leave you are owed by law, ${y}`),
        value: T(l, `${num(dd, l)} dias úteis de férias`, `${num(dd, l)} working days of leave`),
        sub: adm ? T(l, `${F.porMesAdmissao} dias úteis por cada mês completo de contrato, até ${F.maxAdmissao}; pode gozá-los depois de ${F.mesesEspera} meses de trabalho.`, `${F.porMesAdmissao} working days for each full month under contract, up to ${F.maxAdmissao}; you can take them after ${F.mesesEspera} months of work.`) : T(l, `Pelo menos ${F.minimoAnual} dias úteis por ano, ganhos a 1 de janeiro pelo trabalho do ano anterior.`, `At least ${F.minimoAnual} working days a year, earned on 1 January for the previous year's work.`),
        rows: [
          [T(l, 'Semanas de férias (aprox.)', 'Weeks of leave (approx.)'), formatDecimal(dd / 5, 1, l)],
          [T(l, `Dias livres no total, se puser os ${num(dd, l)} dias de férias nas pontes de ${y}`, `Total days off if you put all ${num(dd, l)} leave days on the ${y} bridges`), num(plano.liberi, l)],
          ...(adm ? [] : [[T(l, 'Dias que pode trabalhar e receber em vez de os gozar', 'Days you may work and be paid for instead of taking them'), T(l, `${num(Math.max(0, dd - F.renunciaAcima), l)} (os que passam de ${F.renunciaAcima})`, `${num(Math.max(0, dd - F.renunciaAcima), l)} (those above ${F.renunciaAcima})`)] as [string, string]]),
        ],
        note: T(l, 'Só contam como dias de férias os dias de segunda a sexta que não são feriado. O acordo do seu setor pode dar mais dias. Fonte: Código do Trabalho, artigos 237.º a 239.º.', 'Only Monday-to-Friday days that are not holidays count as leave days. Your sector\'s agreement may give more days. Source: Labour Code, articles 237 to 239.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ santos populares */
const SANTOS = [{ id: 'antonio', md: '06-13', pt: 'Santo António', en: 'St Anthony' }, { id: 'joao', md: '06-24', pt: 'São João', en: 'St John' }, { id: 'pedro', md: '06-29', pt: 'São Pedro', en: 'St Peter' }];
export const concelhosDoDia = (md: string) => CONFIRMADOS.filter((c) => c.feriado!.regra === md);
function spSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [{ kind: 'choice', id: 'santo', label: T(l, 'Santo popular', 'Popular saint'), def: String(a.santo ?? 'joao'), options: SANTOS.map((x) => ({ value: x.id, label: x[l] })) }, fAno(l, Number(a.ano ?? 2027))],
    run: (v) => {
      const sx = SANTOS.find((x) => x.id === s(v, 'santo')) ?? SANTOS[1], y = n(v, 'ano'), d = `${y}-${sx.md}`;
      const list = concelhosDoDia(sx.md);
      const w = weekday(fromIso(d));
      const b = list[0] ? pontes(y, { local: list[0] }).find((q) => q.feste.includes('municipal')) : undefined;
      return {
        label: T(l, `${sx.pt} ${y}: feriado municipal`, `${sx.en} ${y}: municipal holiday`),
        value: dWeek(d, l),
        sub: T(l, `${num(list.length, l)} concelhos com esta data confirmada no sítio da câmara.`, `${num(list.length, l)} municipalities with this date confirmed on the council's website.`),
        rows: [
          [T(l, 'Dia da semana', 'Weekday'), wdLong(d, l)],
          [T(l, 'Ponte', 'Bridge'), w === 0 || w === 6 ? T(l, 'nenhuma (fim de semana)', 'none (weekend)') : b ? troca(b.ferie, b.liberi, l) : '–'],
          [T(l, 'Concelhos confirmados', 'Confirmed municipalities'), num(list.length, l)],
        ],
        table: list.length ? { caption: T(l, `Concelhos com feriado municipal a ${dmo(d, l)} (confirmados)`, `Municipalities with a municipal holiday on ${dmo(d, l)} (confirmed)`), headers: [T(l, 'Concelho', 'Municipality'), T(l, 'Região', 'Region')], rows: list.map((c) => [c.nome, REGIAO_NOME[c.regiao][l]]), align: ['l', 'l'] } : undefined,
      };
    },
  };
}

/* ------------------------------------------------------------------ feriados regionais */
function rgSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [{ kind: 'choice', id: 'regiao', label: T(l, 'Região autónoma', 'Autonomous region'), def: String(a.regiao ?? 'acores'), options: [{ value: 'acores', label: T(l, 'Açores', 'Azores') }, { value: 'madeira', label: 'Madeira' }] }, fAno(l, Number(a.ano ?? 2027))],
    run: (v) => {
      const r = s(v, 'regiao') === 'madeira' ? 'madeira' : 'acores', y = n(v, 'ano');
      const regs = REGIONAIS.filter((f) => f.regiao === r && (!f.desde || y >= f.desde));
      const total = feriados(y, { local: { nome: '', regiao: r } });
      return {
        label: T(l, `Feriados regionais ${y}: ${REGIAO_NOME[r].pt}`, `Regional holidays ${y}: ${REGIAO_NOME[r].en}`),
        value: T(l, `${num(total.length, l)} feriados`, `${num(total.length, l)} holidays`),
        sub: T(l, `${num(NACIONAIS.length, l)} nacionais + ${num(regs.length, l)} regionais, antes do feriado municipal.`, `${num(NACIONAIS.length, l)} national + ${num(regs.length, l)} regional, before the municipal holiday.`),
        rows: regs.map((f) => [f.name[l], dShort(f.date(y), l)] as [string, string]),
        table: { caption: T(l, 'Feriados regionais nos próximos anos', 'Regional holidays in the coming years'), headers: [T(l, 'Ano', 'Year'), ...regs.map((f) => f.name[l])], rows: yearRange(y, y + 4).map((x) => [String(x), ...regs.map((f) => dLong(f.date(x), l))]), align: ['l', ...regs.map(() => 'l' as const)] },
      };
    },
  };
}

/* ------------------------------------------------------------------ prazo em dias úteis */
/** « Daqui a N dias úteis, que dia é? » : outra pergunta que a contagem anual (mini-simulador da página Dias úteis,
 *  testeurs naïfs du 2026-11-14, tour 2 : « 253 » deux fois). Conta só segunda a sexta sem feriado nacional. */
function pzSpec(l: Lang, a: Args = {}): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'mes', label: T(l, 'Mês de partida', 'Starting month'), def: String(a.mes ?? 1), options: MESES(l).map((m, i) => ({ value: String(i + 1), label: m })) },
      { id: 'dia', label: T(l, 'Dia de partida', 'Starting day'), def: Number(a.dia ?? 4), max: 31 },
      { id: 'n', label: T(l, 'Dias úteis a contar', 'Working days to count'), def: Number(a.n ?? 10), unit: T(l, 'dias', 'days'), max: 250 },
      fAno(l, Number(a.ano ?? 2027)),
    ],
    run: (v) => {
      const y = n(v, 'ano'), m = Math.min(12, Math.max(1, n(v, 'mes'))), ult = new Date(Date.UTC(y, m, 0)).getUTCDate();
      const d = Math.min(ult, Math.max(1, Math.round(n(v, 'dia')))), k = Math.max(1, Math.round(n(v, 'n')));
      const ini = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const r = somaDiasUteis(ini, k);
      const nomes = r.feriadosSaltados.map((x) => feriados(Number(x.slice(0, 4))).find((f) => f.date === x)?.name[l] ?? x);
      return {
        label: T(l, `${num(k, l)} ${k === 1 ? 'dia útil' : 'dias úteis'} depois de ${dLong(ini, l)}`, `${num(k, l)} working ${k === 1 ? 'day' : 'days'} after ${dLong(ini, l)}`),
        value: dWeek(r.fim, l),
        sub: T(l, 'O dia de partida não conta; sábados, domingos e feriados nacionais saltam-se.', 'The starting day does not count; Saturdays, Sundays and national holidays are skipped.'),
        rows: [
          [T(l, 'Dias de calendário', 'Calendar days'), num(r.corridos, l)],
          [T(l, 'Sábados e domingos saltados', 'Saturdays and Sundays skipped'), num(r.fimDeSemana, l)],
          [T(l, 'Feriados saltados', 'Holidays skipped'), nomes.length ? nomes.join(', ') : T(l, 'nenhum', 'none')],
        ],
      };
    },
  };
}

export const SPECS: Record<string, (l: Lang, arg?: Args) => ToolSpec> = { pt: ptSpec, fe: feSpec, fm: fmSpec, du: duSpec, pa: paSpec, ca: caSpec, fd: fdSpec, fs: fsSpec, fr: frSpec, sp: spSpec, rg: rgSpec, pz: pzSpec };
export const TOOL_KINDS = [...Object.keys(SPECS), 'calendario'];
export function getTool(kind: string, l: Lang, arg?: Args): ToolSpec {
  const f = SPECS[kind]; if (!f) throw new Error(`ferramenta desconhecida: ${kind}`);
  return f(l, arg);
}
/** Corre uma ferramenta com os valores por omissão (ou os dados): serve às páginas e aos testes. */
export function runTool(kind: string, l: Lang, arg?: Args, values?: V): ToolOut {
  const spec = getTool(kind, l, arg);
  const v = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])) as V;
  return spec.run(resolve(spec.inputs, { ...v, ...(values ?? {}) }));
}
export { formatNumber, isoWeek, nthWeekday, toIso, isWeekend };
