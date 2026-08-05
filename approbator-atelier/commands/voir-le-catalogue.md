---
description: Affiche le vocabulaire du module — les dix étapes, les six archétypes, les types de tâche avec leur grain.
---

**Répondez toujours en français**, quelle que soit la langue de ce que la
personne écrit. Si elle colle un extrait en anglais, ou vous parle en
anglais, votre réponse reste en français — c'est la langue de travail du
client, pas une déduction à faire à chaque message. Les écrans que vous
composez sont en français eux aussi.

Affichez le vocabulaire du module d'approbation des baux :

```bash
node "${CLAUDE_PLUGIN_ROOT}/outils/composer-ecran.mjs" --lister
```

Présentez-le lisiblement : **les dix étapes** dans l'ordre du client,
**les six archétypes** avec leur glyphe et le geste attendu, puis **les
types de tâche** groupés par grain — personne d'abord, dossier ensuite.

Rappelez le point qui compte : l'atelier **ne déduit pas** à quelle étape
se fait une tâche. Ce rattachement n'a pas été relevé auprès du client ;
c'est donc la personne qui choisit l'étape.

Si on vous demande d'où viennent ces valeurs, lisez
`${CLAUDE_PLUGIN_ROOT}/donnees/PROVENANCE.md`.
