# L'anatomie de la boîte de réception

L'atelier compose **une seule forme d'écran** : la boîte de réception.
Ce n'est pas un défaut de choix, c'est une décision — prise le
2026-08-03, au registre du projet `P-20260728-0002`.

Le client ne choisit donc pas une direction d'interface. Il choisit **ce
que sa boîte de réception montre** : quelle étape, quelles tâches, quel
niveau.

## Les quatre zones

```
┌──────────────────────────────────────────────────────────────┐
│  ① BANDEAU        logo · titre de l'écran                    │
├──────────────────────────────────────────────────────────────┤
│  ② RUBAN DES ÉTAPES   les dix, l'étape courante en évidence  │
├────────────────────────┬─────────────────────────────────────┤
│  ③ LA FILE             │  ④ LA TÂCHE COURANTE                │
│                        │                                      │
│  · glyphe d'archétype  │   · la donnée qui la justifie        │
│  · libellé de la tâche │   · le geste attendu                 │
│  · archétype · grain   │   · le bouton du geste               │
│  · « bloquant » si     │   · « Voir la fiche du dossier »     │
│  · la personne ou le   │                                      │
│    dossier visé        │                                      │
└────────────────────────┴─────────────────────────────────────┘
```

### ② Le ruban — c'est lui qui rend l'écran SITUABLE

Il montre **les dix étapes**, dans l'ordre du client, avec ses libellés
et sa numérotation. L'étape de l'écran courant est en évidence ; les deux
étapes hors de la première version portent la mention « hors V1 ».

Sans ce ruban, une maquette est jolie et inutilisable : on ne sait pas
**où** dans le processus elle se situe. C'est le défaut n°1 que cet
atelier existe pour éviter.

### ③ La file — l'entrée, toujours

Une tâche par ligne. Chaque ligne dit, dans cet ordre :

1. **le glyphe de l'archétype** — le geste attendu, lisible d'un coup
   d'œil, sans dépendre de la couleur ;
2. **le libellé de la tâche**, tel que le catalogue le nomme ;
3. **les jetons** — archétype, grain, et « bloquant » le cas échéant ;
4. **qui ou quoi est visé** — la personne pour une tâche de grain
   personne, le dossier pour une tâche de grain dossier.

Le point 4 est le cœur d'`EF-03` : *« la file montre les deux sans les
confondre »*. Une ligne de grain personne ne nomme jamais le dossier à
sa place, et réciproquement.

### ④ La tâche courante

Deux cartes :

- **La donnée qui la justifie** (`EF-04`) — pourquoi cette tâche est là,
  et sur quoi porter le regard. Personne ou dossier visé, dossier de
  rattachement, justification, exigences.
- **Le geste attendu** — la phrase de l'archétype, et le bouton qui
  correspond. Une confirmation se confirme en un clic.

### La fiche du dossier — consultable, jamais l'entrée

Elle s'ouvre depuis le bouton « Voir la fiche du dossier », dans le
détail d'une tâche. On y revient à la file d'un clic.

> « **Les gens veulent voir des tâches, pas une fiche.** » — BRD §2.3

Un écran dont l'accueil serait une fiche contredirait le produit. Le
harnais du dépôt le fait rougir (`scripts/verifier-atelier.mjs`, section E).

## Ce que l'écran ne fait pas

- **Il n'enregistre rien.** Cliquer un geste ne change aucun état : c'est
  une maquette d'exploration, pas l'application.
- **Il ne va nulle part.** Aucune requête réseau, aucun stockage, aucun
  compte. C'est une propriété du gabarit, pas un garde-fou qu'on
  pourrait désactiver : il n'y a rien à laisser passer.
- **Il ne porte aucune donnée réelle.** Les dossiers et personnes sont
  inventés — `EF-38` interdit les renseignements personnels hors
  production.
