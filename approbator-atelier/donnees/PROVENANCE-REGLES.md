# D'où viennent les règles que l'atelier vérifie

> ⛔ **Fichier dérivé.** Écrit par `scripts/derive-referentiel-atelier.mjs`.
> Toute modification à la main sera écrasée à la prochaine dérivation, et fera
> rougir `scripts/verifier-atelier.mjs`.

**Dérivé le** 2026-08-05 · **révision du dépôt** `76ce5f0`

## Ce que l'atelier confronte à quoi

L'atelier **ne vous interdit rien**. Il compose ce que vous demandez, et **compare
ensuite** votre demande aux règles du module. Quand elle les dépasse, il vous le
dit, vous demande si vous voulez le faire quand même, et — si vous dites oui —
compose l'écran **en le marquant** et prépare une demande pour l'équipe.

## Les sources, et ce que chacune donne

| Grain | Source | Ce qu'elle donne |
|---|---|---|
| Concepts, relations, **règles** | `ontologie/02_ontologie.yaml` — ontologie `0.2.0`, statut `draft` | 33 concepts, **99 règles** avec leur énoncé en français |
| Étapes, niveaux, tâches, archétypes | `plugins/approbator-atelier/donnees/catalogue.json` — lui-même dérivé de la migration `20260731032127` | les grains d'écran |

### Les règles sont **extraites**, jamais réécrites

Chaque règle porte l'énoncé exact de l'ontologie, celui entre guillemets. C'est
la règle **opposable** que vous lisez, pas une paraphrase qui pourrait dériver de
son original.

⚠️ **1 invariant(s) n'ont pas d'énoncé lisible** et ne sont donc pas utilisés pour vous parler. Ils existent, ils ne sont simplement pas dicibles en l'état.

### Les domaines couverts

| Code | Domaine | Concepts |
|---|---|---|
| SOC | Socle — identité, autorisation, traçabilité | 4 |
| DOS | Dossier et personnes | 3 |
| PAR | Parc et inventaire | 3 |
| TAC | Moteur de tâches | 3 |
| INT | Intrants et rapprochement | 5 |
| DOC | Documents et signature | 5 |
| COM | Communications | 4 |
| DEC | Décisions humaines | 4 |
| LOI | Conformité Loi 25 | 2 |

## ⚠️ Ce que ce référentiel NE couvre PAS

**Le BRD n'est pas lu directement.** Il vit dans Somcraft, derrière une clé : un
validateur qui prétendrait le lire ne pourrait pas tourner dans la chaîne
d'intégration, et son silence passerait pour un accord.

L'ontologie **est le pont**, et c'est un pont mesuré : sa passe `0.2.0`
l'a relue **ligne à ligne** contre le BRD **v1.4.0**,
et chaque règle cite l'exigence dont elle découle.

**Conséquence à connaître** : une exigence du BRD qu'**aucune règle de l'ontologie
ne reflète** est invisible d'ici. L'atelier ne la verra pas dépassée. C'est écrit
plutôt que passé sous silence.

**La portée déclarée de l'ontologie** — ce qui n'y est volontairement pas :

> Périmètre V1 du BRD : le chemin « demande de location ». Les concepts qui n'apparaissent qu'en V1.1 ou V2 (cession, modification de bail, endosseur, dépôt, paiement) ne sont PAS modélisés ici — les inventer maintenant reviendrait à décrire un produit qui n'a pas été spécifié.
