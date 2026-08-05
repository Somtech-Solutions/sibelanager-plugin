# L'atelier Approbator

Extension Cowork pour la **Société Immobilière Bélanger** — module
d'approbation des baux.

Elle donne un vocabulaire — les dix étapes du processus, les six
archétypes de tâche, le grain personne/dossier — et elle **compose
l'écran que vous décrivez** : une file de travail, un tableau, une fiche,
un tableau de bord. Elle ne vous enferme pas dans le catalogue ; elle
**valide contre lui** ce qui en sort, et vous dit dans vos mots ce qu'une
demande dépasse.

## Ce que vous en faites

Demandez, en langage courant :

> « Montre-moi la file de travail d'un agent de niveau de base à la
> validation 1. »

Vous obtenez **un fichier HTML**. Double-cliquez : il s'ouvre dans votre
navigateur, fonctionne sans réseau, sans compte, sans serveur. Vous
pouvez le déplacer, l'envoyer par courriel, l'ouvrir sur un autre poste.

**Avant tout : `/voir-les-interfaces`** — ce qui existe déjà dans votre
application. Si l'écran que vous cherchez est là, partez de lui plutôt
que de le redessiner : l'équipe saura quoi modifier au lieu de deviner.

Pour voir le vocabulaire disponible : `/voir-le-catalogue`.
Pour composer : `/nouvel-ecran`.
Pour savoir ce qu'un écran doit respecter : `/voir-les-regles`.
Pour demander ce qui n'existe pas encore : `/demander-un-changement`.

## Pourquoi le vocabulaire est imposé

Ce qui rend une maquette inutilisable, ce n'est pas qu'elle soit laide :
**c'est qu'on ne puisse pas la situer**. Quelle étape sur les dix ? Quel
type de tâche ? Quel grain ?

L'atelier ne vous demande pas d'annoter. **Il rend l'annotation
inévitable** : parce qu'il compose dans le vocabulaire du module, tout ce
que vous produisez arrive chez l'équipe déjà situé — sans que vous ayez
eu quoi que ce soit à comprendre.

Quand vous demandez ce que le module n'encadre pas, l'atelier **ne refuse
pas et ne compose pas en silence** : il **nomme la règle** que ça dépasse,
dans vos mots, et vous demande si vous le voulez quand même. Si vous
confirmez, il compose l'écran, **le marque comme sortant du cadre**, et
écrit à côté une demande de changement pour l'équipe. Votre bricolage
devient une entrée utile plutôt qu'un mur.

## Ce qu'il y a dedans

```
approbator-atelier/
├── .claude-plugin/plugin.json
├── skills/
│   ├── atelier-ecran/            la méthode de composition
│   └── demande-de-changement/    l'aiguillage
├── commands/                     nouvel-ecran · voir-le-catalogue ·
│                                 voir-les-regles · voir-les-interfaces ·
│                                 demander-un-changement
├── gabarits/coquille.html        la boîte de réception, vide
├── donnees/                      le catalogue, le référentiel de
│                                 validation, et leur PROVENANCE —
│                                 tous DÉRIVÉS des sources du dépôt
└── outils/                       le composeur et le validateur
```

> Les quatre commandes sont énumérées parce qu'un contrôle du dépôt les
> compare **dans les deux sens** au contenu de `commands/` : une commande
> livrée que rien ne nomme ici fait rougir, une commande nommée ici qui
> n'existe pas aussi. Les deux autres dossiers ne le sont pas — un
> inventaire recopié à la main se périme au premier fichier ajouté, et il
> ne rougit jamais.

## Le catalogue est dérivé, jamais recopié

`donnees/catalogue.json` et `gabarits/coquille.html` sont **produits par
un script du dépôt** (`scripts/derive-catalogue-atelier.mjs`), à partir
de la migration qui sème les étapes et du relevé du classeur client. Rien
d'autre n'y écrit.

**Une copie écrite à la main dirait huit étapes le jour où le module en
dirait dix, et ne rougirait jamais.** Un contrôle du dépôt
(`scripts/verifier-atelier.mjs`) re-dérive et compare : toute divergence
est rouge.

Voir `donnees/PROVENANCE.md` pour les sources exactes et la date.

## Ce qui existe déjà, et pourquoi ça compte

Sans savoir ce qui est déjà construit, vous risquez de **décrire un écran
qui existe depuis des semaines**. Votre travail serait perdu, et le nôtre
aussi : nous recevrions une demande de création là où il fallait lire une
demande de modification.

`/voir-les-interfaces` montre trois choses, **séparées** : les écrans
livrés, la forme que suit le produit — ni livrée ni écartée —, et les
formes essayées puis écartées, **avec leur raison**. Cette dernière liste
existe pour que vous ne redemandiez pas une forme déjà arbitrée.

**Et vos écrans livrés s'ouvrent** : chacun a sa copie sous `ecrans/`,
produite en **faisant tourner la vraie page** de votre application puis en
figeant ce qu'elle a affiché. Ce ne sont donc pas des dessins : la
structure, les libellés et l'habillage sont les vôtres, à l'identique. Ils
se relient entre eux — vous parcourez votre application, vous ne regardez
pas cinq images.

⚠️ **Trois réserves, écrites en tête de chaque copie** — vous ne pouvez
pas en regarder une sans les lire : **ce ne sont pas vos données** (un jeu
d'essai, aucune de ces personnes n'existe), **rien n'est cliquable** sauf
le passage d'un écran à l'autre, et **c'est un instantané**. Ce n'est pas
une capture de votre application telle qu'elle tourne aujourd'hui.

## Ce qui n'y est pas encore

- **Le connecteur vers l'équipe** — les demandes de changement produisent
  un fichier à remettre, l'acheminement automatique attend.
- **Quelle tâche se fait à quelle étape** — ce rattachement n'a pas été
  relevé auprès du client. L'atelier vous fait donc **choisir** l'étape ;
  il n'en déduit aucune.
- **Les données réelles** — les dossiers et personnes affichés sont
  inventés. Aucun renseignement personnel réel n'entre ici.
