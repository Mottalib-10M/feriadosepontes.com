# Synthèse du test naïf du 2026-11-14, 4e tour : feriadosepontes.com

Notes du 4e tour (commit testé fb828ae) : T1 8/8/9, T2 8/8/9, T3 7/7/8. Toutes ≥ 7 ; moyennes Clarté 7,7, Facilité 7,7
(cible ≥ 8), Utilité 8,7. Ce tour, l'éditeur a validé trois corrections ; le reste est noté « non retenu » faute de
validation, à reproposer. Rien de ce qui a été corrigé aux tours 1 à 3 n'est défait.

| # | Difficulté (testeurs) | Statut | Ce qui a été fait / raison |
|---|---|---|---|
| 1 | La liste des 13 feriados 2027 n'arrive qu'au 6e écran de l'accueil (T3 ; T1 « très longue ») ; validé éditeur | **corrigé** | Sous le chapeau, une ligne compacte « Os 13 feriados de 2027: 1 jan · 26 mar · … » avec le lien « Ver a lista com o dia da semana ↓ » ; la liste complète (`tabelaAno`) est déplacée juste après l'outil (`#feriados-2027`) et retirée du corps (pt et en). `check-premier-ecran` repasse. |
| 2 | Les mêmes pontes affichées deux fois (liste du résultat puis « O seu plano 2027 ») (3/3) ; validé éditeur | **corrigé** | Tableau « O seu plano » supprimé de l'outil ; « feriado: Corpo de Deus » ajouté à chaque ligne (« graças a » donnait « graças a Imaculada Conceição ») de la liste, qui montre désormais toutes les pontes du plan (plus de coupure à 6). « Todas as pontes » reste replié (SpecTool ne déplie plus le 2e tableau quand le 1er manque). Test. |
| 3 | Total « dias livres » différent à chaque page (22, 16, 12, 21) ; Lisboa en 2028 sur une page 2027 (T1, T2, T3) ; validé éditeur | **corrigé** | Le libellé au-dessus du gros chiffre commence par l'hypothèse : « Com 8 dias de férias em 2027, somando as pontes em Portugal, tem no total » → « 22 dias livres » (dans l'outil et tous les mini-outils qui le réutilisent). Mini-outil de la page Lisboa ramené sur 2027 (« As suas pontes de 2027 em Lisboa »), ce qui supprime aussi le « segunda, 12 – sexta, 16 de junho, sem contar os feriados » de 2028. Les autres pages gardent l'année de leur sujet (Pontes 2026, Pontes/Feriados 2028). Test. |
| 4 | « Ver todas as pontes …, da mais rentável » : phrase coupée (T1, T2) | **corrigé** | « da mais à menos rentável » (défaut objectif de texte coupé). |
| 5 | « Mais opções … Terça de Carnaval: Trabalha-se » lu comme un fait, pas un réglage (3/3) | **non retenu** | Pas dans les corrections validées par l'éditeur ce tour ; à reproposer (« Toque para indicar (agora: trabalha nesses dias) »). |
| 6 | « Dias de férias a que pode renunciar … » : jargon (3/3) | **non retenu** | Non validé ce tour ; à reproposer (« Dias que pode trocar por dinheiro »), sous réserve de rester fidèle à l'art. 238.º, n.º 5. |
| 7 | Feriado municipal : 84/308 seulement, noms qui mènent hors du site sans prévenir (3/3) | **non retenu** | Non validé ce tour ; une fiche interne par concelho est un module, pas une correction. |
| 8 | Aide du champ concelho peu claire (T1) | **non retenu** | Un seul testeur, non validé. |
| 9 | « 22 dias livres » lu avant son explication ; 27 et 54 plus bas (T3) | **non retenu** | Couvert en partie par la ligne 3 (hypothèse en tête du chiffre) ; le reste non validé. |
| 10 | Pontes non marquées dans le calendrier (T2) | **non retenu** | Un seul testeur, déjà non retenu aux tours 2 et 3. |
| 11 | Sigles et références (am-lisboa.pt, « Sem. », semaine 53) (T3) | **non retenu** | Un seul testeur, non validé ce tour. |
| 12 | Menu sans « Feriados 2027 » (T1) | **non retenu** | Un seul testeur, non validé. |
| 13 | Carte vide « Escolha o seu concelho acima » avec Copiar / Imprimir (T1) | **non retenu** | Un seul testeur, non validé. |
| 14 | « Tipo: nacional » répété 13 fois (T1) | **non retenu** | Un seul testeur, remarque mineure. |

## Défauts de trame relevés (corrigés dans ce site seulement)

- `SpecTool.tsx` : les tableaux du résultat étaient filtrés avant d'être numérotés ; sans tableau principal, le premier
  tableau « en plus » (normalement replié) s'affichait déplié. Corrigé ici (on garde l'indice, on saute le vide).
