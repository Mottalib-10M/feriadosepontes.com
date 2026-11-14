/** Página inicial, português e inglês. Datas e números: motor (src/lib/engine) através do kit, nunca escritos à mão. */
import { KIT as K } from '../lib/kit';
import type { FAQ, Helpers } from '../lib/page-types';
import { formatNumber, type Lang } from '../lib/format';
import { dLong, dShort, wdLong, span } from '../lib/tool-specs';
import { tabelaAno, tabelaRendimento } from '../lib/bausteine';

interface HomeLang {
  title: string; description: string; h1: string; intro: string; resume: string;
  facts: Array<{ k: string; v: string }>; toolsTitle: string; foldTitle: string; faqs: FAQ[];
  why: (h: Helpers) => string; sections: (h: Helpers) => Array<{ title: string; html: string }>;
}
const Y = 2027;
const F = K.feriados(Y);
const fd = (id: string, y = Y) => K.feriados(y).find((f) => f.id === id)!.date;
const n = (x: number, l: Lang) => formatNumber(x, 0, l);
const o5 = K.otimiza(Y, 5), o10 = K.otimiza(Y, 10), o15 = K.otimiza(Y, 15), o22 = K.otimiza(Y, 22);
const o10_26 = K.otimiza(Y - 1, 10), o10_28 = K.otimiza(Y + 1, 10);
const uteis = K.emDiaUtil(F).length, fds = K.aoFimDeSemana(F);
const um = K.pontesDeUmDia(Y), um28 = K.pontesDeUmDia(Y + 1);
const du = K.diasUteis(Y).reduce((a, b) => a + b, 0);
const P = K.pontes(Y);
const com = (id: string) => P.find((b) => b.feste.includes(id))!;
const cd = com('corpo-deus'), pg = com('portugal'), rp = com('republica');
const dez = P.filter((b) => b.feste.includes('restauracao') || b.feste.includes('imaculada'));
const dez1 = dez[0];
const pas = P.find((b) => b.feste.includes('sexta-santa'))!;
const ts = P.find((b) => b.feste.includes('todos-santos'))!;
const lisboa = K.concelhoById('lisboa')!, porto = K.concelhoById('porto')!;
const lis = K.pontes(Y, { local: lisboa }).find((b) => b.feste.includes('municipal'));
const por = K.pontes(Y, { local: porto }).filter((b) => b.feste.includes('municipal')).sort((a, b) => a.ferie - b.ferie)[0];
// Nom sans sa parenthèse avant la date (testeurs naïfs du 2026-11-14, tour 2 : « Dia da Liberdade (25 de Abril) (domingo, 25 de abril) »).
const sem = (x: string) => x.replace(/ \([^)]*\)$/, '');
const fdsPt = fds.map((f) => `${sem(f.name.pt)} (${dShort(f.date, 'pt')})`).join(', ');
const fdsEn = fds.map((f) => `${sem(f.name.en)} (${dShort(f.date, 'en')})`).join(', ');
const NUM_PT_M = ['nenhum', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis'];
const umPt = um.map((b) => dShort(b.ferieDal, 'pt')).join(', '), umEn = um.map((b) => dShort(b.ferieDal, 'en')).join(', ');
const NUM_PT = ['nenhuma', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis'], NUM_EN = ['no', 'one', 'two', 'three', 'four', 'five', 'six'];

const pt: HomeLang = {
  title: 'Feriados 2027 em Portugal: calendário e melhores pontes',
  description: 'Feriados 2027 em Portugal: os 13 feriados nacionais, o feriado municipal do seu concelho e o otimizador que põe as férias nas pontes que rendem mais dias.',
  h1: 'Feriados 2027 em Portugal e as pontes que rendem mais',
  intro: 'Escolha o ano, quantos dias de férias quer usar e, se quiser, o seu concelho: o otimizador mostra os feriados 2027, o melhor plano de pontes e quantos dias livres seguidos terá.',
  resume: `Em ${Y} Portugal tem ${n(F.length, 'pt')} feriados nacionais obrigatórios. O Domingo de Páscoa calha sempre a um domingo; dos outros ${n(F.length - 1, 'pt')}, ${n(uteis, 'pt')} calham de segunda a sexta e ${n(fds.length, 'pt')} perdem-se ao fim de semana, porque em Portugal um feriado ao sábado ou ao domingo não passa para segunda-feira: ${fdsPt}. Em compensação, o ano tem ${NUM_PT[um.length]} pontes clássicas de um só dia de férias: ${umPt}, a seguir ao Corpo de Deus, ao Dia de Portugal e antes do 5 de Outubro. O Ano Novo e a Sexta-Feira Santa calham à sexta e o Dia de Todos os Santos à segunda: três fins de semana de três dias sem gastar férias. Com a melhor distribuição, 5 dias de férias dão ${n(o5.liberi, 'pt')} dias livres seguidos, 10 dias dão ${n(o10.liberi, 'pt')} e os 22 dias úteis mínimos da lei dão ${n(o22.liberi, 'pt')}. Se juntar o feriado municipal do seu concelho, a terça de Carnaval ou os feriados regionais dos Açores e da Madeira, a ferramenta refaz a conta.`,
  facts: [
    { k: `Páscoa ${Y}`, v: dLong(K.pascoa(Y), 'pt') },
    { k: `Feriados de ${Y} que calham de segunda a sexta`, v: `${n(uteis, 'pt')} de ${n(F.length, 'pt')}` },
    { k: 'Dias livres seguidos, se puser 10 dias de férias nas pontes', v: `${n(o10.liberi, 'pt')} dias livres` },
    { k: `Dias de trabalho em ${Y}, de segunda a sexta (continente)`, v: `${n(du, 'pt')} dias úteis` },
  ],
  toolsTitle: 'Outras ferramentas para férias, feriados e calendário',
  foldTitle: 'Perceber os feriados de 2027 e marcar as férias',
  faqs: [
    { q: 'Quantos feriados há em 2027?', a: `${n(F.length, 'pt')} feriados nacionais obrigatórios, todos fixados pelo artigo 234.º do Código do Trabalho, incluindo o Domingo de Páscoa. A eles juntam-se, se o contrato os prevê, a terça-feira de Carnaval e o feriado municipal; nos Açores há mais um feriado regional e na Madeira mais três. Em ${Y}, ${n(uteis, 'pt')} feriados nacionais calham em dia útil.` },
    { q: 'O que é uma ponte?', a: 'É um dia útil entalado entre um feriado e o fim de semana, normalmente uma sexta-feira depois de um feriado à quinta ou uma segunda-feira antes de um feriado à terça. Quem tira férias nesse dia fica com quatro dias livres seguidos. No sentido largo chama-se ponte a qualquer troço curto de dois a quatro dias úteis que une dois períodos livres.' },
    { q: `Quais são as pontes de ${Y}?`, a: `As de um só dia de férias são ${NUM_PT[um.length]}: ${umPt}. Custam dois dias as do 1 e do 8 de dezembro, que calham à quarta-feira. A semana antes da Páscoa e a semana a seguir ao Dia de Todos os Santos custam quatro dias cada e dão nove dias livres. O otimizador ordena-as todas, da mais rentável para a menos rentável.` },
    { q: 'Se um feriado calhar ao domingo, há folga na segunda?', a: `Não. O Código do Trabalho não manda gozar noutro dia o feriado que calhe ao fim de semana, e a possibilidade de o observar na segunda-feira seguinte, prevista no n.º 3 do artigo 234.º, depende de uma lei especial que não existe. Em ${Y} perdem-se assim ${NUM_PT_M[fds.length]} feriados.` },
    { q: 'O Carnaval é feriado?', a: `A terça-feira de Carnaval não é feriado obrigatório. O artigo 235.º do Código do Trabalho permite que a convenção coletiva ou o contrato a tornem feriado, e o Governo concede muitas vezes tolerância de ponto à função pública. Em ${Y} calha a ${dLong(K.carnaval(Y).terca, 'pt')}; marque « Livre » nas opções se for o seu caso.` },
    { q: 'O feriado municipal conta?', a: `Só se o contrato ou a convenção coletiva o preveem, porque também é facultativo. Na prática a maioria das câmaras, escolas e muitas empresas fecham. Publicamos a data de ${n(K.CONFIRMADOS.length, 'pt')} concelhos confirmada no sítio da própria câmara; para os outros mostramos « Por confirmar » e a ligação para a câmara.` },
    { q: 'O que escrevo fica guardado ou é enviado?', a: 'Não. O ano, os dias de férias e o concelho são tratados só no seu navegador. Não há conta nem formulário. Só quando muda alguma coisa a página escreve as suas escolhas na barra de endereço, para poder partilhar a ligação; isso também fica no seu dispositivo.' },
  ],
  why: (h) => `<h2>As pontes de ${Y} que valem mesmo a pena</h2>
<p>O valor de uma ponte é a relação entre dias livres e dias de férias. As três pontes de um dia de ${Y} dão quatro dias livres por um dia de férias: ${span(cd.liberoDal, cd.liberoAl, 'pt')} com o Corpo de Deus, ${span(pg.liberoDal, pg.liberoAl, 'pt')} com o Dia de Portugal e ${span(rp.liberoDal, rp.liberoAl, 'pt')} com a Implantação da República. Uma semana normal de férias, de segunda a sexta, dá nove dias livres por cinco de férias: tudo o que rende mais do que isso é uma boa ponte.</p>
<p>Maio e junho são os meses mais generosos. O Corpo de Deus calha a ${h.dm(fd('corpo-deus'))} e o Dia de Portugal a ${h.dm(fd('portugal'))}, ambos à quinta-feira, com duas semanas de intervalo. Em Lisboa o Santo António, a 13 de junho, é um domingo em ${Y}; no Porto e em Braga o São João, a 24 de junho, é uma quinta-feira e dá mais uma ponte de um dia a quem trabalha nesses concelhos. A lista completa está em ${h.a('calendario-2027', 'calendário 2027')}; os dias úteis mês a mês em ${h.a('dias-uteis-2027', 'dias úteis 2027')}.</p>
${tabelaAno(h, Y)}
${h.mini('fr', { p: ['caso', 'meses'], c: 'Outra pergunta: quantos dias de férias tem por lei em 2027?' })}
<p>Quantas férias tem direito a gozar diz-o primeiro o ${h.src('ct', 'Código do Trabalho, nos artigos 237.º a 239.º')}: pelo menos 22 dias úteis por ano, ganhos a 1 de janeiro pelo trabalho do ano anterior. No ano de admissão são dois dias por cada mês completo de contrato, até vinte. As regras estão na página ${h.a('ferias', 'férias')}.</p>`,
  sections: (h) => [
    { title: `As pontes de ${Y} por ordem do calendário`, html: `<p><strong>Inverno.</strong> O ${h.dm(fd('ano-novo'))} é uma ${h.wd(fd('ano-novo'))}: o primeiro fim de semana do ano tem três dias sem férias. A terça de Carnaval, ${h.day(K.carnaval(Y).terca)}, só é livre para quem a tem no contrato; nesse caso a segunda-feira anterior faz uma ponte de quatro dias.</p>
<p><strong>Páscoa.</strong> A Páscoa é a ${h.day(K.pascoa(Y))}, cedo. A Sexta-Feira Santa, ${h.day(fd('sexta-santa'))}, já dá três dias; os quatro dias úteis antes, ${span(pas.ferieDal, pas.ferieAl, 'pt')}, levam a ${n(pas.liberi, 'pt')} dias livres. O 25 de Abril é um domingo e o 1.º de Maio um sábado: a primavera de ${Y} não dá outras pontes.</p>
<p><strong>Maio e junho.</strong> Duas pontes de um dia: ${h.dm(cd.ferieDal)} depois do Corpo de Deus e ${h.dm(pg.ferieDal)} depois do Dia de Portugal. Com os três dias úteis entre as duas quintas-feiras faz-se uma ponte maior.</p>
<p><strong>Outono.</strong> O 5 de Outubro é uma terça: a segunda, ${h.day(rp.ferieDal)}, é a terceira ponte de um dia. O Dia de Todos os Santos é uma segunda; com quatro dias depois, ${span(ts.ferieDal, ts.ferieAl, 'pt')}, ficam ${n(ts.liberi, 'pt')} dias livres.</p>
<p><strong>Dezembro.</strong> O 1 e o 8 de dezembro calham à quarta-feira: cada um pede dois dias de férias para cinco dias livres, como ${span(dez1.ferieDal, dez1.ferieAl, 'pt')}. O Natal é um sábado; quem tem o 24 e o 31 livres por tolerância de ponto ou por contrato indica-o em « Mais opções ».</p>` },
    { title: 'Como usar o otimizador', html: `<p>Escolha o ano e quantos dias de férias quer dedicar às pontes. Normalmente não são todas as férias do ano, porque uma parte vai para o verão; entre cinco e dez dias é um bom ponto de partida. A ferramenta mostra em cima o total de dias livres, por baixo cada bloco com as datas e, no fim, todas as pontes do ano ordenadas pelo rendimento.</p>
<p>O campo do concelho junta, nas ilhas, os feriados regionais; o feriado municipal, que não é obrigatório, só entra se responder « Tenho o dia livre ». ${lis ? `Em Lisboa o Santo António não dá ponte em ${Y}, mas a sexta ${h.dm(lis.ferieDal)} continua a render ${n(lis.liberi, 'pt')} dias com o Dia de Portugal.` : ''} ${por ? `No Porto, ${h.dm(por.ferieDal)} depois do São João dá ${n(por.liberi, 'pt')} dias livres com ${n(por.ferie, 'pt')} dia de férias.` : ''} A pesquisa dos ${n(K.CONCELHOS.length, 'pt')} concelhos está em ${h.a('feriado-municipal', 'feriado municipal')}.</p>
<p>Os dias de férias que já não alongam nenhuma ponte aparecem como « livres para marcar »: não ganham nada com os feriados, e cada semana inteira de férias vale nove dias livres.</p>` },
    { title: 'Marcar férias: prazos e regras', html: `<p>Segundo o Código do Trabalho, as férias marcam-se por acordo entre o trabalhador e o empregador; na falta de acordo, o empregador marca-as e, numa empresa que não seja micro, só entre 1 de maio e 31 de outubro, salvo convenção diferente (artigo 241.º). O mapa de férias tem de estar feito até 15 de abril. Quem pede cedo tem mais hipóteses de ficar com as pontes mais disputadas, as de junho e de outubro.</p>
<p>Os dias de férias não se trocam por dinheiro; só os que excedem vinte dias úteis podem ser renunciados, e nesse caso o trabalho desses dias é pago além da retribuição e do subsídio de férias (artigo 238.º, n.º 5). Um feriado que calhe durante as férias não conta como dia de férias, porque só contam os dias úteis.</p>` },
    { title: `${Y - 1} e ${Y + 1} comparados`, html: `<p>Em ${Y - 1}, com o 1.º de Maio e o Natal à sexta e o 1 e o 8 de dezembro à terça, dez dias de férias bem distribuídos davam ${n(o10_26.liberi, 'pt')} dias livres. Do resto de ${Y - 1} ficam as pontes de dezembro: veja ${h.a('pontes-2026', 'pontes 2026')}.</p>
<p>Em ${Y + 1} haverá ${n(um28.length, 'pt')} pontes de um dia, contra ${n(um.length, 'pt')} em ${Y}, e dez dias de férias valerão ${n(o10_28.liberi, 'pt')} dias livres. Quem planeia com antecedência encontra tudo em ${h.a('pontes-2028', 'pontes 2028')}.</p>
${tabelaRendimento(h, [Y - 1, Y, Y + 1])}` },
  ],
};

const en: HomeLang = {
  title: 'Public holidays 2027 in Portugal: calendar and long weekends',
  description: 'Public holidays 2027 in Portugal: the 13 national holidays, your municipality’s holiday and a planner that puts your leave on the bridges worth the most.',
  h1: 'Portugal public holidays 2027 and the best long weekends',
  intro: 'Choose the year, how many leave days you want to use and, if you like, your municipality: the planner shows the 2027 holidays, the best long-weekend plan and how many days off you get in a row.',
  resume: `In ${Y} Portugal has ${n(F.length, 'en')} compulsory national public holidays. Easter Sunday is always a Sunday; of the other ${n(F.length - 1, 'en')}, ${n(uteis, 'en')} fall between Monday and Friday and ${n(fds.length, 'en')} are lost to the weekend, because Portugal does not move a Saturday or Sunday holiday to the Monday: ${fdsEn}. On the other hand the year has ${NUM_EN[um.length]} classic long weekends that cost a single leave day: ${umEn}, after Corpus Christi and Portugal Day and before 5 October. New Year's Day and Good Friday fall on a Friday and All Saints' Day on a Monday: three three-day weekends without using leave. With the best spread, 5 leave days give ${n(o5.liberi, 'en')} consecutive days off, 10 give ${n(o10.liberi, 'en')} and the legal minimum of 22 working days gives ${n(o22.liberi, 'en')}. Add your municipality's holiday, Carnival Tuesday or the regional holidays of the Azores and Madeira and the tool redoes the count.`,
  facts: [
    { k: `Easter Sunday ${Y}`, v: dLong(K.pascoa(Y), 'en') },
    { k: `${Y} holidays falling Monday to Friday`, v: `${n(uteis, 'en')} of ${n(F.length, 'en')}` },
    { k: 'Days off in a row if you put 10 leave days on the bridges', v: `${n(o10.liberi, 'en')} days off` },
    { k: `Working days in ${Y}, Monday to Friday (mainland)`, v: `${n(du, 'en')} working days` },
  ],
  toolsTitle: 'More tools for leave, holidays and calendars',
  foldTitle: 'Understanding Portugal’s 2027 holidays and booking leave',
  faqs: [
    { q: 'How many public holidays does Portugal have in 2027?', a: `${n(F.length, 'en')} compulsory national holidays, all set by article 234 of the Labour Code, Easter Sunday included. If your contract provides for them, Carnival Tuesday and the municipal holiday come on top; the Azores add one regional holiday and Madeira three. In ${Y}, ${n(uteis, 'en')} national holidays fall on a weekday.` },
    { q: 'What is a ponte?', a: 'A ponte, literally a bridge, is a working day squeezed between a public holiday and the weekend, usually a Friday after a Thursday holiday or a Monday before a Tuesday holiday. Take that day off and you get four days in a row. Loosely, any short stretch of two to four working days that joins two free periods is also called a ponte.' },
    { q: `Which are the long weekends of ${Y} in Portugal?`, a: `The one-leave-day bridges are ${NUM_EN[um.length]}: ${umEn}. The bridges around 1 and 8 December, both Wednesdays, cost two days. The week before Easter and the week after All Saints' Day cost four days each and give nine days off. The planner ranks them all, best value first.` },
    { q: 'If a holiday falls on a Sunday, is Monday off?', a: `No. The Labour Code does not move a weekend holiday to another day; observing it on the following Monday, as article 234(3) allows, requires a specific law that does not exist. So ${NUM_EN[fds.length] ?? fds.length} holidays are lost in ${Y}. The planner therefore only counts the holidays that fall on a weekday when it ranks the bridges.` },
    { q: 'Is Carnival a public holiday in Portugal?', a: `Carnival Tuesday is not a compulsory holiday. Article 235 of the Labour Code lets a collective agreement or your contract make it one, and the government often grants civil servants a tolerância de ponto. In ${Y} it falls on ${dLong(K.carnaval(Y).terca, 'en')}; choose "Day off" in the options if that applies to you.` },
    { q: 'Does the municipal holiday count?', a: `Only if your contract or collective agreement provides for it, because it is optional too. In practice most councils, schools and many businesses close. We publish the date for ${n(K.CONFIRMADOS.length, 'en')} municipalities, each confirmed on the council's own website; for the others we show "not yet confirmed" and a link to the council.` },
    { q: 'Is anything I enter stored or sent?', a: 'No. Year, leave days and municipality are processed only in your browser. There is no account and no form. Only once you change something does the page write your choice into the address bar so you can share the link; that too stays on your device.' },
  ],
  why: (h) => `<h2>The ${Y} long weekends that really pay off</h2>
<p>The value of a bridge is the ratio of days off to leave days. The three one-day bridges of ${Y} give four days off for one leave day: ${span(cd.liberoDal, cd.liberoAl, 'en')} with Corpus Christi, ${span(pg.liberoDal, pg.liberoAl, 'en')} with Portugal Day and ${span(rp.liberoDal, rp.liberoAl, 'en')} with Republic Day. An ordinary week off, Monday to Friday, gives nine days for five leave days: anything better than that is a good bridge.</p>
<p>May and June are the most generous months. Corpus Christi falls on ${h.dm(fd('corpo-deus'))} and Portugal Day on ${h.dm(fd('portugal'))}, both Thursdays, two weeks apart. In Lisbon, St Anthony's Day, 13 June, is a Sunday in ${Y}; in Porto and Braga, St John's Day, 24 June, is a Thursday and gives one more one-day bridge to people working there. The full list is on ${h.a('calendario-2027', 'calendar 2027')}; working days month by month on ${h.a('dias-uteis-2027', 'working days 2027')}.</p>
${tabelaAno(h, Y)}
${h.mini('fr', { p: ['caso', 'meses'], c: 'Another question: how much leave are you owed in 2027?' })}
<p>How much leave you are owed is set first by the ${h.src('ct', 'Labour Code, articles 237 to 239')}: at least 22 working days a year, earned on 1 January. In the year you are hired it is two days for each full month under contract, up to twenty. The rules are on the ${h.a('ferias', 'annual leave')} page.</p>`,
  sections: (h) => [
    { title: `The long weekends of ${Y}, in calendar order`, html: `<p><strong>Winter.</strong> ${h.dm(fd('ano-novo'))} is a ${h.wd(fd('ano-novo'))}: the year's first weekend lasts three days with no leave. Carnival Tuesday, ${h.day(K.carnaval(Y).terca)}, is off only if your contract says so; then the Monday before makes a four-day bridge.</p>
<p><strong>Easter.</strong> Easter Sunday is ${h.day(K.pascoa(Y))}, early. Good Friday, ${h.day(fd('sexta-santa'))}, already gives three days; the four working days before it, ${span(pas.ferieDal, pas.ferieAl, 'en')}, stretch that to ${n(pas.liberi, 'en')} days off. 25 April is a Sunday and 1 May a Saturday: spring ${Y} offers no other bridges.</p>
<p><strong>May and June.</strong> Two one-day bridges: ${h.dm(cd.ferieDal)} after Corpus Christi and ${h.dm(pg.ferieDal)} after Portugal Day. Adding the three working days between the two Thursdays makes a bigger bridge.</p>
<p><strong>Autumn.</strong> 5 October is a Tuesday: the Monday, ${h.day(rp.ferieDal)}, is the third one-day bridge. All Saints' Day is a Monday; four days after it, ${span(ts.ferieDal, ts.ferieAl, 'en')}, give ${n(ts.liberi, 'en')} days off.</p>
<p><strong>December.</strong> 1 and 8 December fall on a Wednesday: each needs two leave days for five days off, such as ${span(dez1.ferieDal, dez1.ferieAl, 'en')}. Christmas Day is a Saturday; if 24 and 31 December are off for you by contract or tolerância de ponto, set it under "More options".</p>` },
    { title: 'How to use the planner', html: `<p>Choose the year and how many leave days you want to spend on bridges. That is usually not your whole allowance, since part of it goes on a summer break; five to ten days is a good start. The tool shows the total days off at the top, each block with its dates below, and every bridge of the year at the bottom, sorted by value.</p>
<p>The municipality field adds, on the islands, the regional holidays; the municipal holiday, which is not compulsory, only counts if you answer "I have the day off". ${lis ? `In Lisbon, St Anthony's Day gives no bridge in ${Y}, but Friday ${h.dm(lis.ferieDal)} still gives ${n(lis.liberi, 'en')} days with Portugal Day.` : ''} ${por ? `In Porto, ${h.dm(por.ferieDal)} after St John's Day gives ${n(por.liberi, 'en')} days off for ${n(por.ferie, 'en')} leave day.` : ''} The search across all ${n(K.CONCELHOS.length, 'en')} municipalities is on ${h.a('feriado-municipal', 'municipal holiday')}.</p>
<p>Leave days that no longer extend any bridge are shown as "free to plan": they gain nothing from holidays, and each full week of leave is worth nine days off.</p>` },
    { title: 'Booking leave: dates and rules', html: `<p>Under the Labour Code, leave is booked by agreement between employee and employer; failing agreement, the employer sets it and, in any business other than a micro-enterprise, only between 1 May and 31 October unless a collective agreement says otherwise (article 241). The leave schedule must be drawn up by 15 April. Asking early improves your chances for the most popular bridges, in June and October.</p>
<p>Leave cannot be swapped for money; only days above twenty working days can be waived, and the work done on them is then paid on top of holiday pay and the holiday allowance (article 238(5)). A public holiday during your leave does not use up a leave day, because only working days count.</p>` },
    { title: `${Y - 1} and ${Y + 1} compared`, html: `<p>In ${Y - 1}, with 1 May and Christmas Day on a Friday and 1 and 8 December on a Tuesday, ten well-placed leave days gave ${n(o10_26.liberi, 'en')} days off. What is left of ${Y - 1} is the December bridges: see ${h.a('pontes-2026', 'long weekends 2026')}.</p>
<p>${Y + 1} will have ${n(um28.length, 'en')} one-day bridges, against ${n(um.length, 'en')} in ${Y}, and ten leave days will be worth ${n(o10_28.liberi, 'en')} days off. Planning ahead? Everything is on ${h.a('pontes-2028', 'long weekends 2028')}.</p>
${tabelaRendimento(h, [Y - 1, Y, Y + 1])}` },
  ],
};

export const HOME = { pt, en, sources: ['ct234', 'ct', 'l8-2016', 'dr13-80-a', 'dlr17-2024-m', 'anmp'] };
void wdLong; void o15;
