---
description: Montre les écrans qui existent déjà dans l'application, la direction que suit le produit, et les formes qui ont été essayées puis écartées.
---

**Répondez toujours en français**, quelle que soit la langue de ce que la
personne écrit. Si elle colle un extrait en anglais, ou vous parle en
anglais, votre réponse reste en français — c'est la langue de travail du
client, pas une déduction à faire à chaque message. Les écrans que vous
composez sont en français eux aussi.

Montrez ce qui existe déjà, **avant** de composer quoi que ce soit.

La liste se lit dans `${CLAUDE_PLUGIN_ROOT}/donnees/interfaces.json`.

Présentez-la en **trois blocs séparés**, jamais en une seule liste — la
distinction est tout l'intérêt :

**① Ce qui existe déjà dans votre application** (`livrees`)
Les écrans livrés et fonctionnels. Donnez leur nom, leur adresse, **et le
fichier à ouvrir pour le voir** (`ou`). Dites clairement : *« si l'un
d'eux s'approche de ce que vous voulez, partons de lui plutôt que d'en
dessiner un nouveau. »*

**② La forme que suit le produit** (`direction_retenue`)
⚠️ Elle n'est **ni livrée ni écartée**. C'est la référence dont tous les
écrans partent. Ne la rangez pas avec les précédentes : la personne
croirait disposer d'un écran qui n'existe pas encore.

**③ Ce qui a été essayé puis écarté** (`explorees_et_ecartees`)
Avec **le verdict de chacune**, tel qu'il est écrit. Ce bloc évite de
redemander une forme déjà arbitrée.

⛔ **Ne proposez jamais de composer à partir d'une forme écartée.** Ce
serait un écran que personne ne construira. Si la personne en veut une,
c'est une demande de changement — pas une composition.

## Les écrans livrés S'OUVRENT — et voici ce qu'il faut en dire

Chaque écran livré a sa **copie consultable**, dont le chemin est dans
`ou`. Proposez-la : *« voici à quoi il ressemble aujourd'hui. »*

⛔ **Et dites toujours les trois réserves, jamais une seule.** Une copie
présentée sans elles se fait prendre pour une capture de SON
application, avec SES dossiers — et il validerait une image qui n'est pas
la sienne. C'est exactement le défaut que cette liste existe pour fermer :

1. **ce ne sont pas ses données** — les dossiers et les personnes
   affichés viennent d'un jeu d'essai, aucune de ces personnes n'existe ;
2. **rien n'est cliquable**, sauf le passage d'un écran à l'autre ;
3. **c'est un instantané** — l'extension ne peut pas savoir si
   l'application a changé depuis.

Les trois sont déjà écrites en tête de chaque fichier : vous les répétez,
vous ne les remplacez pas.

**Les formes explorées s'ouvrent aussi** : ce sont des fichiers
autonomes. Leur chemin est dans `ou`.

## Puis enchaînez

Demandez : *« l'un de ces écrans s'approche-t-il de ce que vous
cherchez ? »*

- **Oui** → composez **à partir de lui** : la demande portera l'écran de
  départ, et l'équipe saura quoi modifier au lieu de deviner.
- **Non** → composez normalement avec `/nouvel-ecran`.

Si on vous demande d'où vient cette liste, lisez
`${CLAUDE_PLUGIN_ROOT}/donnees/PROVENANCE-INTERFACES.md`.
