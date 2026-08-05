# D'où viennent les copies de vos écrans

> ⛔ **Fichiers dérivés.** Écrits par `scripts/derive-ecrans-atelier.mjs`.
> Toute modification à la main sera écrasée à la prochaine dérivation, et fera
> **refuser la production du paquet** en nommant l'écran retouché.

**Dérivé le** 2026-08-05 · **révision du dépôt** `520c437`

## Ce que vous regardez, et comment c'est fait

Ces 5 fichiers ne sont **pas des dessins** de vos écrans, et **pas des
captures**. Chacun a été produit en **faisant tourner la vraie page de votre
application** puis en figeant ce qu'elle a affiché.

C'est ce qui les rend fiables : personne n'a reconstitué votre écran de mémoire.
Une reconstitution peut s'éloigner de l'application sans que rien ne le signale —
et vous valideriez alors une image qui n'est pas la vôtre. C'est précisément ce
qu'on veut éviter.

| Ce que vous voyez | D'où ça vient |
|---|---|
| la structure et les libellés | la page elle-même, exécutée |
| les couleurs, la typographie, la mise en page | la feuille de style de votre application |
| le logo | le fichier de votre marque, dans le module |
| les dossiers et les personnes | un **jeu d'essai** — voir ci-dessous |

## ⚠️ Ce que ces copies ne sont pas

- **Ce ne sont pas vos données.** Les dossiers et les personnes affichés viennent
  d'un jeu d'essai ; aucune de ces personnes n'existe.
- **Ce n'est pas interactif.** Les boutons sont là et ne font rien. Seul le
  passage d'un écran à l'autre fonctionne.
- **Ce n'est pas un état courant.** C'est un instantané ; ce document n'a aucun
  moyen de savoir si votre application a changé depuis.

Chacun de ces trois points est écrit **en tête de chaque fichier**, pas seulement
ici : vous ne pouvez pas regarder un de ces écrans sans lire ce qu'il est.

## Les 5 fichiers

| Écran | Adresse dans l'application | Fichier | Taille |
|---|---|---|---|
| Connexion | `/connexion` | `ecrans/connexion.html` | 14 Ko |
| Dossier | `/dossiers/[id]` | `ecrans/dossier.html` | 29 Ko |
| Ma file | `/file` | `ecrans/ma-file.html` | 31 Ko |
| Tableau de bord | `/tableau-de-bord` | `ecrans/tableau-de-bord.html` | 14 Ko |
| Utilisateurs | `/admin/utilisateurs` | `ecrans/utilisateurs.html` | 15 Ko |

## Partir d'un de ces écrans pour demander un changement

Ouvrez l'écran, dites à l'atelier ce que vous voulez y changer **en nommant son
adresse**. La demande produite portera cet écran comme point de départ et sera
lue comme une **modification**, pas comme une création — c'est la différence
entre « dessine-moi un écran » et « voici le mien, voici ce que je veux ».
