/** Pontes 2026 (fim do ano) e 2028: o otimizador regulado para o ano. Números e datas: motor. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tabelaPontes, tabelaRendimento } from '../../lib/bausteine';
import { span, wdLong, dmo, nn } from '../../lib/tool-specs';

const fd = (y: number, id: string) => K.feriados(y).find((f) => f.id === id)!.date;
const has = (y: number, id: string, o = {}) => K.pontes(y, o).filter((b) => b.feste.includes(id));
const res26 = has(2026, 'restauracao').find((b) => b.ferie === 1)!;
const ima26 = has(2026, 'imaculada').find((b) => b.ferie === 1)!;
const nat26 = has(2026, 'natal').find((b) => b.feste.includes('ano-novo'))!;
const nat26v = K.pontes(2026, { vesperas: true }).find((b) => b.feste.includes('ano-novo') && b.ferieDal > '2026-12-25')!;
const o26 = K.otimiza(2026, 10), o28 = K.otimiza(2028, 10), o28_22 = K.otimiza(2028, 22);
const um28 = K.pontesDeUmDia(2028);
const dez28 = has(2028, 'restauracao').find((b) => b.feste.includes('imaculada'))!;
const nat28 = has(2028, 'natal').find((b) => b.feste.includes('ano-novo'))!;
const abr28 = K.pontes(2028).find((b) => b.feste.includes('liberdade') && b.feste.includes('trabalhador'))!;
const lib28 = um28.find((b) => b.feste.includes('liberdade'))!;
const u26 = K.emDiaUtil(K.feriados(2026)).length, u27 = K.emDiaUtil(K.feriados(2027)).length, u28 = K.emDiaUtil(K.feriados(2028)).length;
const porto = K.concelhoById('porto')!;

export default [
  defineGuide({
    id: 'pontes-2026', group: 'ferramentas', order: 2, tool: 'pt', toolArg: { ano: 2026, ferias: 6 },
    related: ['home', 'feriados-2026', 'pontes-2028', 'calendario-2027', 'ferias'],
    sources: ['ct234', 'ct', 'l8-2016'],
    pt: {
      slug: 'pontes-2026', nav: 'Pontes 2026', card: '1 e 8 de dezembro e Natal: as últimas pontes do ano',
      title: 'Pontes 2026: dezembro e Natal, as últimas pontes do ano',
      description: 'Pontes 2026 que ainda pode aproveitar: a segunda 30 de novembro, a segunda 7 de dezembro e a semana entre o Natal e o Ano Novo, e as férias a usar nelas.',
      h1: 'Pontes 2026: o que ainda resta em dezembro',
      intro: 'O ano está a acabar, mas ainda há três pontes pela frente: indique quantos dias de férias lhe restam e o otimizador põe-nos onde rendem mais.',
      resume: `Do ano de 2026 restam três pontes, e estão entre as melhores. O 1 de Dezembro calha a uma ${wdLong(fd(2026, 'restauracao'), 'pt')}: com um só dia de férias a ${dmo(res26.ferieDal, 'pt')} fica em casa ${nn(res26.liberi, 'pt')} dias, de ${dmo(res26.liberoDal, 'pt')} a ${dmo(res26.liberoAl, 'pt')}. Uma semana depois a Imaculada Conceição repete o desenho: férias a ${dmo(ima26.ferieDal, 'pt')} e ${nn(ima26.liberi, 'pt')} dias livres até ${dmo(ima26.liberoAl, 'pt')}. Depois vem o Natal, que é uma ${wdLong(fd(2026, 'natal'), 'pt')}, com o Ano Novo de 2027 também à sexta: ${nn(nat26.ferie, 'pt')} dias de férias, ${span(nat26.ferieDal, nat26.ferieAl, 'pt')}, dão ${nn(nat26.liberi, 'pt')} dias livres seguidos até ${dmo(nat26.liberoAl, 'pt')} de 2027. Quem tem o dia 31 livre por tolerância de ponto ou por contrato gasta ${nn(nat26v.ferie, 'pt')} dias. No ano inteiro, dez dias de férias bem distribuídos valiam ${nn(o26.liberi, 'pt')} dias livres; para os meses que já passaram a ferramenta continua a mostrar o cálculo, útil para comparar 2026 com 2027 e 2028.`,
      faqs: [
        { q: 'O 30 de novembro de 2026 é ponte?', a: `Sim. O 1 de Dezembro, Restauração da Independência, é uma ${wdLong(fd(2026, 'restauracao'), 'pt')} em 2026. Quem tira férias na segunda-feira, 30 de novembro, tem quatro dias livres, de sábado 28 a terça 1. É uma das pontes repostas pela Lei n.º 8/2016: entre 2013 e 2015 o 1 de Dezembro não foi feriado.` },
        { q: 'Quantos dias de férias são precisos no Natal de 2026?', a: `O Natal é uma sexta-feira e o Ano Novo de 2027 também. Com ${nn(nat26.ferie, 'pt')} dias de férias, de 28 a 31 de dezembro, fica em casa ${nn(nat26.liberi, 'pt')} dias seguidos, até domingo 3 de janeiro. Se o 31 de dezembro for livre, bastam ${nn(nat26v.ferie, 'pt')}.` },
        { q: 'As férias de 2026 que não gozei perdem-se?', a: 'Em regra as férias gozam-se no ano civil em que se vencem. O Código do Trabalho permite gozá-las até 30 de abril do ano seguinte, em acumulação ou não com as desse ano, por acordo ou quando o trabalhador as queira gozar com um familiar que vive no estrangeiro. Fale com o empregador antes do fim do ano.' },
      ],
      body: (h) => `<h2>As pontes de 2026, uma a uma</h2>
<p>A tabela ordena todas as pontes de 2026 da mais rentável para a menos rentável. As primeiras, de um só dia de férias, foram quatro: o 2 de janeiro, o 5 de junho depois do Corpo de Deus, o 30 de novembro e o 7 de dezembro. As duas primeiras já passaram; as de dezembro ainda se podem pedir. Entre as compridas sobra a semana de Natal, a melhor do ano porque junta o Natal e o Ano Novo.</p>
${tabelaPontes(h, 2026, null, 8)}
<p>Em 2026 o 25 de Abril e o 15 de Agosto calharam a um sábado e o Dia de Todos os Santos a um domingo: três feriados sem dia livre a mais. Em ${h.a('feriados-2026', 'feriados 2026')} encontra a lista completa com o dia da semana.</p>
<h2>Natal de 2026 com e sem o dia 31 livre</h2>
<p>A véspera de Natal e a véspera de Ano Novo não são feriados. Se o contrato, a empresa ou uma tolerância de ponto lhe dão esses dias, escolha « Livres » nas opções da ferramenta: com ${nn(nat26v.ferie, h.lang)} dias de férias chega a ${nn(nat26v.liberi, h.lang)} dias livres. Sem eles precisa de ${nn(nat26.ferie, h.lang)} dias para ${nn(nat26.liberi, h.lang)}.</p>
${h.mini('fd', { p: ['feriado'], d: { feriado: 'imaculada', ano: 2026 }, c: 'Os feriados do fim de 2026, um a um: que dia tirar?' })}
<p>Se ainda tem férias de 2026 e não sabe se as usa já, lembre-se do ${h.src('ct', 'artigo 240.º do Código do Trabalho')}: o gozo pode ir até 30 de abril de 2027 em certos casos. A conta das suas férias está na página ${h.a('ferias', 'férias')}; as pontes do próximo ano estão na ${h.a('home', 'página dos feriados 2027')}.</p>
<h2>2026 comparado</h2>
<p>O que rende o mesmo número de dias de férias muda muito de um ano para o outro, porque depende de quantos feriados calham em dia útil. Em 2026 foram ${nn(u26, h.lang)}, em 2027 serão ${nn(u27, h.lang)} e em 2028 ${nn(u28, h.lang)}.</p>
${tabelaRendimento(h, [2026, 2027, 2028])}`,
    },
    en: {
      slug: 'long-weekends-2026', nav: 'Long weekends 2026', card: '1 and 8 December and Christmas: the last bridges',
      title: 'Long weekends 2026 in Portugal: December bridges left',
      description: 'Long weekends still left in 2026 in Portugal: Monday 30 November, Monday 7 December and the week between Christmas and New Year, with the leave they need.',
      h1: 'Long weekends 2026 in Portugal: what is left in December',
      intro: 'The year is nearly over, but three long weekends are still ahead: enter how many leave days you have left and the planner puts them where they pay off most.',
      resume: `Three bridges remain in 2026, and they are among the best of the year. Restoration of Independence, 1 December, falls on a ${wdLong(fd(2026, 'restauracao'), 'en')}: one leave day on ${dmo(res26.ferieDal, 'en')} gives ${nn(res26.liberi, 'en')} days off, from ${dmo(res26.liberoDal, 'en')} to ${dmo(res26.liberoAl, 'en')}. A week later the Immaculate Conception repeats the pattern: leave on ${dmo(ima26.ferieDal, 'en')} and ${nn(ima26.liberi, 'en')} days off up to ${dmo(ima26.liberoAl, 'en')}. Then comes Christmas Day, a ${wdLong(fd(2026, 'natal'), 'en')}, with New Year's Day 2027 on a Friday too: ${nn(nat26.ferie, 'en')} leave days, ${span(nat26.ferieDal, nat26.ferieAl, 'en')}, give ${nn(nat26.liberi, 'en')} days off in a row up to ${dmo(nat26.liberoAl, 'en')} 2027. If 31 December is off for you by contract or tolerância de ponto, you need ${nn(nat26v.ferie, 'en')}. Over the whole year, ten well-placed leave days were worth ${nn(o26.liberi, 'en')} days off; for the months already gone the tool still shows the result, handy for comparing 2026 with 2027 and 2028.`,
      faqs: [
        { q: 'Is 30 November 2026 a bridge day in Portugal?', a: `Yes. 1 December, Restoration of Independence, is a ${wdLong(fd(2026, 'restauracao'), 'en')} in 2026. Take Monday 30 November off and you get four days, Saturday 28 to Tuesday 1. It is one of the holidays restored by Law 8/2016: from 2013 to 2015, 1 December was not a holiday.` },
        { q: 'How much leave do I need over Christmas 2026?', a: `Christmas Day is a Friday and so is New Year's Day 2027. ${nn(nat26.ferie, 'en')} leave days, 28 to 31 December, give ${nn(nat26.liberi, 'en')} days off in a row, up to Sunday 3 January. If 31 December is off, ${nn(nat26v.ferie, 'en')} are enough. The tool above recalculates it with your own leave days and municipality.` },
        { q: 'Do I lose unused 2026 leave in Portugal?', a: 'As a rule leave is taken in the calendar year it falls due. The Labour Code allows it to be taken up to 30 April of the following year, on its own or with that year’s leave, by agreement or when the employee wants to spend it with a family member who lives abroad. Talk to your employer before the year ends.' },
      ],
      body: (h) => `<h2>The 2026 long weekends, one by one</h2>
<p>The table ranks every bridge of 2026 from the best value down. The one-leave-day bridges were four: 2 January, 5 June after Corpus Christi, 30 November and 7 December. The first two are behind us; the December ones can still be requested. Of the longer ones, Christmas week remains, the best of the year because it joins Christmas and New Year.</p>
${tabelaPontes(h, 2026, null, 8)}
<p>In 2026, 25 April and 15 August fell on a Saturday and All Saints' Day on a Sunday: three holidays with no extra day off. The full list with weekdays is on ${h.a('feriados-2026', 'public holidays 2026')}.</p>
<h2>Christmas 2026 with and without 31 December off</h2>
<p>Christmas Eve and New Year's Eve are not public holidays. If your contract, employer or a tolerância de ponto gives them off, choose "Days off" in the tool's options: ${nn(nat26v.ferie, h.lang)} leave days then stretch to ${nn(nat26v.liberi, h.lang)} days off. Without them you need ${nn(nat26.ferie, h.lang)} days for ${nn(nat26.liberi, h.lang)}.</p>
${h.mini('fd', { p: ['feriado'], d: { feriado: 'imaculada', ano: 2026 }, c: 'The late-2026 holidays one by one: which day to take off?' })}
<p>If you still have 2026 leave and are unsure whether to use it now, remember ${h.src('ct', 'article 240 of the Labour Code')}: in some cases it can run to 30 April 2027. Your leave entitlement is worked out on the ${h.a('ferias', 'annual leave')} page; next year's bridges are on the ${h.a('home', 'holidays 2027')} page.</p>
<h2>2026 compared</h2>
<p>What the same number of leave days buys changes a lot from year to year, because it depends on how many holidays fall on a weekday. In 2026 there were ${nn(u26, h.lang)}, in 2027 there will be ${nn(u27, h.lang)}, in 2028 ${nn(u28, h.lang)}.</p>
${tabelaRendimento(h, [2026, 2027, 2028])}`,
    },
  }),
  defineGuide({
    id: 'pontes-2028', group: 'ferramentas', order: 3, tool: 'pt', toolArg: { ano: 2028 },
    related: ['home', 'feriados-2028', 'pontes-2026', 'ferias', 'feriado-municipal'],
    sources: ['ct234', 'ct', 'l8-2016'],
    pt: {
      slug: 'pontes-2028', nav: 'Pontes 2028', card: 'Quatro pontes de um dia e um dezembro longo',
      title: 'Pontes 2028: o melhor ano para férias, planeie cedo',
      description: 'Pontes 2028 em Portugal: dez feriados em dia útil, quatro pontes de um só dia de férias e dois blocos de dez dias em dezembro, também para o seu concelho.',
      h1: 'Pontes 2028: o ano das pausas compridas',
      intro: 'Indique os dias de férias e, se quiser, o seu concelho: o otimizador distribui as férias de 2028 pelas pontes para lhe dar o máximo de dias livres seguidos.',
      resume: `O ano de 2028 é o contrário de 2027. Dos ${nn(K.feriados(2028).length, 'pt')} feriados nacionais, ${nn(u28, 'pt')} calham de segunda a sexta, e só o Ano Novo e o Dia de Portugal caem ao sábado. Daí nascem ${nn(um28.length, 'pt')} pontes clássicas de um só dia de férias: ${um28.map((b) => dmo(b.ferieDal, 'pt')).join(', ')}, à volta do 25 de Abril, do Corpo de Deus, da Assunção e do 5 de Outubro. O 25 de Abril à terça e o 1.º de Maio à segunda estão separados por três dias úteis, e dezembro junta o 1 e o 8, ambos à sexta: ${nn(dez28.ferie, 'pt')} dias de férias, ${span(dez28.ferieDal, dez28.ferieAl, 'pt')}, dão ${nn(dez28.liberi, 'pt')} dias livres. O Natal à segunda com o Ano Novo de 2029 também à segunda dá outro bloco de ${nn(nat28.liberi, 'pt')} dias por ${nn(nat28.ferie, 'pt')} de férias. Com dez dias de férias bem distribuídos chega a ${nn(o28.liberi, 'pt')} dias livres; com os 22 dias da lei a ${nn(o28_22.liberi, 'pt')}. Quem quer uma viagem longa na primavera faz bem em pedir as férias com muita antecedência.`,
      faqs: [
        { q: 'Porque é que 2028 é um bom ano para pontes?', a: `Porque ${nn(u28, 'pt')} dos ${nn(K.feriados(2028).length, 'pt')} feriados calham em dia útil, vários à terça ou à quinta. Um feriado à terça pede a segunda como ponte, um à quinta pede a sexta. Em 2028 isso acontece com o 25 de Abril, a Assunção, o Corpo de Deus e o 5 de Outubro; o 1 e o 8 de dezembro, à sexta, alongam o fim de semana sozinhos.` },
        { q: 'Como se faz a ponte do 25 de Abril de 2028?', a: `O 25 de Abril de 2028 é uma terça e o 1.º de Maio uma segunda. Um dia de férias na segunda 24 de abril dá quatro dias livres. Juntando os três dias de quarta 26 a sexta 28, com ${nn(lib28.ferie + abr28.ferie, 'pt')} dias de férias ao todo fica em casa de ${dmo(lib28.liberoDal, 'pt')} a ${dmo(abr28.liberoAl, 'pt')}.` },
        { q: 'E o São João de 2028 no Porto?', a: `Em 2028 o 24 de junho é um ${wdLong(K.dataRegra(2028, porto.feriado!.regra), 'pt')}: o feriado municipal do Porto não dá ponte nem dia livre a mais. O Corpo de Deus, a 15 de junho, continua a dar a ponte de sexta-feira 16. Em 2027 é diferente: o São João calha a uma quinta-feira e dá ponte de um dia na sexta 25 a quem trabalha no Porto.` },
      ],
      body: (h) => `<h2>As melhores pontes de 2028</h2>
<p>A tabela ordena as pontes de 2028 pelo rendimento: primeiro as que transformam um dia de férias em quatro dias livres, depois os blocos de dezembro e as pontes de dois, três ou quatro dias à volta da Páscoa, do 1.º de Maio e do Dia de Todos os Santos.</p>
${tabelaPontes(h, 2028, null, 10)}
<p>A Páscoa de 2028 é a ${h.day(K.pascoa(2028))}, tarde, e o 25 de Abril vem nove dias depois. As semanas de abril podem por isso juntar-se: a tabela mostra que a semana entre o 25 de Abril e o 1.º de Maio custa só ${nn(abr28.ferie, h.lang)} dias de férias para ${nn(abr28.liberi, h.lang)} dias livres.</p>
<h2>Quanto rendem as suas férias em 2028</h2>
<p>A comparação com os anos vizinhos mostra como 2028 é generoso: com as mesmas férias tem mais dias livres seguidos do que em 2027. A diferença vem toda do calendário, porque os feriados são os mesmos.</p>
${tabelaRendimento(h, [2026, 2027, 2028])}
<p>O feriado municipal do seu concelho pode juntar uma ponte. Em Lisboa, o Santo António calha em 2028 a uma terça-feira, dois dias antes do Corpo de Deus: quem trabalha em Lisboa e tem o feriado no contrato pode fazer uma semana curta com poucos dias de férias. A pesquisa está em ${h.a('feriado-municipal', 'feriado municipal')}.</p>
${h.mini('fe', { p: ['concelho'], d: { ano: 2028, concelho: 'lisboa' }, c: 'Os feriados de 2028 no seu concelho' })}
<p>O mínimo legal continua a ser 22 dias úteis, segundo o ${h.src('ct', 'artigo 238.º do Código do Trabalho')}; quem tem mais dias por convenção coletiva pode usá-los para unir as pontes de abril e de dezembro.</p>`,
    },
    en: {
      slug: 'long-weekends-2028', nav: 'Long weekends 2028', card: 'Four one-day bridges and a long December',
      title: 'Long weekends 2028 in Portugal: the year to plan leave',
      description: 'Long weekends 2028 in Portugal: ten holidays on a weekday, four bridges for one leave day and two ten-day blocks in December, also for your municipality.',
      h1: 'Long weekends 2028 in Portugal: the year for long breaks',
      intro: 'Enter your leave days and, if you like, your municipality: the planner spreads your 2028 leave over the long weekends to give you the most consecutive days off.',
      resume: `2028 is the opposite of 2027. Of the ${nn(K.feriados(2028).length, 'en')} national holidays, ${nn(u28, 'en')} fall between Monday and Friday, and only New Year's Day and Portugal Day land on a Saturday. That creates ${nn(um28.length, 'en')} classic bridges costing a single leave day: ${um28.map((b) => dmo(b.ferieDal, 'en')).join(', ')}, around 25 April, Corpus Christi, the Assumption and 5 October. 25 April on a Tuesday and 1 May on a Monday are only three working days apart, and December joins 1 and 8 December, both Fridays: ${nn(dez28.ferie, 'en')} leave days, ${span(dez28.ferieDal, dez28.ferieAl, 'en')}, give ${nn(dez28.liberi, 'en')} days off. Christmas Day on a Monday with New Year's Day 2029 on a Monday too makes another block of ${nn(nat28.liberi, 'en')} days for ${nn(nat28.ferie, 'en')} leave days. Ten well-placed leave days reach ${nn(o28.liberi, 'en')} days off; the legal 22 reach ${nn(o28_22.liberi, 'en')}. If you want a long trip in spring, ask for your leave well in advance.`,
      faqs: [
        { q: 'Why is 2028 a good year for long weekends in Portugal?', a: `Because ${nn(u28, 'en')} of the ${nn(K.feriados(2028).length, 'en')} holidays fall on a weekday, several on a Tuesday or a Thursday. A Tuesday holiday calls for the Monday as a bridge, a Thursday one for the Friday. In 2028 that happens with 25 April, the Assumption, Corpus Christi and 5 October; 1 and 8 December, on a Friday, lengthen the weekend by themselves.` },
        { q: 'How do I bridge 25 April 2028?', a: `25 April 2028 is a Tuesday and 1 May a Monday. One leave day on Monday 24 April gives four days off. Add the three days from Wednesday 26 to Friday 28 and ${nn(lib28.ferie + abr28.ferie, 'en')} leave days in all keep you off from ${dmo(lib28.liberoDal, 'en')} to ${dmo(abr28.liberoAl, 'en')}.` },
        { q: 'What about St John’s Day 2028 in Porto?', a: `In 2028, 24 June is a ${wdLong(K.dataRegra(2028, porto.feriado!.regra), 'en')}: Porto's municipal holiday gives no bridge and no extra day off. Corpus Christi on 15 June still gives the Friday 16 bridge. 2027 is different: St John’s Day falls on a Thursday and gives a one-day bridge on Friday 25 to anyone working in Porto.` },
      ],
      body: (h) => `<h2>The best long weekends of 2028</h2>
<p>The table ranks the 2028 bridges by value: first those where one leave day buys four days off, then the December blocks and the two-, three- or four-day bridges around Easter, 1 May and All Saints' Day.</p>
${tabelaPontes(h, 2028, null, 10)}
<p>Easter 2028 falls on ${h.day(K.pascoa(2028))}, late, and 25 April comes nine days later. The April weeks can therefore be joined: the table shows that the week between 25 April and 1 May costs only ${nn(abr28.ferie, h.lang)} leave days for ${nn(abr28.liberi, h.lang)} days off.</p>
<h2>What your leave buys in 2028</h2>
<p>The comparison with the neighbouring years shows how generous 2028 is: for the same leave, you get more consecutive days off than in 2027. The difference comes entirely from the calendar, since the holidays are the same.</p>
${tabelaRendimento(h, [2026, 2027, 2028])}
<p>Your municipality's holiday can add a bridge. In Lisbon, St Anthony's Day falls on a Tuesday in 2028, two days before Corpus Christi: anyone working in Lisbon with the holiday in their contract can make a short week with little leave. The search is on the ${h.a('feriado-municipal', 'municipal holiday')} page.</p>
${h.mini('fe', { p: ['concelho'], d: { ano: 2028, concelho: 'lisboa' }, c: 'The 2028 holidays in your municipality' })}
<p>The legal minimum is still 22 working days under ${h.src('ct', 'article 238 of the Labour Code')}; if a collective agreement gives you more, use it to join the April and December bridges.</p>`,
    },
  }),
];
