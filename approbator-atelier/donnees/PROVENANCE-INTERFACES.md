# D'où vient la liste des interfaces existantes

> ⛔ **Fichier dérivé.** Écrit par `scripts/derive-interfaces-atelier.mjs`.
> Toute modification à la main sera écrasée à la prochaine dérivation, et fera
> rougir `scripts/verifier-atelier.mjs`.

**Dérivé le** 2026-08-05 · **révision du dépôt** `520c437`

## Pourquoi cette liste existe

Sans elle, vous risquez de **décrire un écran qui existe déjà**. Votre travail
serait perdu, et le nôtre aussi : nous recevrions une demande de création là où
il fallait lire une demande de modification.

## Ce que chaque partie contient, et d'où elle vient

| Partie | Ce que c'est | D'où ça vient |
|---|---|---|
| **5 interfaces livrées** | Ce qui existe et fonctionne dans votre application | Relevé des pages de l'application, avec leur adresse et leur nom |
| **La direction retenue** | La forme que suivent tous les écrans du produit. **Ni livrée ni écartée** — c'est la référence de ce qui se construit | Décision de projet, confirmée le 2026-08-05 |
| **4 directions explorées** | Des formes essayées puis écartées, **avec la raison** | Les maquettes du dépôt, croisées avec le registre des décisions |

⚠️ 1 adresse(s) ne sont pas des écrans : elles vous renvoient ailleurs sans rien afficher. Elles sont listées à part pour que leur absence ne passe pas pour un oubli.

## Les cinq directions sont DANS cette extension

Le document `maquettes/les-cinq-directions.html` porte les cinq formes essayées,
**dans un seul fichier qui s'ouvre seul** — sans réseau, sans compte, sans rien à
installer. 302 Ko.

⛔ **Il n'y a rien à télécharger et aucun dépôt à récupérer.** Le code du module
vit dans un dépôt privé, auquel vous n'avez pas accès et auquel cette extension
n'accède pas non plus. Tout ce qui est nécessaire vous a été remis.

## ⚠️ Ce que vous regardez est un instantané

Cette copie a été figée le 2026-08-05. **L'extension ne peut pas
savoir si une version plus récente existe** — elle n'a aucun moyen de le
vérifier, et prétendre le contraire serait vous induire en erreur.

Si vous voulez être sûr d'avoir l'état courant, **demandez-le à l'équipe** : elle
vous remettra une copie à jour.

## Vos 5 écrans livrés s'ouvrent, eux aussi

Chacun a sa **copie consultable** sous `ecrans/`, dans un fichier qui s'ouvre
seul. Ce ne sont **pas des dessins** de vos écrans : chaque copie a été produite
en **faisant tourner la vraie page** de votre application, puis en figeant ce
qu'elle a affiché. La structure, les libellés et l'habillage sont donc les
vôtres, à l'identique.

| Écran | Adresse | À ouvrir |
|---|---|---|
| Utilisateurs | `/admin/utilisateurs` | `ecrans/utilisateurs.html` |
| Connexion | `/connexion` | `ecrans/connexion.html` |
| Dossier | `/dossiers/[id]` | `ecrans/dossier.html` |
| Ma file | `/file` | `ecrans/ma-file.html` |
| Tableau de bord | `/tableau-de-bord` | `ecrans/tableau-de-bord.html` |

⚠️ **Trois choses que ces copies ne sont pas**, et chacune est écrite en tête du
fichier — vous ne pouvez pas en regarder une sans lire ce qu'elle est :

- **ce ne sont pas vos données** — les dossiers et les personnes affichés
  viennent d'un jeu d'essai, aucune de ces personnes n'existe ;
- **ce n'est pas interactif** — les boutons sont là et ne font rien ; seul le
  passage d'un écran à l'autre fonctionne ;
- **ce n'est pas une capture** — c'est le rendu figé de la page.

**Les directions explorées s'ouvrent aussi** : ce sont des fichiers autonomes.

## Pourquoi les directions écartées sont montrées

Les cacher vous ferait redemander une forme déjà arbitrée, et nous referions un
débat qui a eu lieu. Les voir **avec leur raison** évite les deux.

⛔ **Mais elles ne sont jamais un point de départ.** Composer à partir d'une
direction écartée produirait un écran que personne ne construira.
