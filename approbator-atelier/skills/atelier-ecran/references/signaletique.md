# La signalétique — six gestes, deux grains

> ⚠️ Les valeurs ci-dessous sont **rappelées pour la lecture**. Ce qui
> fait foi à l'exécution est `donnees/catalogue.json`, dérivé des sources
> du dépôt. Si les deux divergent, c'est le catalogue qui a raison — et
> c'est ce document qu'il faut corriger.

## Les six archétypes — ce que la personne doit FAIRE

Le glyphe vient en tête de ligne. Il est **lisible sans la couleur**
(`EF-04`) : un daltonien, une impression noir et blanc, un écran mal
réglé donnent le même résultat.

| Glyphe | Archétype | Ce que ça veut dire |
|---|---|---|
| ✓ | Confirmation | L'application montre la donnée, l'humain clique Oui (ou corrige). |
| ⚙ | Automatique | L'application exécute — envoi, génération, réservation, calcul. **L'humain ne fait rien.** |
| ⌕ | Vérification | L'application ouvre le contexte et précharge Trustii ; l'humain lit un résultat. |
| ☎ | Appel | L'application compose et journalise ; l'humain parle. |
| ✎ | Note | L'application offre le champ ; l'humain écrit. |
| ⚖ | Décision | L'application présente les éléments ; l'humain tranche. **Le vrai jugement humain.** |

La confirmation est de loin la plus fréquente (environ trois tâches sur
dix). C'est ce qui justifie qu'elle se fasse **en un clic** : rendre ce
geste coûteux coûte partout.

## Les deux grains — de QUI ou de QUOI la tâche parle

Le grain est un **attribut du type de tâche**, pas un réglage global de
l'écran. Deux tâches de la même file peuvent avoir des grains
différents ; c'est le cas normal.

**Grain personne** — la tâche existe en autant d'exemplaires qu'il y a de
signataires. Vérifier l'identité, lire le dossier de crédit, appeler les
références, valider le revenu, suivre la signature. **La ligne nomme la
personne visée.**

**Grain dossier** — la tâche n'existe qu'une fois, quel que soit le
nombre de personnes. Les six confirmations de conformité de l'unité, la
réservation, la génération de la liasse, l'approbation finale, le
contreseing, le refus. **La ligne nomme le dossier.**

⚠️ **Ne les confondez jamais dans l'affichage.** Une file où toutes les
lignes nommeraient le dossier ferait disparaître l'information la plus
utile d'une tâche de grain personne : *de qui parle-t-on ?*

Règle du processus (`RA-05`) : le dossier n'avance à l'étape suivante que
lorsque toutes les tâches de grain personne de l'étape courante sont
faites **pour toutes les personnes**.

## Le caractère bloquant

Une tâche **bloquante** empêche l'étape d'être franchie (`EF-47`). Elle
porte un jeton distinct, encadré et non uniquement coloré. Les tâches non
bloquantes peuvent rester en suspens sans figer le dossier.

## Les trois niveaux

`base`, `intermediaire`, `eleve`. Ils décident **qui voit quelle tâche**.
Un écran est composé pour un niveau ; c'est ce qui fait qu'un agent ne
voit pas la file d'un autre.

⚠️ Le niveau `intermediaire` **n'a aucune source dans le classeur du
client** — celui-ci ne porte que deux gabarits, « niveau élevé » et
« niveau de base ». Il reste au catalogue parce que le rétrécir sur une
mesure qui ne porte pas dessus serait la même faute à l'envers. **À
confirmer auprès du client.**
