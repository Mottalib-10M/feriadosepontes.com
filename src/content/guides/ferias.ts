/** Férias: CT art. 237.º a 241.º. Números: params-2026.json e motor. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { nn } from '../../lib/tool-specs';

const F = K.P.ferias;
const o22 = K.otimiza(2027, F.minimoAnual), o20 = K.otimiza(2027, F.maxAdmissao), o12 = K.otimiza(2027, 12);
const semana = (y: number) => { const t = K.pontes(y).find((b) => b.ferie === 4 && b.feste.includes('todos-santos')); return t; };
const ts = semana(2027)!;

export default defineGuide({
  id: 'ferias', group: 'ferramentas', order: 4, tool: 'fr', toolArg: { ano: 2027 },
  related: ['home', 'dias-uteis-2027', 'pontes-2028', 'pontes-2026', 'calendario-2027'],
  sources: ['ct'],
  pt: {
    slug: 'ferias', nav: 'Dias de férias', card: '22 dias úteis, ano de admissão e marcação',
    title: 'Dias de férias em Portugal 2027: 22 dias úteis e regras',
    description: 'Dias de férias em 2027: 22 dias úteis por ano, 2 por mês no ano de admissão até 20, quando se podem gozar, quem as marca e como as pontes as multiplicam.',
    h1: 'Dias de férias em Portugal: quantos tem e como os usar',
    intro: 'Indique se é um ano completo ou o ano de admissão e quantos meses de contrato tem: a ferramenta diz os dias de férias e quantos dias livres rendem com as pontes de 2027.',
    resume: `Em Portugal o período anual de férias tem no mínimo ${nn(F.minimoAnual, 'pt')} dias úteis, e vence-se a 1 de janeiro de cada ano pelo trabalho do ano anterior (artigos 237.º e 238.º do Código do Trabalho). Para as férias só contam os dias de segunda a sexta que não são feriado: uma semana com um feriado gasta quatro dias, não cinco. No ano em que é contratado tem ${nn(F.porMesAdmissao, 'pt')} dias úteis por cada mês completo de contrato, até ${nn(F.maxAdmissao, 'pt')}, e só os pode gozar depois de ${nn(F.mesesEspera, 'pt')} meses completos de trabalho (artigo 239.º); nesse ano não pode gozar mais de ${nn(F.maxMesmoAno, 'pt')} dias úteis no total. Os dias acima de ${nn(F.renunciaAcima, 'pt')} podem ser renunciados, e o trabalho desses dias é pago além da retribuição e do subsídio de férias. Bem colocados nas pontes de 2027, os ${nn(F.minimoAnual, 'pt')} dias dão ${nn(o22.liberi, 'pt')} dias livres seguidos.`,
    faqs: [
      { q: 'Quantos dias de férias tenho no primeiro ano de trabalho?', a: `Dois dias úteis por cada mês completo de contrato no ano de admissão, até ${nn(F.maxAdmissao, 'pt')}. Quem começa em março e trabalha até dezembro tem dez meses completos e vinte dias, mas só pode gozá-los seis meses depois do início. Se o ano acabar antes disso, goza-os até 30 de junho do ano seguinte.` },
      { q: 'Os sábados contam como dias de férias?', a: 'Não, salvo se o seu dia de descanso calhar num dia útil: nesse caso contam os sábados e domingos que não sejam feriado em vez desses dias (artigo 238.º, n.º 3). Para a maioria dos trabalhadores, só contam os dias de segunda a sexta.' },
      { q: 'Posso receber dinheiro em vez de gozar férias?', a: `Não, o direito a férias é irrenunciável e não pode ser trocado por compensação (artigo 237.º, n.º 3). A única exceção são os dias acima de ${nn(F.renunciaAcima, 'pt')} úteis, que pode renunciar: trabalha-os e recebe-os além da retribuição e do subsídio de férias.` },
      { q: 'Quem decide quando gozo as férias?', a: 'Em primeiro lugar o acordo entre trabalhador e empregador. Sem acordo, o empregador marca-as, ouvindo os representantes dos trabalhadores, e numa empresa que não seja micro só entre 1 de maio e 31 de outubro. O gozo pode ser repartido, desde que um dos períodos tenha pelo menos dez dias úteis seguidos.' },
    ],
    body: (h) => `<h2>Férias e pontes: o mesmo dia vale mais em certas semanas</h2>
<p>Como só contam os dias úteis, uma semana com um feriado custa menos férias. Em 2027, a semana a seguir ao Dia de Todos os Santos, ${h.day(ts.ferieDal)} a ${h.day(ts.ferieAl)}, custa ${nn(ts.ferie, h.lang)} dias de férias e dá ${nn(ts.liberi, h.lang)} dias livres. Com ${nn(12, h.lang)} dias bem distribuídos obtém ${nn(o12.liberi, h.lang)} dias livres, e com ${nn(F.maxAdmissao, h.lang)} chega a ${nn(o20.liberi, h.lang)}.</p>
${h.mini('pt', { p: ['ferias'], d: { ano: 2027, ferias: 12 }, c: 'Distribua os seus dias pelas pontes' })}
<h2>As regras do Código do Trabalho, em resumo</h2>
<p>O texto completo está nos ${h.src('ct', 'artigos 237.º a 241.º do Código do Trabalho')}. O direito vence-se a 1 de janeiro e não depende da assiduidade. As férias gozam-se no ano civil em que se vencem; por acordo, ou para estar com um familiar que vive no estrangeiro, podem ir até 30 de abril do ano seguinte. Pode juntar metade das férias do ano anterior às do ano em curso, também por acordo.</p>
<p>O mapa de férias é feito pelo empregador até 15 de abril e fica afixado até 31 de outubro. Os cônjuges e as pessoas em união de facto que trabalham na mesma empresa têm direito a férias no mesmo período, salvo prejuízo grave para a empresa. Os períodos mais pedidos, como agosto e as pontes de junho, devem ser rateados entre os trabalhadores, tendo em conta quem os gozou nos dois anos anteriores.</p>
<p>A convenção coletiva pode dar mais dias e regras diferentes de marcação; o que está aqui é o mínimo da lei geral. Os feriados que calham nas férias não as gastam: veja ${h.a('dias-uteis-2027', 'dias úteis 2027')} e as pontes do ano na ${h.a('home', 'página dos feriados 2027')}.</p>`,
  },
  en: {
    slug: 'annual-leave', nav: 'Annual leave', card: '22 working days, first year and booking rules',
    title: 'Annual leave in Portugal 2027: 22 working days, rules',
    description: 'Annual leave in Portugal in 2027: 22 working days a year, 2 per month in your first year up to 20, when it can be taken, who books it and how bridges help.',
    h1: 'Annual leave in Portugal: how much and how to use it',
    intro: 'Annual leave in Portugal is 22 working days a year, fewer in the year you are hired. Say whether it is a full year or the year you were hired and how many months you have worked: the tool gives your leave days and how many days off they buy with the 2027 bridges.',
    resume: `In Portugal annual leave is at least ${nn(F.minimoAnual, 'en')} working days, earned on 1 January each year for the previous year's work (articles 237 and 238 of the Labour Code). Only Monday-to-Friday days that are not holidays count as leave: a week with a holiday uses four days, not five. In the year you are hired you get ${nn(F.porMesAdmissao, 'en')} working days for each full month under contract, up to ${nn(F.maxAdmissao, 'en')}, usable only after ${nn(F.mesesEspera, 'en')} full months of work (article 239); that year you cannot take more than ${nn(F.maxMesmoAno, 'en')} working days in all. Days above ${nn(F.renunciaAcima, 'en')} can be waived, and the work done on them is paid on top of holiday pay and the holiday allowance. Placed well on the 2027 bridges, the ${nn(F.minimoAnual, 'en')} days give ${nn(o22.liberi, 'en')} consecutive days off.`,
    faqs: [
      { q: 'How much leave do I get in my first year in Portugal?', a: `Two working days for each full month under contract in the year you are hired, up to ${nn(F.maxAdmissao, 'en')}. Start in March and work to December and you have ten full months and twenty days, but you can only take them six months after starting. If the year ends before that, you take them by 30 June of the following year.` },
      { q: 'Do Saturdays count as leave days?', a: 'No, unless your rest days fall on weekdays: then the Saturdays and Sundays that are not holidays count instead (article 238(3)). For most employees only Monday to Friday counts, so a week of leave uses five days, not seven. Public holidays on a weekday do not count either, which is why leave placed next to a holiday goes further; the tool above does that count.' },
      { q: 'Can I be paid instead of taking leave?', a: `No, the right to leave cannot be given up or swapped for compensation (article 237(3)). The only exception is days above ${nn(F.renunciaAcima, 'en')} working days, which you may waive: you work them and are paid for them on top of holiday pay and the allowance.` },
      { q: 'Who decides when I take my leave?', a: 'First, an agreement between you and your employer. Without one, the employer books it after hearing employee representatives and, in any business other than a micro-enterprise, only between 1 May and 31 October. Leave can be split, provided one period has at least ten consecutive working days.' },
    ],
    body: (h) => `<h2>Leave and bridges: the same day is worth more in some weeks</h2>
<p>Since only working days count, a week with a holiday costs less leave. In 2027 the week after All Saints' Day, ${h.day(ts.ferieDal)} to ${h.day(ts.ferieAl)}, costs ${nn(ts.ferie, h.lang)} leave days and gives ${nn(ts.liberi, h.lang)} days off. With ${nn(12, h.lang)} well-placed days you get ${nn(o12.liberi, h.lang)} days off, and with ${nn(F.maxAdmissao, h.lang)} you reach ${nn(o20.liberi, h.lang)}.</p>
${h.mini('pt', { p: ['ferias'], d: { ano: 2027, ferias: 12 }, c: 'Spread your days over the bridges' })}
<h2>Annual leave in Portugal: the Labour Code rules, in short</h2>
<p>The full text is in ${h.src('ct', 'articles 237 to 241 of the Labour Code')}. The right falls due on 1 January and does not depend on attendance. Leave is taken in the calendar year it falls due; by agreement, or to be with a family member who lives abroad, it can run to 30 April of the following year. Half of the previous year's leave can be added to the current year's, also by agreement.</p>
<p>The employer draws up the leave schedule by 15 April and keeps it posted until 31 October. Spouses and partners working for the same employer are entitled to leave at the same time, unless it would seriously harm the business. The most sought-after periods, such as August and the June bridges, should be shared out among employees, taking into account who had them in the two previous years.</p>
<p>A collective agreement can give more days and different booking rules; what is here is the general legal minimum. Holidays that fall during your leave do not use it up: see ${h.a('dias-uteis-2027', 'working days 2027')} and the year's bridges on the ${h.a('home', 'holidays 2027')} page.</p>`,
  },
});
