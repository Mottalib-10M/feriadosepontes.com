/** Feriados 2026 e 2028: a lista do ano com o dia da semana. Datas: motor. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tabelaTresAnos } from '../../lib/bausteine';
import { dShort, wdLong, dmo, nn } from '../../lib/tool-specs';

const lista = (y: number, l: 'pt' | 'en', ids: string[]) => K.feriados(y).filter((f) => ids.includes(f.id)).map((f) => `${f.name[l]} (${dShort(f.date, l)})`).join(', ');
const fds = (y: number) => K.aoFimDeSemana(K.feriados(y)).map((f) => f.id);
const util = (y: number) => K.emDiaUtil(K.feriados(y)).length;
const fd = (y: number, id: string) => K.feriados(y).find((f) => f.id === id)!.date;
const du26 = K.diasUteis(2026).reduce((a, b) => a + b, 0), du28 = K.diasUteis(2028).reduce((a, b) => a + b, 0);
const car28 = K.carnaval(2028).terca;
const um26 = K.pontesDeUmDia(2026), um28 = K.pontesDeUmDia(2028);

export default [
  defineGuide({
    id: 'feriados-2026', group: 'feriados', order: 10, tool: 'fe', toolArg: { ano: 2026 },
    related: ['home', 'pontes-2026', 'feriados-2028', 'feriado-municipal', 'calendario-2027'],
    sources: ['ct234', 'l8-2016', 'ct'],
    pt: {
      slug: 'feriados-2026', nav: 'Feriados 2026', card: 'Os 13 feriados de 2026 e os que ainda faltam',
      title: 'Feriados 2026 em Portugal: lista completa e dias da semana',
      description: 'Feriados 2026 em Portugal: os 13 feriados nacionais com o dia da semana, os que calharam ao fim de semana, os que ainda faltam e o feriado do seu concelho.',
      h1: 'Feriados 2026 em Portugal, dia a dia',
      intro: 'Escolha o seu concelho para juntar o feriado municipal e, nas ilhas, os regionais: a lista de 2026 refaz-se com o dia da semana de cada feriado.',
      resume: `Em 2026 Portugal teve ${nn(K.feriados(2026).length, 'pt')} feriados nacionais obrigatórios, os do artigo 234.º do Código do Trabalho, e ${nn(util(2026), 'pt')} calharam em dia útil. Três perderam-se ao fim de semana: ${lista(2026, 'pt', fds(2026))}. Em compensação o ano teve ${nn(um26.length, 'pt')} pontes de um só dia de férias: o 2 de janeiro, a sexta depois do Corpo de Deus, o 30 de novembro e o 7 de dezembro. O Natal e o 1.º de Maio calharam à sexta e o 5 de Outubro à segunda, três fins de semana de três dias. Ainda faltam, a esta data, o 1 de Dezembro (${wdLong(fd(2026, 'restauracao'), 'pt')}), o 8 de Dezembro (${wdLong(fd(2026, 'imaculada'), 'pt')}) e o Natal (${wdLong(fd(2026, 'natal'), 'pt')}). Sem feriado municipal, o continente conta ${nn(du26, 'pt')} dias úteis de segunda a sexta em 2026.`,
      faqs: [
        { q: 'Quais feriados de 2026 calham à terça-feira?', a: `O 1 de Dezembro e o 8 de Dezembro: ${dmo(fd(2026, 'restauracao'), 'pt')} e ${dmo(fd(2026, 'imaculada'), 'pt')} são ambos terças-feiras. Cada um pede a segunda-feira anterior como ponte, o que dá dois fins de semana de quatro dias seguidos no início de dezembro.` },
        { q: 'Que feriados de 2026 caíram ao fim de semana?', a: `O 25 de Abril e o 15 de Agosto, ambos ao sábado, e o 1 de Novembro, ao domingo. Em Portugal não se recuperam: nenhum passa para segunda-feira. Dos treze feriados nacionais, sobram assim dez em dia útil, contando o Domingo de Páscoa entre os de fim de semana. A ferramenta acima mostra o dia da semana de cada feriado do ano que escolher.` },
        { q: 'O 24 de dezembro de 2026 é feriado?', a: 'Não. A véspera de Natal é um dia útil normal no Código do Trabalho. Muitas empresas dão a tarde ou o dia inteiro, e o Governo costuma conceder tolerância de ponto à função pública, mas isso é decidido a cada ano.' },
      ],
      body: (h) => `<h2>Os feriados de 2026 e o dia da semana</h2>
<p>A lista acima é a do continente, sem feriado municipal. Escolha o seu concelho para ver também o dia da sua câmara: em Lisboa o Santo António de 2026 foi um sábado, no Porto o São João foi uma quarta-feira. Nos Açores junta-se a segunda-feira do Espírito Santo e na Madeira três feriados regionais; tudo está em ${h.a('acores-madeira', 'Açores e Madeira')}.</p>
<p>Para comparar com os anos seguintes, a tabela põe lado a lado as datas de 2026, 2027 e 2028. As datas fixas mudam só de dia da semana; a Sexta-Feira Santa, a Páscoa e o Corpo de Deus andam com a Páscoa, que em 2026 foi a ${h.day(K.pascoa(2026))}.</p>
${tabelaTresAnos(h)}
${h.mini('fe', { p: ['concelho'], d: { ano: 2026 }, c: 'Junte o feriado do seu concelho' })}
<h2>O que mudou nos feriados desde 2013</h2>
<p>Entre 2013 e 2015 Portugal teve só nove feriados obrigatórios: o Corpo de Deus, o 5 de Outubro, o 1 de Novembro e o 1 de Dezembro tinham sido suspensos. A ${h.src('l8-2016', 'Lei n.º 8/2016')} repô-los a partir desse ano, e desde então o ${h.src('ct234', 'artigo 234.º do Código do Trabalho')} volta a enumerar treze dias. A terça de Carnaval e o feriado municipal continuam facultativos, como diz o artigo 235.º.</p>
<p>As pontes que ainda pode aproveitar em dezembro estão em ${h.a('pontes-2026', 'pontes 2026')}; os feriados do próximo ano estão na ${h.a('home', 'página dos feriados 2027')}.</p>`,
    },
    en: {
      slug: 'public-holidays-2026', nav: 'Public holidays 2026', card: 'The 13 holidays of 2026 and those still ahead',
      title: 'Public holidays 2026 in Portugal: full list with weekdays',
      description: 'Public holidays 2026 in Portugal: the 13 national holidays with their weekday, those that fell on a weekend, those still ahead and your municipality’s holiday.',
      h1: 'Portugal public holidays 2026, day by day',
      intro: 'Choose your municipality to add its local holiday and, on the islands, the regional ones: the 2026 list is redrawn with each holiday’s weekday.',
      resume: `In 2026 Portugal had ${nn(K.feriados(2026).length, 'en')} compulsory national holidays, those of article 234 of the Labour Code, and ${nn(util(2026), 'en')} fell on a weekday. Three were lost to the weekend: ${lista(2026, 'en', fds(2026))}. On the other hand the year had ${nn(um26.length, 'en')} bridges for a single leave day: 2 January, the Friday after Corpus Christi, 30 November and 7 December. Christmas Day and 1 May fell on a Friday and 5 October on a Monday, three three-day weekends. Still ahead at this date are 1 December (${wdLong(fd(2026, 'restauracao'), 'en')}), 8 December (${wdLong(fd(2026, 'imaculada'), 'en')}) and Christmas Day (${wdLong(fd(2026, 'natal'), 'en')}). Without a municipal holiday, the mainland counts ${nn(du26, 'en')} Monday-to-Friday working days in 2026, one fewer than in 2027.`,
      faqs: [
        { q: 'Which 2026 holidays fall on a Tuesday?', a: `1 December and 8 December: ${dmo(fd(2026, 'restauracao'), 'en')} and ${dmo(fd(2026, 'imaculada'), 'en')} are both Tuesdays. Each calls for the Monday before as a bridge, giving two four-day weekends in early December. Each bridge costs one day of leave, so two days of leave in total give eight days off across the two weekends; the planner on the home page ranks them with the rest of the year’s bridges.` },
        { q: 'Which 2026 holidays fell on a weekend?', a: '25 April and 15 August, both on a Saturday, and 1 November, on a Sunday. Portugal does not make them up: none moves to the Monday. Of the thirteen national holidays, ten therefore fall on a weekday, counting Easter Sunday among the weekend ones. The tool above shows the weekday of every holiday in the year you choose.' },
        { q: 'Is 24 December 2026 a holiday in Portugal?', a: 'No. Christmas Eve is an ordinary working day under the Labour Code. Many employers give the afternoon or the whole day, and the government usually grants civil servants a tolerância de ponto, but that is decided each year. In 2026 it is a Thursday, the day before Christmas Day, so a day of leave on 24 December gives four days in a row, Thursday to Sunday.' },
      ],
      body: (h) => `<h2>The 2026 holidays and their weekdays</h2>
<p>The list above is for the mainland, without a municipal holiday. Choose your municipality to see your council's day too: in Lisbon St Anthony's Day 2026 was a Saturday, in Porto St John's Day was a Wednesday. The Azores add Whit Monday and Madeira three regional holidays; all of it is on ${h.a('acores-madeira', 'Azores and Madeira')}.</p>
<p>To compare with the following years, the table puts the 2026, 2027 and 2028 dates side by side. Fixed dates only change weekday; Good Friday, Easter and Corpus Christi move with Easter, which in 2026 was ${h.day(K.pascoa(2026))}.</p>
${tabelaTresAnos(h)}
${h.mini('fe', { p: ['concelho'], d: { ano: 2026 }, c: 'Add your municipality’s holiday' })}
<h2>What changed in Portugal’s holidays since 2013</h2>
<p>From 2013 to 2015 Portugal had only nine compulsory holidays: Corpus Christi, 5 October, 1 November and 1 December had been suspended. ${h.src('l8-2016', 'Law 8/2016')} restored them from that year, and since then ${h.src('ct234', 'article 234 of the Labour Code')} lists thirteen days again. Carnival Tuesday and the municipal holiday remain optional, as article 235 says.</p>
<p>The bridges you can still take in December are on ${h.a('pontes-2026', 'long weekends 2026')}; next year's holidays are on the ${h.a('home', 'holidays 2027')} page.</p>`,
    },
  }),
  defineGuide({
    id: 'feriados-2028', group: 'feriados', order: 12, tool: 'fe', toolArg: { ano: 2028 },
    related: ['home', 'pontes-2028', 'feriados-2026', 'carnaval-2027', 'feriado-municipal'],
    sources: ['ct234', 'ct', 'l8-2016'],
    pt: {
      slug: 'feriados-2028', nav: 'Feriados 2028', card: 'Dez feriados em dia útil: o ano das pontes',
      title: 'Feriados 2028 em Portugal: lista, pontes e calendário',
      description: 'Feriados 2028 em Portugal: os 13 feriados nacionais com o dia da semana, a Páscoa a 16 de abril, o Carnaval a 29 de fevereiro e as pontes de um dia de férias.',
      h1: 'Feriados 2028 em Portugal: a lista completa',
      intro: 'Veja os feriados de 2028 com o dia da semana e, escolhendo o concelho, o feriado municipal e os regionais das ilhas.',
      resume: `O ano de 2028 tem ${nn(K.feriados(2028).length, 'pt')} feriados nacionais e é bissexto: fevereiro tem 29 dias, e é precisamente a 29 de fevereiro que calha a terça-feira de Carnaval. Dos feriados, ${nn(util(2028), 'pt')} caem de segunda a sexta, o melhor resultado entre 2026 e 2028; só o Ano Novo e o Dia de Portugal calham ao sábado. A Páscoa é tarde, a ${dmo(K.pascoa(2028), 'pt')}, e por isso o Corpo de Deus só chega a ${dmo(fd(2028, 'corpo-deus'), 'pt')}, cinco dias depois do 10 de Junho. Há ${nn(um28.length, 'pt')} pontes de um só dia de férias: ${um28.map((b) => dmo(b.ferieDal, 'pt')).join(', ')}. O 1 e o 8 de dezembro calham ambos à sexta, e o Natal à segunda. No continente, sem feriado municipal, contam-se ${nn(du28, 'pt')} dias úteis de segunda a sexta, menos do que em 2026 e 2027 porque há mais feriados em dia útil.`,
      faqs: [
        { q: 'Quando é a Páscoa de 2028?', a: `A ${dmo(K.pascoa(2028), 'pt')}. A Sexta-Feira Santa, feriado nacional, é a ${dmo(fd(2028, 'sexta-santa'), 'pt')}, e o Corpo de Deus, sessenta dias depois da Páscoa, a ${dmo(fd(2028, 'corpo-deus'), 'pt')}, uma quinta-feira. É uma Páscoa tardia: a Sexta-Feira Santa calha onze dias antes do 25 de Abril, e o Corpo de Deus fica cinco dias depois do 10 de Junho.` },
        { q: 'O Carnaval de 2028 é a 29 de fevereiro?', a: `Sim, a terça-feira de Carnaval de 2028 é ${dmo(car28, 'pt')}, porque 2028 é bissexto e a Páscoa calha a ${dmo(K.pascoa(2028), 'pt')}. Continua a não ser feriado obrigatório. Onde a convenção coletiva ou o contrato o tornam feriado, um dia de férias na segunda 28 dá quatro dias seguidos, de sábado 26 de fevereiro a terça 29.` },
        { q: 'Quantos feriados de 2028 calham em dia útil?', a: `${nn(util(2028), 'pt')} dos ${nn(K.feriados(2028).length, 'pt')}, contando o Domingo de Páscoa entre os de fim de semana. É o ano com mais feriados em dia útil desde 2026, e por isso o que tem menos dias úteis. Ao fim de semana ficam só o 1 de janeiro e o 10 de Junho, ambos ao sábado, além do Domingo de Páscoa.` },
      ],
      body: (h) => `<h2>Os feriados de 2028 um a um</h2>
<p>Quatro feriados de 2028 calham à terça ou à quinta e pedem uma ponte de um dia: o 25 de Abril (terça), o Corpo de Deus (quinta), a Assunção (terça) e o 5 de Outubro (quinta). O 1.º de Maio é segunda e o 1 e o 8 de dezembro são sextas, três fins de semana de três dias sem férias. O Dia de Todos os Santos é quarta: pede dois dias de cada lado.</p>
${tabelaTresAnos(h)}
${h.mini('fe', { p: ['concelho', 'carnaval'], d: { ano: 2028 }, c: 'Feriados 2028 no seu concelho' })}
<h2>Planear 2028 com antecedência</h2>
<p>Com tantos feriados em dia útil, quem marca férias cedo em 2028 consegue blocos longos com poucos dias. A conta exata para o seu número de dias está em ${h.a('pontes-2028', 'pontes 2028')}. As regras de marcação, incluindo o mapa de férias até 15 de abril, estão no ${h.src('ct', 'artigo 241.º do Código do Trabalho')}.</p>
<p>O feriado municipal muda a conta de concelho para concelho. Em 2028 o São João, a 24 de junho, calha a um sábado, e o Santo António, a 13 de junho, a uma terça. A data de cada concelho confirmado está em ${h.a('feriado-municipal', 'feriado municipal')}.</p>`,
    },
    en: {
      slug: 'public-holidays-2028', nav: 'Public holidays 2028', card: 'Ten holidays on a weekday: the year of bridges',
      title: 'Public holidays 2028 in Portugal: list, bridges, calendar',
      description: 'Public holidays 2028 in Portugal: the 13 national holidays with their weekday, Easter on 16 April, Carnival on 29 February and the bridges for one leave day.',
      h1: 'Portugal public holidays 2028: the full list',
      intro: 'See the 2028 holidays with their weekday and, by choosing a municipality, the municipal holiday and the islands’ regional ones.',
      resume: `2028 has ${nn(K.feriados(2028).length, 'en')} national holidays and is a leap year: February has 29 days, and Carnival Tuesday falls precisely on 29 February. Of the holidays, ${nn(util(2028), 'en')} fall between Monday and Friday, the best result between 2026 and 2028; only New Year's Day and Portugal Day land on a Saturday. Easter is late, on ${dmo(K.pascoa(2028), 'en')}, so Corpus Christi only comes on ${dmo(fd(2028, 'corpo-deus'), 'en')}, five days after 10 June. There are ${nn(um28.length, 'en')} one-leave-day bridges: ${um28.map((b) => dmo(b.ferieDal, 'en')).join(', ')}. 1 and 8 December both fall on a Friday and Christmas Day on a Monday. On the mainland, without a municipal holiday, there are ${nn(du28, 'en')} Monday-to-Friday working days, fewer than in 2026 and 2027 because more holidays fall on weekdays.`,
      faqs: [
        { q: 'When is Easter 2028 in Portugal?', a: `On ${dmo(K.pascoa(2028), 'en')}. Good Friday, a national holiday, is ${dmo(fd(2028, 'sexta-santa'), 'en')}, and Corpus Christi, sixty days after Easter, is ${dmo(fd(2028, 'corpo-deus'), 'en')}, a Thursday. It is a late Easter: Good Friday falls eleven days before 25 April, and Corpus Christi five days after 10 June.` },
        { q: 'Is Carnival 2028 on 29 February?', a: `Yes, Carnival Tuesday 2028 is ${dmo(car28, 'en')}, because 2028 is a leap year and Easter falls on ${dmo(K.pascoa(2028), 'en')}. It is still not a compulsory holiday. Where a collective agreement or contract makes it one, a day of leave on Monday 28 gives four days in a row, from Saturday 26 February to Tuesday 29.` },
        { q: 'How many 2028 holidays fall on a weekday?', a: `${nn(util(2028), 'en')} of the ${nn(K.feriados(2028).length, 'en')}, counting Easter Sunday among the weekend ones. It is the year with the most weekday holidays since 2026, and therefore the one with the fewest working days. Only 1 January and 10 June, both Saturdays, fall on a weekend, besides Easter Sunday.` },
      ],
      body: (h) => `<h2>The 2028 holidays one by one</h2>
<p>Four 2028 holidays fall on a Tuesday or a Thursday and call for a one-day bridge: 25 April (Tuesday), Corpus Christi (Thursday), the Assumption (Tuesday) and 5 October (Thursday). 1 May is a Monday and 1 and 8 December are Fridays, three three-day weekends with no leave. All Saints' Day is a Wednesday: it needs two days on either side.</p>
${tabelaTresAnos(h)}
${h.mini('fe', { p: ['concelho', 'carnaval'], d: { ano: 2028 }, c: '2028 holidays in your municipality' })}
<h2>Planning 2028 ahead</h2>
<p>With so many weekday holidays, booking early in 2028 gets you long blocks for few days. The exact count for your number of days is on ${h.a('pontes-2028', 'long weekends 2028')}. The booking rules, including the leave schedule due by 15 April, are in ${h.src('ct', 'article 241 of the Labour Code')}.</p>
<p>The municipal holiday changes the count from one municipality to the next. In 2028 St John's Day, 24 June, falls on a Saturday, and St Anthony's Day, 13 June, on a Tuesday. Each confirmed municipality's date is on ${h.a('feriado-municipal', 'municipal holiday')}.</p>`,
    },
  }),
];
