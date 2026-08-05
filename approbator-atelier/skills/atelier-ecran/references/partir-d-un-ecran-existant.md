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
