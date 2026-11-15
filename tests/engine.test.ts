import { describe, it, expect } from 'vitest';
import { pascoa, pascoaMeeus, feriados, emDiaUtil, aoFimDeSemana, carnaval, horaVerao, dataRegra, municipalCoincide } from '../src/lib/engine/feriados';
import { otimiza, pontes, pontesDeUmDia, diasUteis, isoWeek, weeksInYear, segundaDaSemana } from '../src/lib/engine/pontes';
import { CONCELHOS, CONFIRMADOS, concelhoById } from '../src/lib/engine/concelhos';
import { lisboaInstant } from '../src/lib/zeit';
import { runTool, SPECS } from '../src/lib/tool-specs';
import { GUIDES } from '../src/lib/pages';
import { PLANNED_GUIDES } from '../src/lib/planned';

const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

describe('Páscoa', () => {
  it('datas conhecidas', () => {
    expect(pascoa(2024)).toBe('2024-03-31');
    expect(pascoa(2025)).toBe('2025-04-20');
    expect(pascoa(2026)).toBe('2026-04-05');
    expect(pascoa(2027)).toBe('2027-03-28');
    expect(pascoa(2028)).toBe('2028-04-16');
  });
  it('Gauss = Meeus de 1600 a 2600, sempre entre 22 de março e 25 de abril', () => {
    for (let y = 1600; y <= 2600; y++) {
      const p = pascoa(y); expect(p).toBe(pascoaMeeus(y));
      const md = p.slice(5); expect(md >= '03-22' && md <= '04-25').toBe(true);
    }
  });
});

describe('Feriados nacionais (CT art. 234.º)', () => {
  it('13 feriados obrigatórios por ano, Domingo de Páscoa incluído', () => {
    for (const y of [2026, 2027, 2028, 2040]) expect(feriados(y).length).toBe(13);
  });
  it('2027: Corpo de Deus a 27 de maio, Sexta-Feira Santa a 26 de março', () => {
    const f = feriados(2027);
    expect(f.find((x) => x.id === 'corpo-deus')!.date).toBe('2027-05-27');
    expect(f.find((x) => x.id === 'sexta-santa')!.date).toBe('2027-03-26');
  });
  it('2027: 25 de abril, 1 de maio, 15 de agosto e Natal ao fim de semana', () => {
    expect(aoFimDeSemana(feriados(2027)).map((f) => f.id).sort()).toEqual(['assuncao', 'liberdade', 'natal', 'trabalhador'].sort());
    expect(emDiaUtil(feriados(2027)).length).toBe(8);
  });
  it('regionais: Açores P+50, Madeira 2 de abril só desde 2025', () => {
    expect(feriados(2027, { local: { nome: 'x', regiao: 'acores' } }).find((f) => f.id === 'dia-acores')!.date).toBe('2027-05-17');
    expect(feriados(2024, { local: { nome: 'x', regiao: 'madeira' } }).some((f) => f.id === 'autonomia-madeira')).toBe(false);
    expect(feriados(2027, { local: { nome: 'x', regiao: 'madeira' } }).length).toBe(16);
  });
  it('o feriado municipal não se soma quando coincide', () => {
    const l = { nome: 'x', regiao: 'continente' as const, feriado: { regra: '06-10', nome: 'y' } };
    expect(feriados(2027, { local: l }).length).toBe(13);
    expect(municipalCoincide(2027, l)?.id).toBe('portugal');
  });
});

describe('Datas móveis', () => {
  it('Carnaval, hora de verão, regras', () => {
    expect(carnaval(2027)).toEqual({ domingo: '2027-02-07', terca: '2027-02-09', cinzas: '2027-02-10' });
    expect(horaVerao(2027)).toEqual({ inicio: '2027-03-28', fim: '2027-10-31' });
    expect(dataRegra(2026, 'P+51')).toBe('2026-05-26');
    expect(dataRegra(2027, 'P+39')).toBe('2027-05-06');
    expect(dataRegra(2027, '06-13')).toBe('2027-06-13');
  });
});

describe('Pontes e dias úteis', () => {
  it('otimizador: nunca acima do orçamento, mais férias nunca dão menos dias', () => {
    for (const y of [2026, 2027, 2028]) {
      let prev = 0;
      for (let b = 0; b <= 30; b++) { const p = otimiza(y, b); expect(p.ferie).toBeLessThanOrEqual(b); expect(p.liberi).toBeGreaterThanOrEqual(prev); prev = p.liberi; }
    }
  });
  it('2027: pontes de um dia (quintas e terças)', () => {
    expect(pontesDeUmDia(2027).map((p) => p.ferieDal).sort()).toEqual(['2027-05-28', '2027-06-11', '2027-10-04']);
    expect(pontes(2027).length).toBeGreaterThan(5);
  });
  it('dias úteis e semanas ISO', () => {
    expect(sum(diasUteis(2027))).toBe(253);
    expect(isoWeek('2027-01-01')).toEqual({ year: 2026, week: 53 });
    expect(weeksInYear(2027)).toBe(52);
    expect(segundaDaSemana(2027, 1)).toBe('2027-01-04');
  });
});

describe('Concelhos', () => {
  it('308 concelhos, ids únicos, cada data confirmada tem fonte https/http, extrato e data de leitura', () => {
    expect(CONCELHOS.length).toBe(308);
    expect(new Set(CONCELHOS.map((c) => c.id)).size).toBe(308);
    expect(CONCELHOS.filter((c) => c.regiao === 'acores').length).toBe(19);
    expect(CONCELHOS.filter((c) => c.regiao === 'madeira').length).toBe(11);
    for (const c of CONFIRMADOS) {
      expect(c.feriado!.url).toMatch(/^https?:\/\//);
      expect(c.feriado!.extrato.length).toBeGreaterThan(20);
      expect(c.feriado!.lido).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(dataRegra(2027, c.feriado!.regra)))).toBe(false);
    }
  });
  it('Lisboa 13 de junho, Porto 24 de junho, Matosinhos terça a seguir ao Pentecostes', () => {
    expect(concelhoById('lisboa')!.feriado!.regra).toBe('06-13');
    expect(concelhoById('porto')!.feriado!.regra).toBe('06-24');
    expect(dataRegra(2026, concelhoById('matosinhos')!.feriado!.regra)).toBe('2026-05-26');
  });
});

describe('Hora de Lisboa', () => {
  it('meia-noite e mudanças de hora', () => {
    expect(lisboaInstant('2027-01-01')).toBe('2027-01-01T00:00:00.000Z');
    expect(lisboaInstant('2027-06-10')).toBe('2027-06-09T23:00:00.000Z');
  });
});

describe('Ferramentas e páginas', () => {
  it('cada ferramenta produz um resultado nas duas línguas', () => {
    for (const k of Object.keys(SPECS)) for (const l of ['pt', 'en'] as const) { const o = runTool(k, l); expect(o.value, `${k} ${l}`).toBeTruthy(); }
  });
  it('todas as páginas previstas existem, uma só vez', () => {
    const ids = GUIDES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of PLANNED_GUIDES) expect(ids, id).toContain(id);
  });
});

/* Testeurs naïfs du 2026-11-14, 2e tour (reports/test-naif-2026-11-14-tour2/synthese.md). */
import { somaDiasUteis } from '../src/lib/engine/pontes';
import { phraseFixe } from '../src/lib/mini-specs';
import { HOME } from '../src/content/home';

describe('Feriado municipal: só conta como dia livre quando a pessoa o diz (tour 2, défaut 1)', () => {
  const porto = concelhoById('porto')!;
  it('motor: municipal false = dia de trabalho, nenhuma ponte com o São João', () => {
    expect(feriados(2027, { local: porto, municipal: false }).some((f) => f.id === 'municipal')).toBe(false);
    expect(pontes(2027, { local: porto, municipal: false }).some((b) => b.feste.includes('municipal'))).toBe(false);
    expect(pontes(2027, { local: porto, municipal: true }).some((b) => b.feste.includes('municipal'))).toBe(true);
  });
  it('otimizador: por omissão o feriado municipal não entra, e o resultado diz porquê e como o juntar', () => {
    const fora = runTool('pt', 'pt', { ano: 2027, ferias: 3, concelho: 'porto' });
    const dentro = runTool('pt', 'pt', { ano: 2027, ferias: 3, concelho: 'porto', municipal: 'sim' });
    expect(fora.note).toMatch(/não entra na conta: responda « Tenho o dia livre »/);
    expect(dentro.note ?? '').not.toMatch(/não entra na conta/);
    expect(Number(dentro.value.split(' ')[0])).toBeGreaterThanOrEqual(Number(fora.value.split(' ')[0]));
    // A pergunta é visível (fora de « Mais opções ») e só aparece quando o concelho tem data confirmada.
    const campo = SPECS.pt('pt').inputs.find((i) => i.id === 'municipal')!;
    expect(campo.adv).toBeFalsy();
    expect(campo.showIf!({ concelho: 'porto' })).toBe(true);
    expect(campo.showIf!({ concelho: '' })).toBe(false);
  });
  it('página do concelho: a ponte mostra os dois casos', () => {
    const o = runTool('fm', 'pt', { concelho: 'porto', ano: 2027 });
    const r = Object.fromEntries(o.rows.map(([a, b]) => [a, b]));
    expect(r['Ponte, se tiver o dia livre']).toBe('1 dia de férias → 4 dias livres');
    expect(r['Se trabalhar nesse dia']).toMatch(/nenhuma ponte/);
    expect(r['É obrigatório?']).toMatch(/^Não por lei/);
  });
  it('página geral sem concelho escolhido: nada de Braga por omissão, e quantas datas estão confirmadas', () => {
    const o = runTool('fm', 'pt', { concelho: '', ano: 2027 });
    // Tour 3 : appel à choisir en gros ; le nombre de dates confirmées reste dit, en petit.
    expect(o.value).toBe('Escolha o seu concelho acima');
    expect(o.rows[0][1]).toMatch(new RegExp(`^${CONFIRMADOS.length} de ${CONCELHOS.length};`));
  });
});

describe('Mini-simuladores: outra pergunta que a ferramenta do topo, e uma frase curta (tour 2, défauts 2 e 3)', () => {
  const minis: string[] = [];
  const h = new Proxy({} as Record<string, unknown>, { get: (_t, k) => (k === 'lang' ? 'pt' : k === 'mini' ? (kind: string) => { minis.push(kind); return ''; } : k === 'T' ? (a: string) => a : () => '') });
  it('o mini-simulador de cada página nunca repete o calculador do topo', () => {
    for (const g of GUIDES) {
      minis.length = 0; (g.pt.body as (x: unknown) => string)(h);
      expect(minis.length, g.id).toBeGreaterThan(0);
      for (const k of minis) expect(k, `${g.id}: mini ${k} = ferramenta do topo`).not.toBe(g.tool);
    }
    minis.length = 0; (HOME.pt.why as (x: unknown) => string)(h);
    expect(minis).not.toContain('pt');
  });
  it('a linha do que a página fixou é curta e não fala de opções escondidas', () => {
    const f = phraseFixe('pt', 'pt', { ano: 2028, concelho: 'lisboa', ferias: 6, municipal: 'sim' }, ['ano', 'concelho', 'carnaval', 'vesperas']);
    expect(f).toBe('Conta feita para 2028 em Lisboa.');
    expect(phraseFixe('pt', 'pt', { ano: 2027, ferias: 4, carnaval: 'sim' }, ['ano', 'concelho', 'municipal', 'carnaval', 'vesperas'])).toBe('Conta feita para 2027, com a terça de Carnaval livre.');
    expect(phraseFixe('du', 'pt', { ano: 2027 }, ['ano', 'concelho', 'municipal', 'carnaval', 'vesperas'])).not.toMatch(/Trabalha-se|seg-sex/);
  });
  it('o gros chiffre de cada ferramenta diz o que mede: dias livres ≠ dias úteis de férias', () => {
    // Tour 3 : le total de plusieurs pontes n'est pas « seguidos » ; il est bien la somme des blocs, sans chevauchement.
    const pt = runTool('pt', 'pt');
    expect(pt.label).toMatch(/^Com \d+ dias de férias em 2027, somando as pontes/);
    expect(pt.label).not.toMatch(/seguidos/);
    const pl = otimiza(2027, 8);
    expect(pl.liberi).toBe(pl.blocchi.reduce((a, b) => a + b.liberi, 0));
    for (let i = 1; i < pl.blocchi.length; i++) expect(pl.blocchi[i].liberoDal > pl.blocchi[i - 1].liberoAl).toBe(true);
    expect(pt.value).toBe(`${pl.liberi} dias livres`);
    // Chaque ligne du résultat dit le jour à poser.
    expect(pt.rows[0][0]).toMatch(/tirar férias: /);
    // Tour 4 : le plan n'est plus répété en tableau ; chaque ligne dit grâce à quel feriado, et toutes les pontes y sont.
    expect(pt.table).toBeUndefined();
    expect(pt.rows[0][0]).toMatch(/ · feriado: /);
    expect(pt.rows.length).toBe(pl.blocchi.length);
    const fr = runTool('fr', 'pt', { ano: 2027 });
    expect(fr.value).toBe('22 dias de férias');
    expect(fr.label).toMatch(/^Por lei, as suas férias por ano/);
    expect(fr.rows.map((r) => r[0]).join(' | ')).not.toMatch(/22/);
    expect(fr.rows.map((r) => r[0]).join(' | ')).not.toMatch(/trocar por dinheiro/);
  });
  it('a ajuda do concelho não remete para um campo invisível (tour 3)', () => {
    for (const k of ['pt', 'du']) {
      const help = SPECS[k]('pt').inputs.find((i) => i.id === 'concelho')!.help ?? '';
      expect(help).not.toMatch(/abaixo/);
    }
    expect(runTool('fm', 'pt', { concelho: '', ano: 2027 }).value).toBe('Escolha o seu concelho acima');
  });
  it('prazo em dias úteis: fins de semana e feriados saltados', () => {
    expect(somaDiasUteis('2027-01-04', 10).fim).toBe('2027-01-18');
    const cd = somaDiasUteis('2027-05-26', 1);
    expect(cd.fim).toBe('2027-05-28');
    expect(cd.feriadosSaltados).toEqual(['2027-05-27']);
  });
});
