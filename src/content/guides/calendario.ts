/** Calendário 2027 e dias úteis 2027. Datas: motor. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tabelaMeses, tabelaDiasUteis } from '../../lib/bausteine';
import { wdLong, dmo, nn, MESES } from '../../lib/tool-specs';

const Y = 2027;
const du = K.diasUteis(Y), duT = du.reduce((a, b) => a + b, 0);
const du6 = K.diasUteis(Y, {}, 6).reduce((a, b) => a + b, 0);
const seg5 = K.diasSemana5(Y);
const minM = du.indexOf(Math.min(...du)), maxM = du.indexOf(Math.max(...du));
const lis = K.concelhoById('lisboa')!, por = K.concelhoById('porto')!;
const duLis = K.diasUteis(Y, { local: lis }).reduce((a, b) => a + b, 0), duPor = K.diasUteis(Y, { local: por }).reduce((a, b) => a + b, 0);
const duCar = K.diasUteis(Y, { carnaval: true }).reduce((a, b) => a + b, 0);
const s1 = du.slice(0, 6).reduce((a, b) => a + b, 0);
const wk = K.weeksInYear(Y);

export default [
  defineGuide({
    id: 'calendario-2027', group: 'feriados', order: 11, tool: 'calendario', toolArg: { ano: Y },
    related: ['home', 'dias-uteis-2027', 'feriados-2028', 'feriado-municipal', 'pascoa-2027'],
    sources: ['ct234', 'hora', 'anmp'],
    pt: {
      slug: 'calendario-2027', nav: 'Calendário 2027', card: 'O ano inteiro com feriados e semanas',
      title: 'Calendário 2027 com feriados de Portugal e semanas',
      description: 'Calendário 2027 de Portugal com os feriados nacionais, as semanas numeradas e, se escolher o concelho, o feriado municipal e os dos Açores e da Madeira.',
      h1: 'Calendário 2027 com os feriados de Portugal',
      intro: 'O calendário de 2027 mês a mês, com os feriados assinalados e o número de cada semana. Escolha o concelho para juntar o feriado municipal.',
      resume: `O calendário de 2027 começa numa sexta-feira e acaba numa sexta-feira: o ano tem 365 dias, ${nn(wk, 'pt')} semanas numeradas pela norma ISO 8601 e ${nn(seg5, 'pt')} dias de segunda a sexta. Tirando os feriados nacionais em dia útil, ficam ${nn(duT, 'pt')} dias úteis no continente. A semana 1 começa a ${dmo(K.segundaDaSemana(Y, 1), 'pt')}, porque o 1 de janeiro, sexta-feira, ainda pertence à semana 53 de 2026. A Páscoa é a ${dmo(K.pascoa(Y), 'pt')}, o mesmo domingo em que a hora muda para a hora de verão; a hora de inverno volta a ${dmo(K.horaVerao(Y).fim, 'pt')}. O mês com menos dias úteis é ${MESES('pt')[minM]}, com ${nn(du[minM], 'pt')}, e o que tem mais é ${MESES('pt')[maxM]}, com ${nn(du[maxM], 'pt')}. Os feriados aparecem a cor no calendário; o feriado municipal e os regionais, noutra cor, só quando escolhe o concelho.`,
      faqs: [
        { q: 'Em que dia da semana começa 2027?', a: 'Numa sexta-feira, o dia de Ano Novo, que é feriado. O ano acaba também numa sexta-feira, 31 de dezembro, que é dia útil. Como o 1 de janeiro é sexta, o primeiro fim de semana do ano junta-se ao feriado e dá três dias seguidos sem gastar férias; o calendário acima marca-o, com os outros feriados do ano.' },
        { q: 'Quantas semanas tem 2027?', a: `${nn(wk, 'pt')} semanas pela norma ISO 8601, usada em Portugal nas agendas e na contabilidade. A semana 1 é a que contém a primeira quinta-feira do ano e começa na segunda-feira ${dmo(K.segundaDaSemana(Y, 1), 'pt')}. Os dias 1, 2 e 3 de janeiro pertencem ainda à última semana de 2026. O calendário acima mostra o número de cada semana à esquerda de cada linha.` },
        { q: 'Quando muda a hora em 2027?', a: `Os relógios adiantam uma hora no último domingo de março, ${dmo(K.horaVerao(Y).inicio, 'pt')}, e atrasam uma hora no último domingo de outubro, ${dmo(K.horaVerao(Y).fim, 'pt')}, segundo a diretiva europeia sobre a hora de verão. A mudança faz-se à 1 hora UTC, o mesmo instante em toda a União Europeia. Os Açores mudam no mesmo dia, mas estão sempre uma hora atrás do continente e da Madeira.` },
      ],
      body: (h) => `<h2>O ano de 2027 mês a mês</h2>
<p>A tabela resume cada mês: quantos dias tem, quantos são sábados e domingos, quantos feriados calham em dia útil e quantos dias úteis ficam. Março perde a Sexta-Feira Santa, maio o Corpo de Deus, junho o Dia de Portugal, outubro o 5 de Outubro, novembro o Dia de Todos os Santos e dezembro o 1 e o 8.</p>
${tabelaMeses(h, Y)}
<p>Para imprimir, use o botão de impressão do navegador: o calendário cabe numa folha A4 ao alto. Escolhido o concelho, a ligação partilhada guarda a escolha.</p>
${h.mini('du', { p: ['semana'], d: { ano: Y }, c: 'Conte os dias úteis de 2027' })}
<h2>Feriados que mudam de lugar no calendário</h2>
<p>Três feriados andam com a Páscoa: a Sexta-Feira Santa, o Domingo de Páscoa e o Corpo de Deus. Em 2027 a Páscoa é cedo, a ${h.day(K.pascoa(Y))}, e o Corpo de Deus calha a ${h.day(K.addDays(K.pascoa(Y), 60))}. A terça de Carnaval, facultativa, é a ${h.day(K.carnaval(Y).terca)}. O cálculo da Páscoa, passo a passo, está em ${h.a('pascoa-2027', 'Páscoa 2027')}.</p>
<p>Nos Açores o calendário tem mais um feriado, a segunda-feira do Espírito Santo, ${h.day(K.addDays(K.pascoa(Y), 50))}; na Madeira, o 2 de abril, o 1 de julho e o 26 de dezembro. Os ${nn(K.CONCELHOS.length, h.lang)} concelhos, listados pela ${h.src('anmp', 'Associação Nacional de Municípios Portugueses')}, estão todos no seletor.</p>`,
    },
    en: {
      slug: 'calendar-2027', nav: 'Calendar 2027', card: 'The whole year with holidays and week numbers',
      title: 'Calendar 2027 with Portugal public holidays and weeks',
      description: 'Calendar 2027 for Portugal with the national holidays, numbered weeks and, if you pick a municipality, its local holiday and the Azores or Madeira holidays.',
      h1: 'Calendar 2027 with Portugal’s public holidays',
      intro: 'The 2027 calendar month by month, with holidays marked and every week numbered. Choose a municipality to add its local holiday.',
      resume: `The 2027 calendar starts on a Friday and ends on a Friday: the year has 365 days, ${nn(wk, 'en')} weeks numbered under ISO 8601 and ${nn(seg5, 'en')} Mondays to Fridays. Take away the national holidays that fall on a weekday and ${nn(duT, 'en')} working days remain on the mainland. Week 1 starts on ${dmo(K.segundaDaSemana(Y, 1), 'en')}, because 1 January, a Friday, still belongs to week 53 of 2026. Easter Sunday is ${dmo(K.pascoa(Y), 'en')}, the same Sunday the clocks go forward to summer time; winter time returns on ${dmo(K.horaVerao(Y).fim, 'en')}. The month with the fewest working days is ${MESES('en')[minM]}, with ${nn(du[minM], 'en')}, and the one with the most is ${MESES('en')[maxM]}, with ${nn(du[maxM], 'en')}. Holidays are coloured in the calendar; the municipal and regional ones, in another colour, only once you choose a municipality.`,
      faqs: [
        { q: 'What day of the week does 2027 start on?', a: 'On a Friday, New Year’s Day, which is a holiday. The year also ends on a Friday, 31 December, a working day. Because 1 January is a Friday, the first weekend of the year joins the holiday and gives three days in a row without using leave; the calendar above marks it with the year’s other holidays.' },
        { q: 'How many weeks are there in 2027?', a: `${nn(wk, 'en')} weeks under ISO 8601, the standard used in Portugal for diaries and accounts. Week 1 is the one containing the year's first Thursday and starts on Monday ${dmo(K.segundaDaSemana(Y, 1), 'en')}. So 1, 2 and 3 January still belong to the last week of 2026. The calendar above shows each week number on the left of its row.` },
        { q: 'When do the clocks change in Portugal in 2027?', a: `Clocks go forward one hour on the last Sunday of March, ${dmo(K.horaVerao(Y).inicio, 'en')}, and back one hour on the last Sunday of October, ${dmo(K.horaVerao(Y).fim, 'en')}, under the EU summer-time directive. The change happens at 1 a.m. UTC, the same moment across the European Union. The Azores change on the same day but are always one hour behind the mainland and Madeira.` },
      ],
      body: (h) => `<h2>2027 month by month</h2>
<p>The table sums up each month: how many days it has, how many are Saturdays and Sundays, how many holidays fall on a weekday and how many working days are left. March loses Good Friday, May Corpus Christi, June Portugal Day, October 5 October, November All Saints' Day and December the 1st and the 8th.</p>
${tabelaMeses(h, Y)}
<p>To print, use your browser's print button: the calendar fits on one portrait A4 sheet. Once you choose a municipality, the shared link keeps it.</p>
${h.mini('du', { p: ['semana'], d: { ano: Y }, c: 'Count the 2027 working days' })}
<h2>Holidays that move around the calendar</h2>
<p>Three holidays move with Easter: Good Friday, Easter Sunday and Corpus Christi. In 2027 Easter is early, on ${h.day(K.pascoa(Y))}, and Corpus Christi falls on ${h.day(K.addDays(K.pascoa(Y), 60))}. Carnival Tuesday, which is optional, is ${h.day(K.carnaval(Y).terca)}. The Easter calculation, step by step, is on ${h.a('pascoa-2027', 'Easter 2027')}.</p>
<p>The Azores have one more holiday, Whit Monday, ${h.day(K.addDays(K.pascoa(Y), 50))}; Madeira has 2 April, 1 July and 26 December. All ${nn(K.CONCELHOS.length, h.lang)} municipalities, as listed by the ${h.src('anmp', 'national association of municipalities')}, are in the selector.</p>`,
    },
  }),
  defineGuide({
    id: 'dias-uteis-2027', group: 'ferramentas', order: 5, tool: 'du', toolArg: { ano: Y },
    related: ['calendario-2027', 'ferias', 'home', 'feriado-municipal', 'pontes-2028'],
    sources: ['ct', 'ct234'],
    pt: {
      slug: 'dias-uteis-2027', nav: 'Dias úteis 2027', card: 'Dias úteis por mês, com o seu concelho',
      title: 'Dias úteis 2027 em Portugal: total, mês a mês e concelho',
      description: 'Dias úteis 2027 em Portugal: 253 de segunda a sexta no continente, mês a mês, e a conta refeita com o feriado do seu concelho, o Carnaval ou o sábado.',
      h1: 'Dias úteis 2027 em Portugal',
      intro: 'Conte os dias úteis de 2027 de segunda a sexta ou de segunda a sábado, com o feriado municipal do seu concelho e a terça de Carnaval se forem livres para si.',
      resume: `Em 2027 o continente tem ${nn(duT, 'pt')} dias úteis de segunda a sexta: ${nn(seg5, 'pt')} dias de semana menos os ${nn(seg5 - duT, 'pt')} feriados nacionais que calham em dia útil. Quem trabalha de segunda a sábado conta ${nn(du6, 'pt')}. O feriado municipal tira mais um dia quando calha em dia útil e não coincide com outro feriado: em Lisboa o Santo António é um domingo e o total fica em ${nn(duLis, 'pt')}, no Porto o São João é uma quinta e o total desce para ${nn(duPor, 'pt')}. Com a terça de Carnaval livre ficam ${nn(duCar, 'pt')}. O primeiro semestre tem ${nn(s1, 'pt')} dias úteis e o segundo ${nn(duT - s1, 'pt')}. É este número que conta, por exemplo, para as férias, que se contam em dias úteis segundo o artigo 238.º do Código do Trabalho, para prazos contratuais em dias úteis e para planear objetivos mensais.`,
      faqs: [
        { q: 'Quantos dias úteis tem 2027?', a: `${nn(duT, 'pt')} de segunda a sexta no continente, sem feriado municipal. É mais um do que em 2026 (${nn(K.diasUteis(2026).reduce((a, b) => a + b, 0), 'pt')}) e mais três do que em 2028 (${nn(K.diasUteis(2028).reduce((a, b) => a + b, 0), 'pt')}). Num concelho cujo feriado municipal calhe em dia útil há um a menos; nos Açores e na Madeira, os feriados regionais tiram mais. A ferramenta acima refaz a conta para o seu concelho.` },
        { q: 'O sábado conta como dia útil?', a: 'Para as férias não: o Código do Trabalho define como úteis os dias de segunda a sexta que não são feriado. Para outros fins, como o horário de alguns serviços ou o comércio, o sábado pode ser dia de trabalho; escolha « seg-sáb » para essa conta.' },
        { q: 'Que mês de 2027 tem menos dias úteis?', a: `${MESES('pt')[minM]}, com ${nn(du[minM], 'pt')}. Há vários meses empatados com ${nn(du[maxM], 'pt')}, o máximo do ano. A diferença vem dos fins de semana e dos feriados que calham em dia útil nesse mês. Escolha o seu concelho na ferramenta acima para ver se o feriado municipal tira mais um dia a algum mês.` },
      ],
      body: (h) => `<h2>Dias úteis de 2027 a 2028, mês a mês</h2>
<p>A tabela compara os três anos sem feriado municipal. As diferenças vêm de onde calham os feriados: em 2027 quatro deles caem ao fim de semana e não tiram dias úteis, em 2028 são só dois.</p>
${tabelaDiasUteis(h, [2026, 2027, 2028])}
<h2>Como usar a contagem</h2>
<p>Para as férias, o ${h.src('ct', 'artigo 238.º do Código do Trabalho')} conta só os dias de segunda a sexta que não são feriado: uma semana com um feriado à quinta gasta quatro dias de férias, não cinco. Por isso as pontes rendem tanto. A conta das suas férias está em ${h.a('ferias', 'férias')}.</p>
${h.mini('du', { p: ['concelho'], d: { ano: Y }, c: 'Dias úteis 2027 no seu concelho' })}
<p>Se o seu concelho ainda não tem a data confirmada, a ferramenta avisa e não a desconta: preferimos um dia útil a mais do que uma data inventada. A lista dos concelhos confirmados está em ${h.a('feriado-municipal', 'feriado municipal')}; o calendário completo em ${h.a('calendario-2027', 'calendário 2027')}.</p>`,
    },
    en: {
      slug: 'working-days-2027', nav: 'Working days 2027', card: 'Working days per month, with your municipality',
      title: 'Working days 2027 in Portugal: total and per month',
      description: 'Working days 2027 in Portugal: 253 Monday to Friday on the mainland, month by month, redone with your municipality’s holiday, Carnival or a six-day week.',
      h1: 'Working days 2027 in Portugal',
      intro: 'Count the 2027 working days Monday to Friday or Monday to Saturday, with your municipality’s holiday and Carnival Tuesday if they are days off for you.',
      resume: `In 2027 the mainland has ${nn(duT, 'en')} working days Monday to Friday: ${nn(seg5, 'en')} weekdays minus the ${nn(seg5 - duT, 'en')} national holidays that fall on a weekday. On a Monday-to-Saturday week you count ${nn(du6, 'en')}. The municipal holiday takes away one more day when it falls on a weekday and does not coincide with another holiday: in Lisbon St Anthony's Day is a Sunday and the total stays at ${nn(duLis, 'en')}, in Porto St John's Day is a Thursday and the total drops to ${nn(duPor, 'en')}. With Carnival Tuesday off there are ${nn(duCar, 'en')}. The first half of the year has ${nn(s1, 'en')} working days and the second ${nn(duT - s1, 'en')}. This is the number that matters, for example, for annual leave, which is counted in working days under article 238 of the Labour Code, for contract deadlines in working days and for planning monthly targets.`,
      faqs: [
        { q: 'How many working days are there in Portugal in 2027?', a: `${nn(duT, 'en')} Monday to Friday on the mainland, without a municipal holiday. That is one more than in 2026 (${nn(K.diasUteis(2026).reduce((a, b) => a + b, 0), 'en')}) and three more than in 2028 (${nn(K.diasUteis(2028).reduce((a, b) => a + b, 0), 'en')}). A municipality whose holiday falls on a weekday has one fewer; in the Azores and Madeira the regional holidays remove more. The tool above redoes the count for your municipality.` },
        { q: 'Does Saturday count as a working day?', a: 'Not for annual leave: the Labour Code defines working days as Monday to Friday excluding holidays. For other purposes, such as some services or retail, Saturday can be a working day; choose "Mon-Sat" for that count. The planner and the working-day totals on this site use Monday to Friday unless you switch that option on.' },
        { q: 'Which month of 2027 has the fewest working days?', a: `${MESES('en')[minM]}, with ${nn(du[minM], 'en')}. Several months tie on ${nn(du[maxM], 'en')}, the year's maximum. The difference comes from weekends and from holidays that fall on a weekday that month. Pick your municipality in the tool above to see whether its holiday takes another day from any month.` },
      ],
      body: (h) => `<h2>Working days 2026 to 2028, month by month</h2>
<p>The table compares the three years without a municipal holiday. The differences come from where the holidays fall: in 2027 four of them land on a weekend and take no working day away, in 2028 only two do.</p>
${tabelaDiasUteis(h, [2026, 2027, 2028])}
<h2>How to use the count</h2>
<p>For annual leave, ${h.src('ct', 'article 238 of the Labour Code')} counts only Monday-to-Friday days that are not holidays: a week with a Thursday holiday uses four leave days, not five. That is why bridges pay off so well. Your leave is worked out on ${h.a('ferias', 'annual leave')}.</p>
${h.mini('du', { p: ['concelho'], d: { ano: Y }, c: '2027 working days in your municipality' })}
<p>If your municipality's date is not yet confirmed, the tool says so and does not deduct it: we prefer one working day too many to an invented date. The list of confirmed municipalities is on ${h.a('feriado-municipal', 'municipal holiday')}; the full calendar on ${h.a('calendario-2027', 'calendar 2027')}.</p>`,
    },
  }),
];
void wdLong;
