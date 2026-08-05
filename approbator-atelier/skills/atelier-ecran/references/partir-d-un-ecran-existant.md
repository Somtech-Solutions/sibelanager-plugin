# Partir d'un écran qui existe déjà

## Le défaut que ce geste répare

Sans catalogue de l'existant, la personne **redessine ce qui existe déjà
sans le savoir**. Elle décrit soigneusement un écran, on le compose, elle
nous le remet — et il est livré depuis des semaines.

Son travail est perdu, et le nôtre aussi : nous recevons une demande de
**création** là où il fallait lire une demande de **modification**.

> **« Dessine-moi un écran »** et **« voici le tien, que veux-tu
> changer »** ne produisent pas la même chose. Seule la seconde est
> exécutable.

## Le réflexe

**Avant de composer, regardez ce qui existe.** Si la personne décrit
quelque chose qui ressemble à un écran livré, dites-le-lui — c'est une
bonne nouvelle, pas une fin de non-recevoir :

> *« Cet écran existe déjà : c'est « Ma file ». Partons de lui — vous me
> direz ce qui vous manque dessus, et l'équipe saura exactement quoi
> modifier. »*

## Montrez-lui l'écran, ne vous contentez pas de le nommer

Chaque interface livrée porte, dans `donnees/interfaces.json`, le champ
`ou` : le chemin d'une **copie consultable** de cet écran. Donnez-le.

Le nommer suffisait à éviter qu'elle le redessine ; le lui **montrer**
est ce qui rend sa demande précise. Devant l'écran, elle ne dit plus
*« je voudrais un tableau des dossiers »*, elle dit *« cette colonne-là,
je la veux avant celle-ci »* — et c'est une demande qu'on peut exécuter.

⛔ **Et dites les trois réserves, toujours les trois.** Une copie montrée
sans elles se fait prendre pour une capture de SON application, avec SES
dossiers — et elle validerait une image qui n'est pas la sienne. Ce
serait le défaut d'origine sous une forme plus crédible qu'avant :

1. **ce ne sont pas ses données** — un jeu d'essai, aucune de ces
   personnes n'existe ;
2. **rien n'est cliquable**, sauf le passage d'un écran à l'autre ;
3. **c'est un instantané** — l'atelier ne peut pas savoir si
   l'application a changé depuis.

Ces trois réserves sont déjà écrites en tête de chaque copie : vous les
répétez, vous ne les remplacez pas.

## Ce qui peut servir de point de départ

| | Point de départ ? |
|---|---|
| Une interface **livrée** | **oui** |
| La **direction retenue** | **oui** |
| Une forme **écartée** ou **absorbée** | ⛔ **non** |

⛔ **Composer à partir d'une forme écartée produirait un écran que
personne ne construira.** Ces formes s'affichent avec leur verdict pour
éviter qu'on les redemande ; elles ne se proposent pas. Si la personne y
tient, c'est une demande de changement — l'arbitrage a eu lieu, le
rouvrir est une décision, pas une composition.

Cette règle est écrite dans `donnees/interfaces.json`, sous
`regles_d_usage` : elle ne vit pas que dans ce document.

## Ce que ça change dans la demande

Ajoutez `depart` à la demande structurée :

```json
{
  "intention": "je voudrais voir aussi le nom du candidat sur chaque ligne",
  "depart": "/file",
  "forme": "file"
}
```

Ce seul champ change ce que l'équipe reçoit. Sans lui : *« il veut un
écran de file avec des noms »* — on cherche lequel, on suppose. Avec
lui : *« sur "Ma file", il manque le nom du candidat »* — on sait quoi
faire.

C'est la même mécanique que le reste de l'atelier : **la personne n'a
rien à comprendre, le rattachement tombe tout seul.**

## Ce que vous ne promettez pas

**Les écrans livrés ne s'affichent pas ici.** Ce sont des pages qui ont
besoin de l'application ouverte et d'une session ; l'atelier produit des
fichiers autonomes. Vous les **nommez et les décrivez** — c'est certain.

Ne promettez pas d'aperçu. Une image annoncée qui n'arrive pas coûte plus
cher que l'absence dite d'avance.

**Les formes explorées, elles, s'ouvrent** : ce sont des fichiers
autonomes, leur chemin est dans la liste.

## Et si l'écran de départ n'existe pas

Vérifiez avant de le rejeter : la personne a pu nommer un écran
autrement que la liste. Si vous ne le trouvez toujours pas, dites-le et
composez normalement — mais **ne devinez pas** un point de départ, il
enverrait l'équipe modifier le mauvais écran.
