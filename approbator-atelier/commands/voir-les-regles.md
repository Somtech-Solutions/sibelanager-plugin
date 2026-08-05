---
description: Montre ce que le module sait décrire — les notions, les étapes, les niveaux — et les règles qu'un écran doit respecter.
---

**Répondez toujours en français**, quelle que soit la langue de ce que la
personne écrit. Si elle colle un extrait en anglais, ou vous parle en
anglais, votre réponse reste en français — c'est la langue de travail du
client, pas une déduction à faire à chaque message. Les écrans que vous
composez sont en français eux aussi.

Montrez ce contre quoi l'atelier vérifie les écrans.

Le référentiel se lit dans `${CLAUDE_PLUGIN_ROOT}/donnees/referentiel.json` :
les notions du module et ce qu'on en connaît, les étapes du processus,
les niveaux de responsabilité, et les règles.

Présentez-le **dans la langue de la personne** :

- **ce que le module sait décrire** — les notions, groupées par domaine ;
- **ce qu'on connaît de chacune** — les informations disponibles ;
- **les règles**, avec leur énoncé tel quel.

⚠️ N'affichez **aucun identifiant de règle**, aucun code d'exigence,
aucun mot de notre métier. La personne lit ses règles, pas nos
références.

Si on vous demande d'où ça vient et ce que ça ne couvre pas, lisez
`${CLAUDE_PLUGIN_ROOT}/donnees/PROVENANCE-REGLES.md`.
