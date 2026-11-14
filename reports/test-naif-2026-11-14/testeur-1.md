# Test naïf du 2026-11-14, testeur 1 : feriadosepontes.com
**Persona :** Portugais(e) de 45 ans, salarié(e), à l'aise avec son téléphone, aucune connaissance particulière du sujet, ne lit pas les longs paragraphes. Il/elle a tapé sa question dans Google et a cliqué sur le résultat « Feriados 2027 em Portugal: calendário e melhores pontes » parce qu'il/elle a vraiment cette question.

## 1. Concept

**Après 5 s (01-accueil-1) :** « Feriados 2027 em Portugal e as pontes que rendem mais » + un formulaire Ano / Dias de férias a usar / O seu concelho. Je comprends tout de suite : c'est un site qui me dit les jours fériés 2027 et où poser mes congés pour faire des ponts. Ça correspond exactement au résultat Google. Bon point.

**Après 2 min :** c'est un outil + une encyclopédie des fériés portugais : optimiseur de ponts, liste des 13 fériés, calendrier, Carnaval, Corpo de Deus, jours ouvrés, férié municipal par concelho (Lisboa, Porto, Braga…), calcul des jours de congés. Le concept est clair et utile pour tout salarié portugais. Le bénéfice concret est affiché en gros : « 22 dias livres » pour quelques jours de congé, avec les dates exactes à poser.

**Mais** je doute vite des chiffres : j'ai 8 dans « Dias de férias a usar » et le résultat dit « com 7 dias de férias » ; plus bas, un encadré dit « 10 dias de férias / 27 dias livres », et un autre « Dias livres seguidos com as pontes de 2027 : 54 ». Trois chiffres différents pour la même question, je ne sais plus lequel est « le mien ».

## 2. « Tout le monde peut-il comprendre ? »

Verdict : **oui pour l'essentiel (l'accueil, les pages Carnaval / Corpo de Deus / Lisboa / Porto), non pour le calendrier 2027 et les tableaux**.

Ça décroche :
- sur l'accueil quand le tableau « O seu plan 2027 » est coupé à droite (colonne « Gra… », « Cor… Deu… ») ;
- sur la page Calendário 2027, qui est illisible sur téléphone (en-têtes collés « segundaterçaquartaquintasextasába », dimanche coupé, aucun férié coloré) ;
- sur le vocabulaire : « Definido por esta página », « Pode renunciar acima de », « 1 dia já não alongam nenhuma ponte », « tolerância de ponto », « norma ISO 8601 ».

## 3. Parcours écran par écran

- **01-accueil-1** : compris. Titre clair, trois champs simples. « Mais opções » ne me dit pas ce qu'il cache. « Junta o feriado municipal e, nas ilhas, os regionais » : OK.
- **01-accueil-suite1** : compris dans l'ensemble. « 22 dias livres » en gros, liste de ponts avec « 1 → 4 dias » : je comprends vite (1 jour de congé → 4 jours libres). Coince : titre « com 7 dias de férias » alors que j'ai mis 8 ; phrase « 1 dia já não alongam nenhuma ponte » (faute d'accord, et je dois deviner que c'est mon 8e jour restant). « Cada dia de férias rende 3,1 dias livres seguidos » : compris.
- **01-accueil-suite2 / suite3 / suite4 / suite5** : coince. Le tableau « O seu plano 2027: quando tirar férias » répète la liste du dessus, en plus long, et la dernière colonne est coupée (« Gra », « Cor Deu », « Res da Ind »). Je ne vois pas qu'on peut faire défiler de côté. Puis un 2e tableau « Todas as pontes de 2027 em Portugal, da mai… » (titre coupé) qui reprend encore les mêmes lignes. Long défilement pour rien. Je ne sais pas si « 9 dias livres » pour Páscoa (4 jours de congé) est plus intéressant que mes ponts à « 1 → 4 » : rien ne me guide.
- **01-accueil-suite5 (bas) / suite6** : coince. Bloc brut sans mise en forme : « Páscoa 2027 / 28 de março de 2027 / Feriados 2027 em dia útil / 8 de 13 / 10 dias de férias / 27 dias livres / Dias úteis 2027 (continente) / 253 ». Libellés et valeurs à la queue leu leu, on dirait un bug. Et « 10 dias de férias / 27 dias livres » contredit mes 8 jours → 22.
- **01-accueil-suite6 (texte)** : compris mais redondant : « Dia da Liberdade (25 de Abril) (domingo, 25 de abril) ». Le message important (« um feriado ao sábado ou ao domingo não passa para segunda-feira ») est bien là, utile.
- **01-accueil-suite7** : contradiction : « Junho é o mês mais generoso. O Corpo de Deus calha a 27 de maio… ». Si c'est en mai, pourquoi dire juin ? Le reste (Santo António dimanche, São João jeudi) est utile.
- **01-accueil-suite8 à suite10** : compris. Liste des 13 fériés en fiches (date / Dia / Feriado / Tipo) : claire, mais très longue à faire défiler (une fiche de 4 lignes par férié). Un simple tableau date + nom suffirait.
- **01-accueil-suite10 (bas) / suite11** : « Calcule os seus dias de férias » : coince. « Situação : Ano completo » mais en dessous « Meses completos de contrato no ano de admissão : 6 » — pourquoi me demander des mois si l'année est complète ? « Definido por esta página: Ano: 2027 » : incompris. Résultat « 22 dias úteis » : compris. « Dias livres seguidos com as pontes de 2027 : 54 » : 54 jours « seguidos » ? Impossible à comprendre. « Pode renunciar acima de 20 dias » : jargon.
- **01-accueil-suite12** : compris (« pelo menos 22 dias úteis por ano »). Les accordéons en bas (« As pontes de 2027 por ordem do calendário », « Como usar o otimizador », « Marcar férias: prazos e regras ») ont le triangle ▶ sur une ligne séparée du titre : on dirait des titres, pas des boutons.
- **02-menu-1** : compris. Menu clair : Pontes / Feriados / Municipais / Datas. Petite surprise : sous « Pontes » le 1er lien s'appelle « Feriados 2027 » (et pas « Pontes 2027 »), à côté de « Pontes 2026 » et « Pontes 2028 ».
- **03-pt-calendario-2027-1** : compris en haut : « 13 feriados », « 253 dias úteis, 52 semanas », « A semana 1 começa a 4 de janeiro de 2027 ». Puis le calendrier commence mal : « Sem.segundaterçaquartaquintasextasába ».
- **03-pt-calendario-2027-suite1 à suite4** : **coince fortement**. Le calendrier est cassé sur mobile : jours de la semaine collés et coupés, colonne dimanche invisible, numéro de semaine collé à la date (« 1 4 », « 13 29 ») : je lis « 14 » au lieu de « semaine 1, lundi 4 ». Surtout, **aucun férié n'est coloré** : 1 janvier, 26 mars, 27 mai, 10 juin… tous en noir alors que la légende annonce « feriado nacional » en rose. Le seul intérêt de la page (voir les fériés dans le calendrier) ne marche pas. La liste texte en dessous rattrape.
- **03-pt-calendario-2027-suite5 / suite6** : compris (tableau mois par mois en fiches). « norma ISO 8601 » inutile pour moi. Fiches longues.
- **04-pt-carnaval-2027-1** : compris, très bien. Compte à rebours « 86 dias 9 h 44 min », date en gros « 9 de fevereiro de 2027 », et réponse à ma vraie question : « Não é feriado obrigatório ». Inquiétude : « fuso horário Europe/Paris » — je suis au Portugal, pourquoi Paris ?
- **04-pt-carnaval-2027-suite1 / suite2** : compris. Domingo gordo, Segunda, Quarta-feira de Cinzas, « Ponte se a terça for livre : 1 de férias → 4 dias ». Tableau des années suivantes lisible.
- **04-pt-carnaval-2027-suite3 / suite4** : compris, mais doublon : un second outil « O Carnaval de outro ano » réglé sur 2028, alors que le premier avait déjà un choix d'année et que le tableau donne déjà 2028. Je me demande pourquoi deux fois.
- **04-pt-carnaval-2027-suite5 / suite6** : compris. FAQ, « Para continuar » : bien. La carte « Feriados 2027 » est vide (pas de sous-titre) contrairement aux autres.
- **05-pt-corpo-de-deus-2027-1 / suite1** : compris, très clair : « quinta-feira, 27 de maio de 2027 », « Em 2027 um dia de férias dá uma ponte de quatro dias », « Melhor ponte », « Férias necessárias 1 ». Parfait. Petit défaut typographique : « quinta - feira » avec des espaces autour du tiret.
- **05-pt-corpo-de-deus-2027-suite1 / suite2** : tableau « Ponte : 1 férias → 4 dias » : la faute (« 1 férias ») fait amateur.
- **05-pt-corpo-de-deus-2027-suite3 à suite6** : compris. Même doublon d'outil (« O Corpo de Deus noutro ano »), avec « Definido por esta página: Feriado: Corpo de Deus » incompris.
- **06-pt-dias-uteis-2027-1 / suite1** : compris. 253, seg-sex / seg-sáb, tableau par mois lisible. « dos quais feriados e folgas 8 » : « folgas » ? je pensais que c'étaient les fériés seulement.
- **06-pt-dias-uteis-2027-suite2** : incohérence : titre « Dias úteis de 2027 a 2028, mês a mês » puis « A tabela compara os três anos » et le tableau commence en 2026.
- **06-pt-dias-uteis-2027-suite3 / suite4** : compris mais très long (12 mois × 3 années en fiches).
- **06-pt-dias-uteis-2027-suite5 / suite6** : « Definido por esta página: Ano: 2027 · Semana de trabalho: seg-sex · Terça de Carnaval: Trabalha-se · 24 e 31 de dezembro: Trabalha-se » : je comprends à moitié, on dirait un texte technique. Encore un doublon de l'outil du haut.
- **07-pt-feriado-municipal-lisboa-1 / suite1** : coince : « Em 2027 calha a um domingo: nenhum dia livre a mais. » puis juste en dessous « Ponte com o feriado municipal : 1 de férias → 4 dias ». Laquelle est vraie ? « Fonte: https://www.am-lisboa.pt/101000/1/023623,062024/index.htm » : adresse brute illisible. « Confirmado na câmara em 13 de novembro de 2026 » rassure.
- **07-pt-feriado-municipal-lisboa-suite2 / suite3 / suite4** : compris. L'outil « As suas pontes de 2028 em Lisboa » est intéressant (« 3 → 9 dias » en juin 2028) mais je suis sur une page 2027 et il me parle de 2028 sans prévenir.
- **07-pt-feriado-municipal-lisboa-suite5 / suite6** : compris. « O sítio da câmara recusa leituras automáticas » : je ne comprends pas et ça m'inquiète un peu sur la fiabilité.
- **08-pt-feriado-municipal-porto-1 / suite1** : compris. Bonne info qui manquait à Lisbonne : « Feriado facultativo: vale se o contrato ou a convenção coletiva o prevê ». Faute : « Feriado municipal de Porto » (on dit « do Porto »). Source = un article sur un concert « sao-joao-2024-ana-moura-burrito… » : pas très officiel à mes yeux.
- **08-pt-feriado-municipal-porto-suite2 / suite3 / suite4** : coince : titre « As três pontes de junho no Porto » mais la 1re est « quinta, 27 de maio ». Résultat « 12 dias livres » avec 3 jours : clair et motivant.
- **08-pt-feriado-municipal-porto-suite5 / suite6** : compris.
- **09-pt-feriado-municipal-1 / suite1** : compris mais surprise : titre « pesquise o seu concelho », et c'est Braga qui est affiché d'office, sans que je l'aie choisi. Source = une page « museus/item » de la câmara de Braga : bizarre.
- **09-pt-feriado-municipal-suite2 à suite6** : compris. On apprend que seuls « 84 concelhos confirmados » sur 308 ont une date : si mon concelho n'est pas dedans, je reste sans réponse (pas vu à l'écran ce qui s'affiche alors). Liste en fiches de 5 lignes par concelho : interminable sur téléphone, pas de recherche visible dans la liste.

## 4. Chaque fonction

| Fonction | Trouvée ? | Comprise ? | Utile ? | Évidence /5 |
|---|---|---|---|---|
| Optimiseur de ponts (accueil) | Oui, tout de suite | Oui, sauf 8 → « 7 dias de férias » | Très | 4 |
| Tableaux « O seu plano » / « Todas as pontes » | Oui | À moitié (coupés à droite, doublons) | Moyen | 2 |
| Liste des 13 fériés 2027 | Oui | Oui | Très | 4 |
| Calcul des jours de congés | Oui (bas de l'accueil) | Partiellement (« 54 », « renunciar », « meses… admissão ») | Moyen | 2 |
| Calendrier 2027 mois par mois | Oui (menu) | Non (cassé sur mobile, fériés non colorés) | Aurait été très utile | 1 |
| Carnaval 2027 (compte à rebours, date, férié ou pas) | Oui | Oui | Très | 5 |
| Corpo de Deus 2027 (date, ponte) | Oui | Oui | Très | 5 |
| Dias úteis 2027 | Oui | Oui | Utile (plutôt pour RH) | 4 |
| Férié municipal Lisboa / Porto | Oui | Oui, sauf contradiction « nenhum dia livre » / « 1 → 4 dias » | Très | 3 |
| Recherche férié municipal (308 concelhos) | Oui | Oui | Très, si mon concelho fait partie des 84 | 3 |
| Copiar a ligação / Imprimir / Como se calcula | Oui | Oui | Moyen | 4 |
| Bouton EN | Oui | Oui | Pas pour moi | 5 |

## 5. Enchaînement et navigation

- Menu ☰ clair, en 4 rubriques, avec fil d'Ariane sur chaque page : je sais où je suis.
- « Para continuar » en bas des pages : bons rebonds (Páscoa, Feriados 2028, Calendário…).
- Chaque page suit le même schéma (outil en haut, gros résultat, tableau des années, texte, FAQ) : on s'y habitue vite.
- Mais chaque page a **deux outils** (celui du haut et un second « noutro ano / de 2028 / no seu concelho » plus bas) : c'est répétitif et ça fait douter (« lequel je dois utiliser ? »).
- Les pages sont très longues sur téléphone à cause des listes en fiches (fériés, mois, concelhos) qui prennent 4-5 lignes chacune.

## 6. Difficultés classées

1. **Calendário 2027 cassé sur mobile** (03-pt-calendario-2027-suite1 à suite4). Vécu : en-têtes collés « segundaterçaquartaquintasextasába », dimanche coupé, numéro de semaine collé à la date, et aucun férié coloré alors que la légende promet du rose. La page ne sert à rien. Recommandation : grille 7 colonnes qui tient dans l'écran (en-têtes « S T Q Q S S D »), numéro de semaine en petit gris séparé, fériés vraiment surlignés.
2. **Chiffres contradictoires sur l'accueil** (01-accueil-suite1, suite5, suite11). Vécu : j'ai mis 8 jours, le titre dit « com 7 dias de férias », un encadré dit « 10 dias de férias / 27 dias livres », un autre « 54 » dias livres seguidos. Recommandation : titre = « Com 8 dias de férias (7 usados nas pontes) » ; supprimer ou étiqueter le bloc « 10 dias de férias / 27 dias livres » (« Exemplo: com 10 dias de férias → 27 dias livres ») ; remplacer « Dias livres seguidos com as pontes de 2027 : 54 » par « Dias livres no total (férias + fins de semana + feriados) : 54 ».
3. **Contradiction sur Lisbonne** (07-pt-feriado-municipal-lisboa-1/suite1). « Em 2027 calha a um domingo: nenhum dia livre a mais » puis « Ponte com o feriado municipal : 1 de férias → 4 dias ». Recommandation : en 2027, afficher « Ponte com o feriado municipal : nenhuma em 2027 (calha ao domingo) ».
4. **Tableaux coupés à droite et en double** (01-accueil-suite2 à suite5). Vécu : colonne « Gra… / Cor Deu… » illisible, mêmes ponts listés 3 fois. Recommandation : sur mobile, une fiche par pont (« Tirar sexta, 28 de maio → 4 dias livres, de 27 a 30 de maio, Corpo de Deus ») et un seul tableau « Todas as pontes » replié par défaut.
5. **Phrases fausses ou incohérentes** (01-accueil-suite7, 06-suite2, 08-suite3). « Junho é o mês mais generoso. O Corpo de Deus calha a 27 de maio » → « Maio e junho são os meses mais generosos : o Corpo de Deus calha a 27 de maio e o Dia de Portugal a 10 de junho ». « Dias úteis de 2027 a 2028 » → « Dias úteis de 2026 a 2028, mês a mês ». « As três pontes de junho no Porto » → « As três pontes de maio e junho no Porto ».
6. **Jargon dans les outils**. « Definido por esta página: … » → « Nesta página: ano 2027, concelho Lisboa (pode mudar em cima) » ou le retirer ; « 1 dia já não alongam nenhuma ponte: ficam livres para marcar » → « Sobra 1 dia de férias: não aumenta nenhuma ponte, guarde-o para o verão » ; « Pode renunciar acima de 20 dias » → « Pode trocar por dinheiro os dias acima de 20 » ; « 1 férias → 4 dias » → « 1 dia de férias → 4 dias livres ».
7. **Calcul des congés déroutant** (01-accueil-suite10/11). « Situação: Ano completo » avec « Meses completos de contrato no ano de admissão: 6 » affiché. Recommandation : n'afficher le champ « meses » que si « Ano de admissão » est choisi.
8. **Sources et fuseau qui inquiètent** (04-1, 05-1, 07-suite1, 08-suite1, 09-suite1). « fuso horário Europe/Paris » pour un Portugais ; sources = URL brutes d'un article de concert ou d'une page de musée. Recommandation : « Usa a hora do seu telemóvel » sans fuseau, ou « hora de Lisboa » ; source en lien court « Câmara Municipal do Porto (notícia de 2024) ». Aussi : « Feriado municipal de Porto » → « Feriado municipal do Porto » ; « O sítio da câmara recusa leituras automáticas » → à retirer.

## 7. À garder

- Le titre et le formulaire de l'accueil : on comprend en 5 secondes, ça colle au résultat Google.
- Le gros résultat « 22 dias livres » et la notation « 1 → 4 dias » : immédiate, motivante.
- « Cada dia de férias rende 3,1 dias livres seguidos » : simple et parlant.
- L'explication « um feriado ao sábado ou ao domingo não passa para segunda-feira » : c'est ce qu'on se demande tous.
- Les pages Carnaval et Corpo de Deus : compte à rebours, date en gros, « Não é feriado obrigatório », « Melhor ponte », « Férias necessárias 1 ». Exemplaires.
- La mention « Feriado facultativo: vale se o contrato… » sur Porto/Braga (à mettre aussi sur Lisbonne).
- « Confirmado na câmara em 13 de novembro de 2026 » : rassure.
- Le menu en 4 rubriques, le fil d'Ariane, les FAQ en accordéon, « Para continuar ».

## 8. Notes

Clarté : 6/10
Facilité : 6/10
Utilité : 8/10
