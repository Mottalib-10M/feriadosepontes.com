/** Feriados municipais: pesquisa dos 308 concelhos, santos populares, Açores e Madeira, Lisboa, Porto. Datas: motor e concelhos.json. */
import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { tabelaMunicipais, tabelaAno } from '../../lib/bausteine';
import { dLong, dmo, nn, wdLong, concelhosDoDia } from '../../lib/tool-specs';

const C = K.CONFIRMADOS, T = K.CONCELHOS;
const fixos = C.filter((c) => /^\d/.test(c.feriado!.regra)).length, moveis = C.length - fixos;
const porMes = (m: string) => C.filter((c) => c.feriado!.regra.startsWith(m)).length;
const jun = porMes('06');
const ant = concelhosDoDia('06-13'), joao = concelhosDoDia('06-24'), ped = concelhosDoDia('06-29');
const fd27 = (id: string) => K.feriados(2027).find((f) => f.id === id)!.date;
const nomes = (l: typeof C) => l.map((c) => c.nome).join(', ');
const lis = K.concelhoById('lisboa')!, por = K.concelhoById('porto')!;
const anos = [2026, 2027, 2028, 2029, 2030];
const linha = (c: typeof lis, l: 'pt' | 'en') => anos.map((y) => { const d = K.dataRegra(y, c.feriado!.regra); return `${y}: ${wdLong(d, l)}`; }).join('; ');
const pLis = (y: number) => K.pontes(y, { local: lis }).filter((b) => b.feste.includes('municipal'));
const pPor = (y: number) => K.pontes(y, { local: por }).filter((b) => b.feste.includes('municipal')).sort((a, b) => a.ferie - b.ferie);
const l28 = pLis(2028)[0], p27 = pPor(2027)[0], p26 = pPor(2026)[0];
const acores = T.filter((c) => c.regiao === 'acores'), madeira = T.filter((c) => c.regiao === 'madeira');
const confA = acores.filter((c) => c.feriado), confM = madeira.filter((c) => c.feriado);
const nAc = K.feriados(2027, { local: { nome: '', regiao: 'acores' } }).length, nMa = K.feriados(2027, { local: { nome: '', regiao: 'madeira' } }).length;
const espSanto = K.addDays(K.pascoa(2027), 50);
const lisDu = K.diasUteis(2027, { local: lis }).reduce((a, b) => a + b, 0), porDu = K.diasUteis(2027, { local: por }).reduce((a, b) => a + b, 0);

export default [
  defineGuide({
    id: 'feriado-municipal', group: 'municipais', order: 30, tool: 'fm', toolArg: { concelho: '', ano: 2027 },
    related: ['santos-populares', 'feriado-lisboa', 'feriado-porto', 'acores-madeira', 'home'],
    sources: ['anmp', 'ct'],
    pt: {
      slug: 'feriado-municipal', nav: 'Feriado municipal', card: `Data lida na câmara em ${nn(C.length, 'pt')} dos ${nn(T.length, 'pt')} concelhos; ligação para os outros`,
      title: 'Feriado municipal 2027: a data de cada concelho do país',
      description: 'Feriado municipal 2027 dos 308 concelhos de Portugal: a data confirmada no sítio da própria câmara, com fonte, dia da semana e ponte, ou marcada por confirmar.',
      h1: 'Feriado municipal 2027: escolha o seu concelho',
      intro: `Feriado municipal: escolha o seu concelho. Em ${nn(C.length, 'pt')} dos ${nn(T.length, 'pt')} já lemos a data no sítio da câmara e mostramos o dia de 2027, a ponte possível e a fonte; nos outros damos a ligação para a câmara.`,
      resume: `Cada um dos ${nn(T.length, 'pt')} concelhos de Portugal tem um feriado municipal, escolhido pelo próprio município, muitas vezes no dia do santo padroeiro ou de um acontecimento da sua história. Não há uma lista oficial central: por isso lemos cada data no sítio da câmara municipal e só a publicamos quando lá está escrita junto às palavras « feriado municipal ». Até hoje confirmámos ${nn(C.length, 'pt')} concelhos, com a ligação, um extrato e a data de leitura; os restantes ${nn(T.length - C.length, 'pt')} aparecem « Por confirmar », com a ligação para a câmara. Dos confirmados, ${nn(fixos, 'pt')} têm data fixa e ${nn(moveis, 'pt')} dependem da Páscoa, como a quinta-feira da Ascensão ou a segunda-feira de Páscoa. Junho concentra ${nn(jun, 'pt')} deles, à volta do Santo António, do São João e do São Pedro. O feriado municipal é facultativo pelo artigo 235.º do Código do Trabalho: vale no seu trabalho se o contrato ou a convenção coletiva o preveem.`,
      faqs: [
        { q: 'O feriado municipal é obrigatório?', a: 'Não para todas as empresas. O Código do Trabalho classifica-o como feriado facultativo: é observado quando a convenção coletiva ou o contrato o preveem, e pode ser substituído por outro dia por acordo. Câmaras, escolas e muitos serviços fecham. Na dúvida, veja a convenção coletiva do seu setor.' },
        { q: 'O feriado municipal é o do sítio onde vivo ou onde trabalho?', a: 'O artigo 235.º fala do feriado municipal « da localidade », que na prática é o do concelho onde fica o local de trabalho. Quem vive em Sintra e trabalha em Lisboa tem, em regra, o 13 de junho de Lisboa e não o 29 de junho de Sintra, se o contrato prever o feriado.' },
        { q: 'Porque é que o meu concelho aparece « Por confirmar »?', a: 'Porque ainda não encontrámos a data escrita numa página da câmara ou da assembleia municipal. Não copiamos datas de outros sítios nem de enciclopédias, que às vezes estão erradas. Se conhece a página, envie-nos a ligação pela página de contacto.' },
      ],
      body: (h) => `<h2>Todos os feriados municipais confirmados, por data</h2>
<p>A tabela lista os ${nn(C.length, h.lang)} concelhos confirmados por ordem da data em 2027, com o nome da festa, o dia da semana e a ligação para a página da câmara onde a lemos. Os concelhos dos Açores e da Madeira têm também os feriados regionais; veja ${h.a('acores-madeira', 'Açores e Madeira')}.</p>
${tabelaMunicipais(h, 2027)}
${h.mini('pt', { p: ['concelho', 'municipal', 'ferias'], d: { ano: 2027, concelho: 'braga', municipal: 'sim', ferias: 3 }, c: 'As pontes de 2027 no seu concelho' })}
<h2>Como verificamos cada data</h2>
<p>Partimos da lista das câmaras municipais e dos respetivos sítios mantida pela ${h.src('anmp', 'Associação Nacional de Municípios Portugueses')}. Em cada sítio procuramos uma página onde a câmara escreve a data do seu feriado municipal: a página do concelho, uma notícia das comemorações, um aviso de encerramento dos serviços. Guardamos o endereço, um extrato curto e o dia em que o lemos. Quando a data depende da Páscoa, confirmamos a regra com a data de um ano concreto. Pelo caminho encontrámos datas erradas em listas muito copiadas, por exemplo em Alfândega da Fé, onde a câmara indica o 8 de maio.</p>
<p>Os feriados de junho mais procurados têm página própria: ${h.a('feriado-lisboa', 'Lisboa')}, ${h.a('feriado-porto', 'Porto')} e os ${h.a('santos-populares', 'santos populares')}. Para incluir o feriado do seu concelho nas pontes, escolha-o no otimizador da ${h.a('home', 'página dos feriados 2027')}.</p>`,
    },
    en: {
      slug: 'municipal-holiday', nav: 'Municipal holiday', card: `Date read on the council site for ${nn(C.length, 'en')} of ${nn(T.length, 'en')} municipalities; links for the rest`,
      title: 'Municipal holidays 2027 in Portugal: date for each town',
      description: 'Municipal holidays 2027 for Portugal’s 308 municipalities: the date confirmed on the council’s own website, with source, weekday and bridge, or unconfirmed.',
      h1: 'Portugal municipal holidays 2027: find your municipality',
      intro: `Municipal holidays: choose your municipality. For ${nn(C.length, 'en')} of the ${nn(T.length, 'en')} we have already read the date on the council website and show the 2027 day, the possible bridge and the source; for the others we give the link to the council.`,
      resume: `Each of Portugal's ${nn(T.length, 'en')} municipalities has a municipal holiday, chosen by the municipality itself, often its patron saint's day or a date from its history. There is no central official list: so we read each date on the câmara municipal's website and publish it only where it is written next to the words "feriado municipal". So far we have confirmed ${nn(C.length, 'en')} municipalities, with the link, an extract and the date read; the other ${nn(T.length - C.length, 'en')} are shown as not yet confirmed, with a link to the council. Of the confirmed ones, ${nn(fixos, 'en')} have a fixed date and ${nn(moveis, 'en')} depend on Easter, such as Ascension Thursday or Easter Monday. June holds ${nn(jun, 'en')} of them, around St Anthony's, St John's and St Peter's days. The municipal holiday is optional under article 235 of the Labour Code: it applies at your job if your contract or collective agreement provides for it.`,
      faqs: [
        { q: 'Is the municipal holiday compulsory in Portugal?', a: 'Not for every employer. The Labour Code classes it as an optional holiday: it is observed when the collective agreement or contract provides for it, and another day can replace it by agreement. Councils, schools and many services close. If in doubt, check your sector’s collective agreement.' },
        { q: 'Is it the holiday where I live or where I work?', a: 'Article 235 refers to the municipal holiday "of the locality", which in practice is that of the municipality where your workplace is. Someone living in Sintra and working in Lisbon usually gets Lisbon’s 13 June, not Sintra’s 29 June, if the contract includes the holiday.' },
        { q: 'Why is my municipality shown as not yet confirmed?', a: 'Because we have not yet found the date written on a council or municipal assembly page. We do not copy dates from other websites or encyclopaedias, which are sometimes wrong. If you know the page, send us the link through the contact page.' },
      ],
      body: (h) => `<h2>Every confirmed municipal holiday, by date</h2>
<p>The table lists the ${nn(C.length, h.lang)} confirmed municipalities in 2027 date order, with the feast's name, the weekday and a link to the council page where we read it. Municipalities in the Azores and Madeira also have the regional holidays; see ${h.a('acores-madeira', 'Azores and Madeira')}.</p>
${tabelaMunicipais(h, 2027)}
${h.mini('pt', { p: ['concelho', 'municipal', 'ferias'], d: { ano: 2027, concelho: 'braga', municipal: 'sim', ferias: 3 }, c: 'The 2027 long weekends in your municipality' })}
<h2>How we check each date</h2>
<p>We start from the list of councils and their websites kept by the ${h.src('anmp', 'national association of municipalities')}. On each site we look for a page where the council writes the date of its municipal holiday: the municipality page, a news item on the celebrations, a notice of closed services. We keep the address, a short extract and the day we read it. When the date depends on Easter, we check the rule against a specific year's date. Along the way we found wrong dates in widely copied lists, for example in Alfândega da Fé, where the council gives 8 May.</p>
<p>The most searched June holidays have their own pages: ${h.a('feriado-lisboa', 'Lisbon')}, ${h.a('feriado-porto', 'Porto')} and the ${h.a('santos-populares', 'popular saints')}. To include your municipality's holiday in the bridges, choose it in the planner on the ${h.a('home', 'holidays 2027')} page.</p>`,
    },
  }),
  defineGuide({
    id: 'santos-populares', group: 'municipais', order: 31, tool: 'sp', toolArg: { santo: 'joao', ano: 2027 },
    related: ['feriado-lisboa', 'feriado-porto', 'feriado-municipal', 'corpo-de-deus-2027', 'home'],
    sources: ['anmp', 'ct'],
    pt: {
      slug: 'santos-populares', nav: 'Santos populares', card: 'Santo António, São João e São Pedro em 2027',
      title: 'Santos populares 2027: feriados de junho por concelho',
      description: 'Santos populares 2027: em que dia calham o Santo António, o São João e o São Pedro e que concelhos têm cada um como feriado municipal, confirmado pela câmara.',
      h1: 'Santos populares 2027: quem tem feriado e quando',
      intro: 'Escolha o santo e o ano: a ferramenta mostra o dia da semana, a ponte possível e os concelhos que têm esse dia como feriado municipal confirmado.',
      resume: `Os santos populares são três festas de junho que muitos concelhos escolheram para feriado municipal: o Santo António a 13, o São João a 24 e o São Pedro a 29. Em 2027 o Santo António calha a um ${wdLong('2027-06-13', 'pt')}, o São João a uma ${wdLong('2027-06-24', 'pt')} e o São Pedro a uma ${wdLong('2027-06-29', 'pt')}. Entre os ${nn(C.length, 'pt')} concelhos confirmados no sítio da câmara, ${nn(ant.length, 'pt')} têm feriado no Santo António (${nomes(ant)}), ${nn(joao.length, 'pt')} no São João (${nomes(joao)}) e ${nn(ped.length, 'pt')} no São Pedro (${nomes(ped)}). Como o São João calha a uma quinta, a sexta-feira 25 é ponte de um dia para quem trabalha nesses concelhos; o São Pedro à terça faz o mesmo com a segunda 28. Junho de 2027 tem ainda o Corpo de Deus a 27 de maio e o Dia de Portugal a 10, ambos à quinta-feira.`,
      faqs: [
        { q: 'O São João é feriado em 2027?', a: `É feriado municipal, não nacional. Em 2027, ${dLong('2027-06-24', 'pt')}, é dia livre nos concelhos que o têm como feriado e cujo contrato ou convenção o prevê, como o Porto, Braga ou Vila Nova de Gaia. Em 2027 calha a uma quinta-feira, por isso nesses concelhos um dia de férias na sexta 25 dá quatro dias seguidos; a ferramenta acima mostra a ponte e os concelhos de cada santo.` },
        { q: 'Que concelhos têm feriado a 29 de junho?', a: `Entre os confirmados no sítio da câmara: ${nomes(ped)}. Outros concelhos podem ter a mesma data sem que a tenhamos ainda lido numa página da câmara. Em 2027 o São Pedro calha a uma terça-feira: nesses concelhos, um dia de férias na segunda 28 dá quatro dias seguidos, de sábado a terça.` },
        { q: 'O Santo António é feriado em todo o país?', a: 'Não. O 13 de junho é feriado municipal em Lisboa e noutros concelhos, mas não é feriado nacional. O feriado nacional de junho é o 10, Dia de Portugal, e em alguns anos o Corpo de Deus. Em 2027 o 13 de junho calha a um domingo, por isso nem em Lisboa dá dia livre a mais; em 2028 calhará a uma terça-feira.' },
      ],
      body: (h) => `<h2>Os três santos populares nos próximos anos</h2>
<p>As datas são fixas, só muda o dia da semana. Em 2028 o Santo António é uma terça e o São João um sábado; em 2029 o São João é um domingo. A ferramenta refaz a conta para o ano escolhido e diz quantos dias de férias custa a ponte.</p>
${h.mini('fm', { p: ['concelho'], d: { concelho: 'sintra', ano: 2027 }, c: 'E o feriado do seu concelho, quando é em 2027?' })}
<h2>Feriado municipal e festas não são a mesma coisa</h2>
<p>Muitos concelhos festejam os santos populares sem que o dia seja o seu feriado: Sintra, por exemplo, faz marchas em junho mas o feriado municipal é o São Pedro. Só contamos o dia como feriado quando a câmara o diz. O feriado continua a ser facultativo nos termos do ${h.src('ct', 'artigo 235.º do Código do Trabalho')}. As páginas de ${h.a('feriado-lisboa', 'Lisboa')} e do ${h.a('feriado-porto', 'Porto')} mostram as pontes desses concelhos; a pesquisa de todos está em ${h.a('feriado-municipal', 'feriado municipal')}.</p>`,
    },
    en: {
      slug: 'popular-saints', nav: 'Popular saints', card: 'St Anthony, St John and St Peter in 2027',
      title: 'Popular saints 2027 in Portugal: June municipal holidays',
      description: 'Popular saints 2027 in Portugal: the weekday of St Anthony, St John and St Peter, and the municipalities that keep each as their holiday, per the council.',
      h1: 'Popular saints 2027: who gets a holiday and when',
      intro: 'Choose the saint and the year: the tool shows the weekday, the possible bridge and the municipalities that have that day as a confirmed municipal holiday.',
      resume: `The popular saints are three June feasts that many municipalities chose as their municipal holiday: St Anthony on the 13th, St John on the 24th and St Peter on the 29th. In 2027 St Anthony's Day falls on a ${wdLong('2027-06-13', 'en')}, St John's on a ${wdLong('2027-06-24', 'en')} and St Peter's on a ${wdLong('2027-06-29', 'en')}. Among the ${nn(C.length, 'en')} municipalities confirmed on the council website, ${nn(ant.length, 'en')} have a holiday on St Anthony's Day (${nomes(ant)}), ${nn(joao.length, 'en')} on St John's (${nomes(joao)}) and ${nn(ped.length, 'en')} on St Peter's (${nomes(ped)}). Since St John's Day is a Thursday, Friday 25 is a one-day bridge for people working in those municipalities; St Peter's on a Tuesday does the same with Monday 28. June 2027 also has Corpus Christi on 27 May and Portugal Day on the 10th, both Thursdays.`,
      faqs: [
        { q: 'Is St John’s Day a holiday in Portugal in 2027?', a: `It is a municipal holiday, not a national one. In 2027, ${dLong('2027-06-24', 'en')}, it is a day off in the municipalities that have it, where your contract or agreement provides for it, such as Porto, Braga or Vila Nova de Gaia. In 2027 it falls on a Thursday, so in those municipalities one day of leave on Friday 25 gives four days in a row; the tool above shows the bridge and the municipalities for each saint.` },
        { q: 'Which municipalities have a holiday on 29 June?', a: `Among those confirmed on the council website: ${nomes(ped)}. Other municipalities may share the date without our having read it on a council page yet. In 2027 St Peter’s Day falls on a Tuesday: there, one day of leave on Monday 28 gives four days in a row, Saturday to Tuesday.` },
        { q: 'Is St Anthony’s Day a national holiday?', a: 'No. 13 June is a municipal holiday in Lisbon and other municipalities, but not a national holiday. June’s national holiday is the 10th, Portugal Day, plus Corpus Christi in some years. In 2027 13 June falls on a Sunday, so even in Lisbon it gives no extra day off; in 2028 it will fall on a Tuesday.' },
      ],
      body: (h) => `<h2>The three popular saints in the coming years</h2>
<p>The dates are fixed; only the weekday changes. In 2028 St Anthony's Day is a Tuesday and St John's a Saturday; in 2029 St John's is a Sunday. The tool redoes the count for the chosen year and says how much leave the bridge costs.</p>
${h.mini('fm', { p: ['concelho'], d: { concelho: 'sintra', ano: 2027 }, c: 'And your municipality’s holiday: when is it in 2027?' })}
<h2>A municipal holiday is not the same as a festival</h2>
<p>Many municipalities celebrate the popular saints without the day being their holiday: Sintra, for example, holds marches in June but its municipal holiday is St Peter's Day. We count the day as a holiday only when the council says so. It remains optional under ${h.src('ct', 'article 235 of the Labour Code')}. The ${h.a('feriado-lisboa', 'Lisbon')} and ${h.a('feriado-porto', 'Porto')} pages show those municipalities' bridges; the search across all of them is on ${h.a('feriado-municipal', 'municipal holiday')}.</p>`,
    },
  }),
  defineGuide({
    id: 'acores-madeira', group: 'municipais', order: 34, tool: 'rg', toolArg: { regiao: 'acores', ano: 2027 },
    related: ['feriado-municipal', 'calendario-2027', 'home', 'pascoa-2027', 'feriados-2028'],
    sources: ['dr13-80-a', 'dr27-79-m', 'dlr18-2002-m', 'dlr17-2024-m'],
    pt: {
      slug: 'feriados-acores-madeira', nav: 'Açores e Madeira', card: 'Os feriados regionais das ilhas em 2027',
      title: 'Feriados Açores e Madeira 2027: os regionais e as datas',
      description: 'Feriados regionais 2027: Dia dos Açores na segunda do Espírito Santo, na Madeira 2 de abril, 1 de julho e 26 de dezembro, com a lei de cada um e as pontes.',
      h1: 'Feriados regionais dos Açores e da Madeira em 2027',
      intro: 'Feriados dos Açores e da Madeira: escolha a região autónoma e o ano, e a ferramenta junta aos treze feriados nacionais os regionais, com o dia da semana de cada um.',
      resume: `As regiões autónomas têm feriados próprios, além dos treze nacionais. Nos Açores é o Dia da Região, a segunda-feira do Espírito Santo, cinquenta dias depois da Páscoa, fixado pelo Decreto Regional n.º 13/80/A: em 2027 calha a ${dLong(espSanto, 'pt')}. Na Madeira são três: o 1 de julho, Dia da Região, pelo Decreto Regional n.º 27/79/M; o 26 de dezembro, pelo Decreto Legislativo Regional n.º 18/2002/M; e, desde 2025, o 2 de abril, Dia da Autonomia, pelo Decreto Legislativo Regional n.º 17/2024/M. Assim, em 2027 um trabalhador dos Açores tem ${nn(nAc, 'pt')} feriados e um da Madeira ${nn(nMa, 'pt')}, antes do feriado municipal. Os ${nn(acores.length, 'pt')} concelhos açorianos e os ${nn(madeira.length, 'pt')} madeirenses estão todos no seletor; confirmámos no sítio da câmara o feriado municipal de ${nn(confA.length, 'pt')} e ${nn(confM.length, 'pt')} deles, respetivamente.`,
      faqs: [
        { q: 'Quando é o Dia dos Açores em 2027?', a: `Na segunda-feira ${dLong(espSanto, 'pt')}, a segunda-feira do Espírito Santo, que calha cinquenta dias depois do Domingo de Páscoa. É feriado regional em todas as ilhas dos Açores. Como calha sempre a uma segunda-feira, junta-se ao fim de semana e dá três dias seguidos sem gastar férias. No continente e na Madeira é um dia útil normal.` },
        { q: 'O 2 de abril é feriado na Madeira?', a: 'Sim, desde 2025. O Decreto Legislativo Regional n.º 17/2024/M, publicado no Jornal Oficial a 16 de dezembro de 2024, criou o Dia da Autonomia, a 2 de abril, que lembra a aprovação da Constituição de 1976. Em 2027 calha a uma sexta-feira, uma semana depois da Sexta-Feira Santa de 26 de março, e dá à Madeira um segundo fim de semana prolongado nessa primavera.' },
        { q: 'O 26 de dezembro é feriado em Portugal?', a: 'Só na Madeira, onde é feriado regional desde o Decreto Legislativo Regional n.º 18/2002/M. No continente e nos Açores é um dia útil. Em 2027 o 26 de dezembro calha a um domingo, por isso nem na Madeira dá dia livre a mais. O 1 de julho, Dia da Região, é o outro feriado regional da Madeira.' },
      ],
      body: (h) => `<h2>Feriados dos Açores e da Madeira: a lei de cada um</h2>
<p>O Dia da Região dos Açores vem do ${h.src('dr13-80-a', 'Decreto Regional n.º 13/80/A')}. Na Madeira, o 1 de julho vem do ${h.src('dr27-79-m', 'Decreto Regional n.º 27/79/M')}, o 26 de dezembro do ${h.src('dlr18-2002-m', 'Decreto Legislativo Regional n.º 18/2002/M')} e o 2 de abril do ${h.src('dlr17-2024-m', 'Decreto Legislativo Regional n.º 17/2024/M')}. A ferramenta só conta o 2 de abril a partir de 2025.</p>
${h.mini('pt', { p: ['ferias'], d: { ano: 2027, concelho: 'funchal', ferias: 4 }, c: 'As pontes de 2027 no Funchal, com os feriados regionais' })}
<h2>Os feriados municipais das ilhas</h2>
<p>Nas ilhas o feriado municipal soma-se aos regionais. Entre os confirmados no sítio da câmara estão ${nomes([...confA, ...confM])}. O Funchal, por exemplo, celebra o Dia da Cidade a 21 de agosto. A lista completa, com a fonte de cada data, está em ${h.a('feriado-municipal', 'feriado municipal')}.</p>
${tabelaAno(h, 2027, { nome: 'Madeira', regiao: 'madeira' })}
<p>Os Açores estão uma hora atrás de Lisboa durante todo o ano. A Páscoa, de que depende o Dia dos Açores, está em ${h.a('pascoa-2027', 'Páscoa 2027')}.</p>`,
    },
    en: {
      slug: 'azores-madeira-holidays', nav: 'Azores and Madeira', card: 'The islands’ regional holidays in 2027',
      title: 'Azores and Madeira holidays 2027: regional dates, laws',
      description: 'Regional holidays 2027: Azores Day on Whit Monday, and in Madeira 2 April, 1 July and 26 December, with the law behind each and the long weekends they create.',
      h1: 'Regional holidays in the Azores and Madeira in 2027',
      intro: 'Azores and Madeira holidays: choose the autonomous region and the year, and the tool adds the regional holidays to the thirteen national ones, with each one’s weekday.',
      resume: `Portugal's autonomous regions have holidays of their own on top of the thirteen national ones. In the Azores it is Azores Day, Whit Monday, fifty days after Easter, set by Regional Decree 13/80/A: in 2027 it falls on ${dLong(espSanto, 'en')}. Madeira has three: 1 July, Madeira Day, under Regional Decree 27/79/M; 26 December, under Regional Legislative Decree 18/2002/M; and, since 2025, 2 April, Autonomy Day, under Regional Legislative Decree 17/2024/M. So in 2027 an employee in the Azores has ${nn(nAc, 'en')} holidays and one in Madeira ${nn(nMa, 'en')}, before the municipal holiday. All ${nn(acores.length, 'en')} Azorean and ${nn(madeira.length, 'en')} Madeiran municipalities are in the selector; we have confirmed the municipal holiday on the council website for ${nn(confA.length, 'en')} and ${nn(confM.length, 'en')} of them respectively, each with its source link.`,
      faqs: [
        { q: 'When is Azores Day in 2027?', a: `On Monday ${dLong(espSanto, 'en')}, Whit Monday, fifty days after Easter Sunday. It is a regional holiday on every island of the Azores. As it always falls on a Monday, it joins the weekend and gives three days in a row without using leave. On the mainland and in Madeira it is a normal working day.` },
        { q: 'Is 2 April a holiday in Madeira?', a: 'Yes, since 2025. Regional Legislative Decree 17/2024/M, published in the Official Journal on 16 December 2024, created Autonomy Day on 2 April, recalling the approval of the 1976 Constitution. In 2027 it falls on a Friday, a week after Good Friday on 26 March, so Madeira gets a second long weekend that spring.' },
        { q: 'Is 26 December a holiday in Portugal?', a: 'Only in Madeira, where it is a regional holiday under Regional Legislative Decree 18/2002/M. On the mainland and in the Azores it is a working day. In 2027 26 December falls on a Sunday, so even in Madeira it gives no extra day off. 1 July, Madeira Day, is the region’s other regional holiday.' },
      ],
      body: (h) => `<h2>Azores and Madeira holidays: the law behind each one</h2>
<p>Azores Day comes from ${h.src('dr13-80-a', 'Regional Decree 13/80/A')}. In Madeira, 1 July comes from ${h.src('dr27-79-m', 'Regional Decree 27/79/M')}, 26 December from ${h.src('dlr18-2002-m', 'Regional Legislative Decree 18/2002/M')} and 2 April from ${h.src('dlr17-2024-m', 'Regional Legislative Decree 17/2024/M')}. The tool counts 2 April only from 2025.</p>
${h.mini('pt', { p: ['ferias'], d: { ano: 2027, concelho: 'funchal', ferias: 4 }, c: 'The 2027 long weekends in Funchal, with the regional holidays' })}
<h2>Municipal holidays on the islands</h2>
<p>On the islands the municipal holiday comes on top of the regional ones. Those confirmed on the council website include ${nomes([...confA, ...confM])}. Funchal, for example, celebrates City Day on 21 August. The full list, with each date's source, is on ${h.a('feriado-municipal', 'municipal holiday')}.</p>
${tabelaAno(h, 2027, { nome: 'Madeira', regiao: 'madeira' })}
<p>The Azores are one hour behind Lisbon all year round. Easter, on which Azores Day depends, is on ${h.a('pascoa-2027', 'Easter 2027')}.</p>`,
    },
  }),
  defineGuide({
    id: 'feriado-lisboa', group: 'municipais', order: 32, tool: 'fm', toolArg: { concelho: 'lisboa', ano: 2027 },
    related: ['santos-populares', 'feriado-porto', 'feriado-municipal', 'home', 'pontes-2028'],
    sources: ['anmp', 'ct'],
    pt: {
      slug: 'feriado-municipal-lisboa', nav: 'Feriado de Lisboa', card: 'Santo António, 13 de junho',
      title: 'Feriado municipal de Lisboa 2027: 13 de junho, domingo',
      description: 'Feriado municipal de Lisboa em 2027: o Santo António, 13 de junho, calha a um domingo. Datas até 2030, pontes, dias úteis e a fonte da Assembleia Municipal.',
      h1: 'Feriado municipal de Lisboa: Santo António, 13 de junho',
      intro: 'O feriado de Lisboa é o 13 de junho, dia de Santo António. Mude o ano para ver o dia da semana e a ponte possível.',
      resume: `O feriado municipal de Lisboa é o 13 de junho, dia de Santo António, como escreve a própria Assembleia Municipal de Lisboa a propósito da procissão do santo. Em 2027 calha a um ${wdLong('2027-06-13', 'pt')}, e por isso não dá dia livre a mais a quem trabalha em Lisboa: o feriado ao fim de semana não passa para segunda-feira. Nos anos seguintes calha assim: ${linha(lis, 'pt')}. O melhor ano é 2028, com o 13 de junho à terça, a seguir ao Dia de Portugal ao sábado e dois dias antes do Corpo de Deus: ${l28 ? `um dia de férias na segunda ${dmo(l28.ferieDal, 'pt')} dá ${nn(l28.liberi, 'pt')} dias livres` : 'há uma ponte de um dia'}. Lisboa partilha a data com ${nomes(ant.filter((c) => c.id !== 'lisboa'))}, entre os concelhos confirmados. O feriado municipal é facultativo pelo Código do Trabalho, mas a câmara, as escolas e muitos serviços da cidade fecham.`,
      faqs: [
        { q: 'O 13 de junho de 2027 é feriado em Lisboa?', a: 'Sim, é o feriado municipal de Lisboa, mas em 2027 calha a um domingo. Não há dia de folga noutro dia por causa disso: a lei não transfere feriados que calhem ao fim de semana. As marchas populares e os arraiais da noite de 12 para 13 de junho continuam, mas o feriado em si não dá dia livre este ano.' },
        { q: 'Quem trabalha em Lisboa e vive na Amadora tem feriado a 13 de junho?', a: 'Em regra conta o concelho do local de trabalho, se o contrato ou a convenção coletiva preveem o feriado municipal. Confirme no seu contrato. O feriado municipal da Amadora é outro dia, que só conta para quem trabalha na Amadora. Na ferramenta acima pode escolher qualquer concelho e ver a data, quando a confirmámos no sítio da câmara.' },
        { q: 'Quantos dias úteis tem Lisboa em 2027?', a: `${nn(lisDu, 'pt')} de segunda a sexta, os mesmos que o resto do continente, porque o Santo António calha ao domingo. Em 2028 o 13 de junho é uma terça-feira e Lisboa terá um dia útil a menos do que o resto do continente. A ferramenta acima mostra em que dia calha o feriado nos próximos anos.` },
      ],
      body: (h) => `<h2>Feriado municipal de Lisboa nos próximos anos</h2>
<p>A ferramenta mostra o dia da semana do 13 de junho em cada ano e a melhor ponte com o feriado. Em 2027 Lisboa fica com as pontes do resto do país: as sextas a seguir ao Corpo de Deus e ao Dia de Portugal e a segunda antes do 5 de Outubro.</p>
${h.mini('pt', { p: ['ferias', 'municipal'], d: { ano: 2028, concelho: 'lisboa', ferias: 6, municipal: 'sim' }, c: 'E em 2028? O Santo António calha a uma terça: as suas pontes em Lisboa' })}
<h2>De onde vem a data</h2>
<p>A data foi lida numa página da Assembleia Municipal de Lisboa sobre a procissão de Santo António, que fala do « 13 de junho, feriado municipal e dia de Santo António em Lisboa ». A assembleia é um órgão do próprio município, tal como a câmara. A lista dos municípios vem da ${h.src('anmp', 'Associação Nacional de Municípios Portugueses (ANMP)')}, e o regime do feriado facultativo do ${h.src('ct', 'artigo 235.º do Código do Trabalho')}.</p>
<p>Os outros santos populares estão em ${h.a('santos-populares', 'santos populares')}; o Porto em ${h.a('feriado-porto', 'feriado do Porto')}.</p>`,
    },
    en: {
      slug: 'lisbon-municipal-holiday', nav: 'Lisbon holiday', card: 'St Anthony’s Day, 13 June',
      title: 'Lisbon municipal holiday 2027: 13 June, St Anthony',
      description: 'Lisbon’s municipal holiday in 2027: St Anthony’s Day, 13 June, falls on a Sunday. Dates to 2030, long weekends, working days and the municipal assembly source.',
      h1: 'Lisbon municipal holiday: St Anthony’s Day, 13 June',
      intro: 'Lisbon’s holiday is 13 June, St Anthony’s Day. Change the year to see the weekday and the possible bridge.',
      resume: `Lisbon's municipal holiday is 13 June, St Anthony's Day, as Lisbon's own municipal assembly writes about the saint's procession. In 2027 it falls on a ${wdLong('2027-06-13', 'en')}, so it gives no extra day off to people working in Lisbon: a weekend holiday is not moved to the Monday. In the following years it falls on: ${linha(lis, 'en')}. The best year is 2028, with 13 June on a Tuesday, after Portugal Day on the Saturday and two days before Corpus Christi: ${l28 ? `one leave day on Monday ${dmo(l28.ferieDal, 'en')} gives ${nn(l28.liberi, 'en')} days off` : 'there is a one-day bridge'}. Lisbon shares the date with ${nomes(ant.filter((c) => c.id !== 'lisboa'))} among the confirmed municipalities. The municipal holiday is optional under the Labour Code, but the council, schools and many city services close.`,
      faqs: [
        { q: 'Is 13 June 2027 a holiday in Lisbon?', a: 'Yes, it is Lisbon’s municipal holiday, but in 2027 it falls on a Sunday. No other day off is given because of that: the law does not move holidays that fall on a weekend. The marches and street parties on the night of 12 to 13 June still go ahead, but the holiday itself gives no day off this year.' },
        { q: 'If I work in Lisbon but live in Amadora, do I get 13 June?', a: 'As a rule the municipality of your workplace counts, if your contract or collective agreement includes the municipal holiday. Check your contract. Amadora’s own municipal holiday is a different day, which only counts for people who work in Amadora. In the tool above you can pick any municipality and see the date, where we confirmed it on the council website.' },
        { q: 'How many working days does Lisbon have in 2027?', a: `${nn(lisDu, 'en')} Monday to Friday, the same as the rest of the mainland, because St Anthony’s Day falls on a Sunday. In 2028 13 June is a Tuesday and Lisbon will have one working day fewer than the rest of the mainland. The tool above shows which day the holiday falls on in the coming years.` },
      ],
      body: (h) => `<h2>Lisbon municipal holiday in the coming years</h2>
<p>The tool shows the weekday of 13 June each year and the best bridge with the holiday. In 2027 Lisbon gets the same bridges as the rest of the country: the Fridays after Corpus Christi and Portugal Day and the Monday before 5 October.</p>
${h.mini('pt', { p: ['ferias', 'municipal'], d: { ano: 2028, concelho: 'lisboa', ferias: 6, municipal: 'sim' }, c: 'And in 2028? St Anthony falls on a Tuesday: your Lisbon long weekends' })}
<h2>Where the date comes from</h2>
<p>The date was read on a Lisbon Municipal Assembly page about the St Anthony procession, which speaks of "13 June, municipal holiday and St Anthony's Day in Lisbon". The assembly is a body of the municipality itself, like the council. The list of municipalities comes from the ${h.src('anmp', 'National Association of Portuguese Municipalities (ANMP)')}, and the optional-holiday rules from ${h.src('ct', 'article 235 of the Labour Code')}.</p>
<p>The other popular saints are on ${h.a('santos-populares', 'popular saints')}; Porto on ${h.a('feriado-porto', 'Porto holiday')}.</p>`,
    },
  }),
  defineGuide({
    id: 'feriado-porto', group: 'municipais', order: 33, tool: 'fm', toolArg: { concelho: 'porto', ano: 2027 },
    related: ['santos-populares', 'feriado-lisboa', 'feriado-municipal', 'home', 'calendario-2027'],
    sources: ['anmp', 'ct'],
    pt: {
      slug: 'feriado-municipal-porto', nav: 'Feriado do Porto', card: 'São João, 24 de junho',
      title: 'Feriado municipal do Porto 2027: São João, quinta 24',
      description: 'Feriado municipal do Porto em 2027: o São João, 24 de junho, calha a uma quinta-feira. A ponte de sexta 25, datas até 2030, os dias úteis e a fonte da câmara.',
      h1: 'Feriado municipal do Porto: São João, 24 de junho',
      intro: 'O feriado do Porto é o 24 de junho, dia de São João. Mude o ano para ver o dia da semana e a ponte possível.',
      resume: `O feriado municipal do Porto é o 24 de junho, dia de São João, como diz a própria Câmara Municipal do Porto ao anunciar o concerto de São João « no dia 24 de junho, feriado municipal ». Em 2027 calha a uma ${wdLong('2027-06-24', 'pt')}, e quem trabalha no Porto com o feriado no contrato tem uma ponte de um dia: ${p27 ? `férias na sexta ${dmo(p27.ferieDal, 'pt')} dão ${nn(p27.liberi, 'pt')} dias livres, de ${dmo(p27.liberoDal, 'pt')} a ${dmo(p27.liberoAl, 'pt')}` : 'a sexta-feira seguinte'}. Nos anos seguintes calha assim: ${linha(por, 'pt')}. Em 2028 e 2029 o São João calha ao fim de semana e não dá dia livre a mais. A mesma data é feriado municipal em ${nomes(joao.filter((c) => c.id !== 'porto'))}, entre os concelhos confirmados. Com o feriado, o Porto conta ${nn(porDu, 'pt')} dias úteis em 2027, um a menos do que Lisboa.`,
      faqs: [
        { q: 'O São João de 2027 é feriado no Porto?', a: `Sim, ${dLong('2027-06-24', 'pt')} é o feriado municipal do Porto, uma quinta-feira. Os serviços municipais fecham; nas empresas privadas vale se o contrato ou a convenção coletiva o preveem. Como é quinta-feira, um dia de férias na sexta 25 dá quatro dias seguidos, da noite de São João até domingo.` },
        { q: 'Vila Nova de Gaia também tem feriado a 24 de junho?', a: 'Sim, Vila Nova de Gaia está entre os concelhos cujo feriado municipal a 24 de junho confirmámos no sítio da câmara, tal como Braga e Guimarães. Quem trabalha no Porto ou em Gaia tem, em regra, o mesmo feriado, porque conta o concelho do local de trabalho. A ferramenta acima mostra a data confirmada e a fonte de cada um.' },
        { q: 'O São João dá ponte em 2026?', a: `Em 2026 o 24 de junho foi uma ${wdLong('2026-06-24', 'pt')}: ${p26 ? `a ponte custava ${nn(p26.ferie, 'pt')} dias de férias para ${nn(p26.liberi, 'pt')} dias livres` : 'não havia ponte de um dia'}. Em 2027 calha a uma quinta-feira, com ponte de um dia na sexta 25, e em 2028 a um sábado, sem dia livre a mais. A ferramenta acima calcula a ponte de qualquer ano.` },
      ],
      body: (h) => `<h2>Feriado municipal do Porto nos próximos anos</h2>
<p>A ferramenta mostra o dia da semana do 24 de junho em cada ano e a melhor ponte. 2027 é um bom ano para o Porto: além do São João, o Corpo de Deus e o Dia de Portugal também calham à quinta-feira, a ${dmo(fd27('corpo-deus'), 'pt')} e a ${dmo(fd27('portugal'), 'pt')}: maio e junho têm três pontes de um dia para quem trabalha na cidade.</p>
${h.mini('pt', { p: ['ferias', 'municipal'], d: { ano: 2027, concelho: 'porto', ferias: 3, municipal: 'sim' }, c: 'As três pontes de maio e junho no Porto' })}
<h2>De onde vem a data</h2>
<p>A data foi lida no sítio da Câmara Municipal do Porto, numa notícia do programa de São João. A lista dos municípios vem da ${h.src('anmp', 'ANMP')}, e o regime do feriado facultativo do ${h.src('ct', 'artigo 235.º do Código do Trabalho')}. Os concelhos vizinhos têm datas diferentes: Matosinhos, por exemplo, tem o Senhor de Matosinhos, na terça-feira a seguir ao Pentecostes. Veja todos em ${h.a('feriado-municipal', 'feriado municipal')} e os outros santos em ${h.a('santos-populares', 'santos populares')}.</p>`,
    },
    en: {
      slug: 'porto-municipal-holiday', nav: 'Porto holiday', card: 'St John’s Day, 24 June',
      title: 'Porto municipal holiday 2027: St John, Thursday 24 June',
      description: 'Porto’s municipal holiday in 2027: St John’s Day, 24 June, falls on a Thursday. The Friday 25 bridge, the dates to 2030, working days and the council source.',
      h1: 'Porto municipal holiday: St John’s Day, 24 June',
      intro: 'Porto’s holiday is 24 June, St John’s Day. Change the year to see the weekday and the possible bridge.',
      resume: `Porto's municipal holiday is 24 June, St John's Day, as Porto City Council itself says when announcing the St John's concert "on 24 June, municipal holiday". In 2027 it falls on a ${wdLong('2027-06-24', 'en')}, and people working in Porto with the holiday in their contract get a one-day bridge: ${p27 ? `leave on Friday ${dmo(p27.ferieDal, 'en')} gives ${nn(p27.liberi, 'en')} days off, from ${dmo(p27.liberoDal, 'en')} to ${dmo(p27.liberoAl, 'en')}` : 'the following Friday'}. In the following years it falls on: ${linha(por, 'en')}. In 2028 and 2029 St John's Day falls on a weekend and gives no extra day off. The same date is the municipal holiday in ${nomes(joao.filter((c) => c.id !== 'porto'))} among the confirmed municipalities. With the holiday, Porto counts ${nn(porDu, 'en')} working days in 2027, one fewer than Lisbon.`,
      faqs: [
        { q: 'Is St John’s Day 2027 a holiday in Porto?', a: `Yes, ${dLong('2027-06-24', 'en')} is Porto’s municipal holiday, a Thursday. Municipal services close; at private employers it applies if the contract or collective agreement provides for it. As it is a Thursday, one day of leave on Friday 25 gives four days in a row, from St John’s night to Sunday.` },
        { q: 'Does Vila Nova de Gaia also have 24 June off?', a: 'Yes, Vila Nova de Gaia is among the municipalities whose 24 June municipal holiday we confirmed on the council website, as are Braga and Guimarães. Anyone who works in Porto or Gaia usually gets the same holiday, because the workplace municipality counts. The tool above shows the confirmed date and source for each.' },
        { q: 'Did St John’s Day give a bridge in 2026?', a: `In 2026, 24 June was a ${wdLong('2026-06-24', 'en')}: ${p26 ? `the bridge cost ${nn(p26.ferie, 'en')} leave days for ${nn(p26.liberi, 'en')} days off` : 'there was no one-day bridge'}. In 2027 it falls on a Thursday, with a one-day bridge on Friday 25, and in 2028 on a Saturday, with no extra day off. The tool above works out the bridge for any year.` },
      ],
      body: (h) => `<h2>Porto municipal holiday in the coming years</h2>
<p>The tool shows the weekday of 24 June each year and the best bridge. 2027 is a good year for Porto: besides St John's Day, Corpus Christi and Portugal Day also fall on a Thursday, on ${dmo(fd27('corpo-deus'), 'en')} and ${dmo(fd27('portugal'), 'en')}: May and June have three one-day bridges for people working in the city.</p>
${h.mini('pt', { p: ['ferias', 'municipal'], d: { ano: 2027, concelho: 'porto', ferias: 3, municipal: 'sim' }, c: 'Porto’s three May and June bridges' })}
<h2>Where the date comes from</h2>
<p>The date was read on Porto City Council's website, in a news item on the St John's programme. The list of municipalities comes from the ${h.src('anmp', 'ANMP')}, and the optional-holiday rules from ${h.src('ct', 'article 235 of the Labour Code')}. Neighbouring municipalities have different dates: Matosinhos, for example, has Senhor de Matosinhos, on the Tuesday after Pentecost. See them all on ${h.a('feriado-municipal', 'municipal holiday')} and the other saints on ${h.a('santos-populares', 'popular saints')}.</p>`,
    },
  }),
];
