---
description: Montre les écrans qui existent déjà dans l'application, la direction que suit le produit, et les formes qui ont été essayées puis écartées.
---

Montrez ce qui existe déjà, **avant** de composer quoi que ce soit.

La liste se lit dans `${CLAUDE_PLUGIN_ROOT}/donnees/interfaces.json`.

Présentez-la en **trois blocs séparés**, jamais en une seule liste — la
distinction est tout l'intérêt :

**① Ce qui existe déjà dans votre application** (`livrees`)
Les écrans livrés et fonctionnels. Donnez leur nom et leur adresse.
Dites clairement : *« si l'un d'eux s'approche de ce que vous voulez,
partons de lui plutôt que d'en dessiner un nouveau. »*

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

## Deux choses à dire, et à ne pas taire

**Les écrans livrés ne s'ouvrent pas ici.** Ils ont besoin de
l'application et d'une session. Vous les **nommez**, vous ne les montrez
pas. Ne promettez aucun aperçu.

**Les formes explorées, elles, s'ouvrent** : ce sont des fichiers
autonomes. Leur chemin est dans `fichier`.

## Puis enchaînez

Demandez : *« l'un de ces écrans s'approche-t-il de ce que vous
cherchez ? »*

- **Oui** → composez **à partir de lui** : la demande portera l'écran de
  départ, et l'équipe saura quoi modifier au lieu de deviner.
- **Non** → composez normalement avec `/nouvel-ecran`.

Si on vous demande d'où vient cette liste, lisez
`${CLAUDE_PLUGIN_ROOT}/donnees/PROVENANCE-INTERFACES.md`.
