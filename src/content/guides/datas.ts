/** Datas móveis de 2027: Corpo de Deus, Páscoa, Carnaval. Datas: motor. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { dLong, dmo, nn, wdLong } from '../../lib/tool-specs';

const Y = 2027;
const ps = K.pascoa(Y), cd = K.addDays(ps, 60), sx = K.addDays(ps, -2), asc = K.addDays(ps, 39);
const pCd = K.pontes(Y).filter((b) => b.feste.includes('corpo-deus'));
const cd1 = pCd.find((b) => b.ferie === 1)!;
const cdPg = K.pontes(Y).find((b) => b.feste.includes('corpo-deus') && b.ferieDal > cd && b.ferieAl < `${Y}-06-10`);
const car = K.carnaval(Y);
const carP = K.pontes(Y, { carnaval: true }).find((b) => b.feste.includes('carnaval'));
const pasP = K.pontes(Y).find((b) => b.feste.includes('sexta-santa'))!;
const anosCd = [2026, 2027, 2028, 2029, 2030].map((y) => ({ y, d: K.addDays(K.pascoa(y), 60) }));
const melgaco = K.concelhoById('melgaco');

export default [
  defineGuide({
    id: 'corpo-de-deus-2027', group: 'datas', order: 20, tool: 'fd', toolArg: { feriado: 'corpo-deus', ano: Y },
    related: ['home', 'pascoa-2027', 'calendario-2027', 'feriados-2028', 'santos-populares'],
    sources: ['ct234', 'l8-2016'],
    countdown: { date: cd, label: { pt: 'Corpo de Deus 2027', en: 'Corpus Christi 2027' } },
    pt: {
      slug: 'corpo-de-deus-2027', nav: 'Corpo de Deus 2027', card: 'Quinta 27 de maio e a ponte de sexta',
      title: 'Corpo de Deus 2027: quinta-feira 27 de maio e a ponte',
      description: 'Corpo de Deus 2027 é a quinta-feira 27 de maio, feriado nacional: a ponte de sexta 28, como se calcula a data a partir da Páscoa e em que dia calha até 2030.',
      h1: 'Corpo de Deus 2027: a data e a ponte',
      intro: 'Escolha o feriado e o ano: a ferramenta mostra o dia, a melhor ponte e quantos dias de férias custa. Por omissão, o Corpo de Deus de 2027.',
      resume: `O Corpo de Deus de 2027 é a ${dLong(cd, 'pt')}, uma ${wdLong(cd, 'pt')}. É feriado nacional obrigatório pelo artigo 234.º do Código do Trabalho, reposto pela Lei n.º 8/2016 depois de ter estado suspenso de 2013 a 2015. A data não é fixa: o Corpo de Deus celebra-se sessenta dias depois do Domingo de Páscoa, que em 2027 é a ${dmo(ps, 'pt')}. Como calha à quinta, a sexta-feira ${dmo(cd1.ferieDal, 'pt')} é uma ponte de um só dia de férias que dá ${nn(cd1.liberi, 'pt')} dias livres, de ${dmo(cd1.liberoDal, 'pt')} a ${dmo(cd1.liberoAl, 'pt')}. Duas semanas depois, o Dia de Portugal, a 10 de junho, também é uma quinta: quem tirar as duas sextas fica com dois fins de semana de quatro dias por dois dias de férias. ${cdPg ? `Juntando os seis dias úteis entre os dois feriados, ${nn(cdPg.ferie, 'pt')} dias de férias dão ${nn(cdPg.liberi, 'pt')} dias livres.` : ''}`,
      faqs: [
        { q: 'O Corpo de Deus é feriado em 2027?', a: `Sim, é um dos treze feriados obrigatórios do Código do Trabalho e calha a ${dLong(cd, 'pt')}. Escolas, serviços públicos e a maioria das empresas fecham. Como é uma quinta-feira, basta um dia de férias na sexta 28 para juntar quatro dias seguidos, de quinta a domingo; a ferramenta acima mostra essa ponte e a do ano que escolher.` },
        { q: 'Porque é que o Corpo de Deus muda de data todos os anos?', a: `Porque depende da Páscoa: é a quinta-feira sessenta dias depois do Domingo de Páscoa. Em 2026 foi a ${dmo(anosCd[0].d, 'pt')}, em 2028 será a ${dmo(anosCd[2].d, 'pt')}. Por isso pode cair entre 21 de maio e 24 de junho, e em alguns anos fica muito perto do 10 de Junho ou dos santos populares, o que muda as pontes possíveis nesse mês.` },
        { q: 'Quando foi reposto o feriado do Corpo de Deus?', a: 'Em 2016. Entre 2013 e 2015 o Corpo de Deus, o 5 de Outubro, o 1 de Novembro e o 1 de Dezembro deixaram de ser feriados obrigatórios; a Lei n.º 8/2016, de 1 de abril, voltou a pô-los no artigo 234.º do Código do Trabalho.' },
      ],
      body: (h) => `<h2>O Corpo de Deus nos próximos anos</h2>
<p>A tabela da ferramenta mostra a data e a ponte possível nos anos seguintes. Como o Corpo de Deus é sempre uma quinta-feira, todos os anos dá uma ponte de um dia na sexta seguinte; o que muda é o mês. Em ${anosCd.map((x) => `${x.y} calha a ${dmo(x.d, h.lang)}`).join(', ')}.</p>
<p>Em 2027 a Páscoa é cedo e o Corpo de Deus cai ainda em maio, antes dos santos populares. Em 2028 a Páscoa é tarde e o Corpo de Deus passa para meados de junho, cinco dias depois do 10 de Junho. A lista oficial dos feriados obrigatórios está no ${h.src('ct234', 'artigo 234.º do Código do Trabalho')}, na redação da ${h.src('l8-2016', 'Lei n.º 8/2016')}.</p>
${h.mini('fd', { p: ['ano'], d: { feriado: 'corpo-deus', ano: 2028 }, c: 'O Corpo de Deus noutro ano' })}
<h2>Outros feriados de 2027 com ponte</h2>
<p>A mesma ferramenta mostra qualquer feriado nacional: escolha o Dia de Portugal ou o 5 de Outubro para ver as outras duas pontes de um dia de 2027. A Ascensão, ${h.day(asc)}, quarenta dias depois da Páscoa, não é feriado nacional, mas é feriado municipal em alguns concelhos${melgaco?.feriado ? `, como Melgaço` : ''}: veja ${h.a('feriado-municipal', 'feriado municipal')}. A Páscoa e as datas que dela dependem estão em ${h.a('pascoa-2027', 'Páscoa 2027')}.</p>`,
    },
    en: {
      slug: 'corpus-christi-2027', nav: 'Corpus Christi 2027', card: 'Thursday 27 May and the Friday bridge',
      title: 'Corpus Christi 2027 in Portugal: Thursday 27 May bridge',
      description: 'Corpus Christi 2027 in Portugal is Thursday 27 May, a national holiday: the Friday 28 bridge, how the date follows Easter and its weekday each year to 2030.',
      h1: 'Corpus Christi 2027 in Portugal: date and bridge',
      intro: 'Choose the holiday and the year: the tool shows the day, the best bridge and how much leave it costs. By default, Corpus Christi 2027.',
      resume: `Corpus Christi 2027 is ${dLong(cd, 'en')}, a ${wdLong(cd, 'en')}. It is a compulsory national holiday under article 234 of the Labour Code, restored by Law 8/2016 after being suspended from 2013 to 2015. The date is not fixed: Corpus Christi is held sixty days after Easter Sunday, which in 2027 is ${dmo(ps, 'en')}. Because it falls on a Thursday, Friday ${dmo(cd1.ferieDal, 'en')} is a one-leave-day bridge giving ${nn(cd1.liberi, 'en')} days off, from ${dmo(cd1.liberoDal, 'en')} to ${dmo(cd1.liberoAl, 'en')}. Two weeks later Portugal Day, 10 June, is also a Thursday: take both Fridays and you get two four-day weekends for two leave days. ${cdPg ? `Adding the six working days between the two holidays, ${nn(cdPg.ferie, 'en')} leave days give ${nn(cdPg.liberi, 'en')} days off.` : ''} The tool above shows the same bridge for any national holiday and any year.`,
      faqs: [
        { q: 'Is Corpus Christi a public holiday in Portugal in 2027?', a: `Yes, it is one of the thirteen compulsory holidays in the Labour Code and falls on ${dLong(cd, 'en')}. Schools, public services and most businesses close. As it is a Thursday, one day of leave on Friday 28 gives four days in a row, Thursday to Sunday; the tool above shows that bridge and the one for any year you pick.` },
        { q: 'Why does Corpus Christi change date every year?', a: `Because it depends on Easter: it is the Thursday sixty days after Easter Sunday. In 2026 it was ${dmo(anosCd[0].d, 'en')}, in 2028 it will be ${dmo(anosCd[2].d, 'en')}. So it can fall anywhere from 21 May to 24 June, and some years it lands close to 10 June or the popular saints, which changes the bridges available that month.` },
        { q: 'When was the Corpus Christi holiday restored in Portugal?', a: 'In 2016. From 2013 to 2015 Corpus Christi, 5 October, 1 November and 1 December were no longer compulsory holidays; Law 8/2016 of 1 April put them back in article 234 of the Labour Code. Since then Portugal has again had thirteen compulsory national holidays, and Corpus Christi is the only one of the four that moves with Easter.' },
      ],
      body: (h) => `<h2>Corpus Christi in the coming years</h2>
<p>The tool's table shows the date and possible bridge in the following years. Since Corpus Christi is always a Thursday, it gives a one-day bridge on the following Friday every year; only the month changes. In ${anosCd.map((x) => `${x.y} it falls on ${dmo(x.d, h.lang)}`).join(', ')}.</p>
<p>In 2027 Easter is early and Corpus Christi still falls in May, before the popular saints' festivals. In 2028 Easter is late and Corpus Christi moves to mid-June, five days after 10 June. The official list of compulsory holidays is in ${h.src('ct234', 'article 234 of the Labour Code')}, as worded by ${h.src('l8-2016', 'Law 8/2016')}.</p>
${h.mini('fd', { p: ['ano'], d: { feriado: 'corpo-deus', ano: 2028 }, c: 'Corpus Christi in another year' })}
<h2>Other 2027 holidays with a bridge</h2>
<p>The same tool shows any national holiday: choose Portugal Day or 5 October to see the other two one-day bridges of 2027. Ascension Day, ${h.day(asc)}, forty days after Easter, is not a national holiday, but it is a municipal holiday in some municipalities${melgaco?.feriado ? ', such as Melgaço' : ''}: see ${h.a('feriado-municipal', 'municipal holiday')}. Easter and the dates that depend on it are on ${h.a('pascoa-2027', 'Easter 2027')}.</p>`,
    },
  }),
  defineGuide({
    id: 'pascoa-2027', group: 'datas', order: 21, tool: 'pa', toolArg: { ano: Y },
    related: ['corpo-de-deus-2027', 'carnaval-2027', 'calendario-2027', 'home', 'feriados-2028'],
    sources: ['ct234', 'hora'],
    countdown: { date: ps, label: { pt: 'Páscoa 2027', en: 'Easter Sunday 2027' } },
    pt: {
      slug: 'pascoa-2027', nav: 'Páscoa 2027', card: '28 de março: a data e o cálculo passo a passo',
      title: 'Páscoa 2027: domingo 28 de março e a Sexta-Feira Santa',
      description: 'A Páscoa de 2027 é a 28 de março, a Sexta-Feira Santa a 26 de março. O cálculo pela fórmula de Gauss passo a passo e as datas da Páscoa e do Carnaval até 2034.',
      h1: 'Páscoa 2027: quando é e como se calcula',
      intro: 'Escolha um ano entre 2000 e 2060: a ferramenta dá o Domingo de Páscoa, as datas que dependem dele e o cálculo de Gauss passo a passo.',
      resume: `A Páscoa de 2027 é o domingo ${dLong(ps, 'pt')}, uma das mais cedo da década. A Sexta-Feira Santa, feriado nacional obrigatório, é a ${dLong(sx, 'pt')}, e o Domingo de Páscoa também consta da lista do artigo 234.º do Código do Trabalho, embora calhe sempre a um domingo. A data muda todos os anos porque a Páscoa é o primeiro domingo depois da lua cheia que se segue ao equinócio da primavera, fixado em 21 de março pelo calendário gregoriano; por isso cai sempre entre 22 de março e 25 de abril. Da Páscoa dependem a terça de Carnaval (47 dias antes), a Ascensão (39 dias depois), o Pentecostes e o Corpo de Deus (60 dias depois). Em 2027 o Domingo de Páscoa coincide com o dia em que a hora muda para a hora de verão: a noite de sábado para domingo tem uma hora a menos. Com quatro dias de férias na semana anterior, de ${dmo(pasP.ferieDal, 'pt')} a ${dmo(pasP.ferieAl, 'pt')}, ficam ${nn(pasP.liberi, 'pt')} dias livres.`,
      faqs: [
        { q: 'Quando é a Páscoa de 2027?', a: `No domingo ${dLong(ps, 'pt')}. A Sexta-Feira Santa é a ${dLong(sx, 'pt')} e o Corpo de Deus a ${dLong(cd, 'pt')}. São dois feriados nacionais obrigatórios que dependem da Páscoa; o Carnaval, que também depende dela, é a terça-feira 9 de fevereiro, mas não é feriado obrigatório. A ferramenta acima calcula a Páscoa de qualquer outro ano.` },
        { q: 'A segunda-feira de Páscoa é feriado em Portugal?', a: 'Não a nível nacional. Alguns concelhos fazem da segunda-feira a seguir à Páscoa o seu feriado municipal; a lista dos que confirmámos no sítio da câmara está na página do feriado municipal. Nos outros concelhos é um dia normal de trabalho, salvo se a convenção coletiva ou o contrato derem esse dia; o Domingo de Páscoa, esse, é feriado nacional.' },
        { q: 'Como se calcula a data da Páscoa?', a: 'Com a fórmula de Gauss, que reduz as regras do calendário gregoriano a contas inteiras: a partir do ano obtém-se o dia da lua cheia pascal em março e depois o domingo seguinte. A tabela da ferramenta mostra cada passo para o ano escolhido.' },
      ],
      body: (h) => `<h2>O cálculo de Gauss, para qualquer ano</h2>
<p>A tabela da ferramenta mostra as grandezas da fórmula: o século, as correções lunar e solar, a posição do ano no ciclo de dezanove anos da Lua e, no fim, o dia de março em que calha a Páscoa (um valor acima de 31 quer dizer abril). Os testes do sítio comparam o resultado com um segundo algoritmo, de Meeus, para todos os anos de 1600 a 2600.</p>
${h.mini('pa', { p: ['ano'], d: { ano: 2028 }, c: 'A Páscoa de outro ano' })}
<h2>Páscoa, hora de verão e férias</h2>
<p>A mudança para a hora de verão faz-se no último domingo de março, segundo a ${h.src('hora', 'Diretiva 2000/84/CE')}; em 2027 é o mesmo dia da Páscoa. A Sexta-Feira Santa dá um fim de semana de três dias; a ${h.src('ct234', 'lei')} permite ainda observá-la noutro dia com significado local no período da Páscoa. Os feriados que dependem da Páscoa estão no ${h.a('calendario-2027', 'calendário 2027')}; o Carnaval em ${h.a('carnaval-2027', 'Carnaval 2027')}.</p>`,
    },
    en: {
      slug: 'easter-2027', nav: 'Easter 2027', card: '28 March: the date and the step-by-step calculation',
      title: 'Easter 2027 in Portugal: Sunday 28 March, Good Friday',
      description: 'Easter 2027 in Portugal is 28 March and Good Friday 26 March. See Gauss’s calculation step by step and the dates of Easter and Carnival in the years up to 2034.',
      h1: 'Easter 2027: when it is and how it is calculated',
      intro: 'Choose a year between 2000 and 2060: the tool gives Easter Sunday, the dates that depend on it and Gauss’s calculation step by step.',
      resume: `Easter 2027 is Sunday ${dLong(ps, 'en')}, one of the earliest of the decade. Good Friday, a compulsory national holiday in Portugal, is ${dLong(sx, 'en')}, and Easter Sunday is also on the list in article 234 of the Labour Code, though it always falls on a Sunday. The date changes every year because Easter is the first Sunday after the full moon that follows the spring equinox, set at 21 March by the Gregorian calendar; so it always falls between 22 March and 25 April. Carnival Tuesday (47 days before), Ascension Day (39 days after), Pentecost and Corpus Christi (60 days after) all depend on it. In 2027 Easter Sunday is also the day the clocks go forward to summer time: Saturday night is an hour shorter. Four leave days in the week before, ${dmo(pasP.ferieDal, 'en')} to ${dmo(pasP.ferieAl, 'en')}, give ${nn(pasP.liberi, 'en')} days off.`,
      faqs: [
        { q: 'When is Easter 2027?', a: `On Sunday ${dLong(ps, 'en')}. Good Friday is ${dLong(sx, 'en')} and Corpus Christi ${dLong(cd, 'en')}. Both are compulsory national holidays that depend on Easter; Carnival, which also depends on it, is Tuesday 9 February but is not a compulsory holiday. The tool above works out Easter for any other year.` },
        { q: 'Is Easter Monday a public holiday in Portugal?', a: 'Not nationally. Some municipalities make the Monday after Easter their municipal holiday; the ones we confirmed on the council website are listed on the municipal holiday page. Elsewhere it is a normal working day unless your collective agreement or contract gives it; Easter Sunday itself is a national holiday.' },
        { q: 'How is the date of Easter calculated?', a: 'With Gauss’s formula, which turns the Gregorian calendar rules into whole-number arithmetic: from the year you get the day of the paschal full moon in March and then the following Sunday. The tool’s table shows each step for the chosen year.' },
      ],
      body: (h) => `<h2>Gauss’s calculation, for any year</h2>
<p>The tool's table shows the formula's quantities: the century, the lunar and solar corrections, the year's place in the Moon's nineteen-year cycle and, finally, the day of March on which Easter falls (a value above 31 means April). The site's tests compare the result with a second algorithm, Meeus's, for every year from 1600 to 2600.</p>
${h.mini('pa', { p: ['ano'], d: { ano: 2028 }, c: 'Easter in another year' })}
<h2>Easter, summer time and leave</h2>
<p>Clocks go forward on the last Sunday of March under ${h.src('hora', 'Directive 2000/84/EC')}; in 2027 that is Easter Sunday itself. Good Friday gives a three-day weekend; the ${h.src('ct234', 'law')} also allows it to be observed on another locally significant day in the Easter period. The holidays that depend on Easter are on ${h.a('calendario-2027', 'calendar 2027')}; Carnival on ${h.a('carnaval-2027', 'Carnival 2027')}.</p>`,
    },
  }),
  defineGuide({
    id: 'carnaval-2027', group: 'datas', order: 22, tool: 'ca', toolArg: { ano: Y },
    related: ['pascoa-2027', 'feriados-2028', 'home', 'ferias', 'calendario-2027'],
    sources: ['ct'],
    countdown: { date: car.terca, label: { pt: 'Terça de Carnaval 2027', en: 'Carnival Tuesday 2027' } },
    pt: {
      slug: 'carnaval-2027', nav: 'Carnaval 2027', card: 'Terça 9 de fevereiro: é feriado ou não?',
      title: 'Carnaval 2027: terça-feira 9 de fevereiro, é feriado?',
      description: 'O Carnaval de 2027 é na terça-feira 9 de fevereiro. Não é feriado obrigatório: quando é dia livre, a tolerância de ponto, a ponte de segunda, datas até 2033.',
      h1: 'Carnaval 2027: a data e se é feriado',
      intro: 'Escolha o ano: a ferramenta dá a terça de Carnaval, a Quarta-feira de Cinzas, a ponte possível e as datas dos anos seguintes.',
      resume: `A terça-feira de Carnaval de 2027 é a ${dLong(car.terca, 'pt')}, quarenta e sete dias antes do Domingo de Páscoa. Não é feriado obrigatório: o artigo 235.º do Código do Trabalho põe-na entre os feriados facultativos, que só valem se a convenção coletiva ou o contrato de trabalho os previrem. Em vez dela, empregador e trabalhador podem combinar outro dia. Na função pública, o Governo decide a cada ano se concede tolerância de ponto, por despacho. Se a terça for livre para si, a segunda-feira ${dmo(K.addDays(car.terca, -1), 'pt')} é uma ponte de um dia de férias que ${carP ? `dá ${nn(carP.liberi, 'pt')} dias livres` : 'alonga o fim de semana'}. A Quarta-feira de Cinzas é a ${dmo(car.cinzas, 'pt')} e o domingo gordo a ${dmo(car.domingo, 'pt')}.`,
      faqs: [
        { q: 'O Carnaval de 2027 é feriado?', a: 'Não é feriado obrigatório. É facultativo: é dia livre se a sua convenção coletiva ou o seu contrato o preveem, ou, na função pública, se o Governo conceder tolerância de ponto. Não consta da lista do artigo 234.º do Código do Trabalho; o artigo 235.º permite que seja observado como feriado facultativo, e a ferramenta acima mostra a ponte que dá a segunda-feira 8.' },
        { q: 'O que é a tolerância de ponto do Carnaval?', a: 'É uma dispensa de serviço que o Governo concede aos trabalhadores da administração pública por despacho. Não se aplica automaticamente às empresas privadas, e só se conhece quando o despacho é publicado. Nas empresas, o dia só é livre se a convenção coletiva ou o contrato o previrem, ou se a entidade empregadora o decidir; nesse caso, um dia de férias na segunda dá quatro dias seguidos.' },
        { q: 'Em que dia calha o Carnaval de 2028?', a: `Na terça-feira ${dLong(K.carnaval(2028).terca, 'pt')}, porque 2028 é bissexto e a Páscoa calha a ${dmo(K.pascoa(2028), 'pt')}. O Carnaval é sempre quarenta e sete dias antes do Domingo de Páscoa, por isso anda entre o início de fevereiro e o início de março. A tabela da ferramenta acima dá a data de cada ano até 2033.` },
      ],
      body: (h) => `<h2>Carnaval: o que diz a lei</h2>
<p>O ${h.src('ct', 'artigo 235.º do Código do Trabalho')} diz que, além dos feriados obrigatórios, podem ser observados a título de feriado a terça-feira de Carnaval e o feriado municipal da localidade, por instrumento de regulamentação coletiva ou contrato de trabalho. Pode ser observado outro dia em substituição, por acordo. Ou seja: depende do seu contrato.</p>
${h.mini('ca', { p: ['ano'], d: { ano: 2028 }, c: 'O Carnaval de outro ano' })}
<h2>Usar o Carnaval nas pontes</h2>
<p>No otimizador da ${h.a('home', 'página dos feriados 2027')}, a opção « Terça de Carnaval: Livre » junta o dia às contas. Com um dia de férias na segunda fica com quatro dias seguidos em fevereiro, antes da ponte da Páscoa. As datas da Páscoa e da Quaresma estão em ${h.a('pascoa-2027', 'Páscoa 2027')}; as regras gerais das férias em ${h.a('ferias', 'férias')}.</p>`,
    },
    en: {
      slug: 'carnival-2027', nav: 'Carnival 2027', card: 'Tuesday 9 February: is it a holiday?',
      title: 'Carnival 2027 in Portugal: Tuesday 9 February, holiday?',
      description: 'Carnival 2027 in Portugal is Tuesday 9 February. It is not a compulsory holiday: when it is a day off, the tolerância de ponto, the Monday bridge, to 2033.',
      h1: 'Carnival 2027 in Portugal: the date and whether it is a holiday',
      intro: 'Choose the year: the tool gives Carnival Tuesday, Ash Wednesday, the possible bridge and the dates of the following years.',
      resume: `Carnival Tuesday 2027 is ${dLong(car.terca, 'en')}, forty-seven days before Easter Sunday. It is not a compulsory holiday: article 235 of the Labour Code lists it among the optional holidays, which apply only if a collective agreement or the employment contract provides for them. Employer and employee can agree on another day instead. For the civil service, the government decides each year whether to grant a tolerância de ponto, by order. If the Tuesday is off for you, Monday ${dmo(K.addDays(car.terca, -1), 'en')} is a one-leave-day bridge that ${carP ? `gives ${nn(carP.liberi, 'en')} days off` : 'lengthens the weekend'}. Ash Wednesday is ${dmo(car.cinzas, 'en')} and Carnival Sunday ${dmo(car.domingo, 'en')}. The table in the tool gives the date for every year to 2033, and the planner on the home page counts the Tuesday as a day off when you choose that option.`,
      faqs: [
        { q: 'Is Carnival 2027 a public holiday in Portugal?', a: 'It is not a compulsory holiday. It is optional: a day off if your collective agreement or contract provides for it, or, in the civil service, if the government grants a tolerância de ponto. It is not on the list in article 234 of the Labour Code; article 235 allows it to be observed as an optional holiday, and the tool above shows the bridge from Monday 8.' },
        { q: 'What is the Carnival tolerância de ponto?', a: 'It is a release from duty that the government grants civil servants by order. It does not automatically apply to private businesses, and it is only known once the order is published. In businesses the day is only off if the collective agreement or contract provides for it, or if the employer decides so; then one day of leave on Monday gives four days in a row.' },
        { q: 'When is Carnival 2028?', a: `On Tuesday ${dLong(K.carnaval(2028).terca, 'en')}, because 2028 is a leap year and Easter falls on ${dmo(K.pascoa(2028), 'en')}. Carnival is always forty-seven days before Easter Sunday, so it moves between early February and early March. The table in the tool above gives the date for each year to 2033.` },
      ],
      body: (h) => `<h2>Carnival: what the law says</h2>
<p>${h.src('ct', 'Article 235 of the Labour Code')} says that, besides the compulsory holidays, Carnival Tuesday and the local municipal holiday may be observed as holidays under a collective agreement or employment contract. Another day can be observed instead, by agreement. In other words: it depends on your contract.</p>
${h.mini('ca', { p: ['ano'], d: { ano: 2028 }, c: 'Carnival in another year' })}
<h2>Using Carnival for a long weekend</h2>
<p>In the planner on the ${h.a('home', 'holidays 2027')} page, the option "Carnival Tuesday: Day off" adds the day to the count. One leave day on the Monday gives four days in a row in February, ahead of the Easter bridge. Easter and Lent dates are on ${h.a('pascoa-2027', 'Easter 2027')}; the general leave rules on ${h.a('ferias', 'annual leave')}.</p>`,
    },
  }),
];
