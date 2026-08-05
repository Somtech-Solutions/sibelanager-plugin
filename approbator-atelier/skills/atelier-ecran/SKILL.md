---
name: atelier-ecran
description: Compose les écrans du module d'approbation des baux de la Société Immobilière Bélanger — une file de travail, un tableau, une fiche, un tableau de bord, ou autre chose. À utiliser quand quelqu'un dit « je veux un écran qui… », « montre-moi un tableau des dossiers », « je voudrais voir ce qui attend à la validation 1 », « fais-moi une vue de… », « j'aimerais un écran pour suivre… », ou décrit en français n'importe quel écran qu'il aimerait avoir. Compose ce qui est demandé, puis vérifie que ça respecte les règles du module — et si ça les dépasse, le dit et demande quoi faire.
---

# Composer les écrans du client

**Vous ne refusez rien.** Le client décrit l'écran qu'il veut ; vous le
composez. C'est ensuite que vous vérifiez, et le résultat n'a que trois
issues possibles.

## Le principe, en une phrase

> On n'obtient pas la conformité en interdisant. **On autorise, on valide,
> et ce qui dépasse devient une demande.**

Un refus se contourne ou décourage. Une demande **capitalise** : elle
transforme ce que le client bricole en information utile pour l'équipe.

## Ce que vous faites, dans l'ordre

### 0. Regardez d'abord si ça existe déjà

**Avant de composer, ouvrez la liste des écrans existants** —
`donnees/interfaces.json`. Si ce que la personne décrit ressemble à un
écran livré, dites-le-lui et **partez de lui**.

C'est le geste qui évite le pire gaspillage de l'atelier : qu'elle
redessine ce qui existe, et que l'équipe reçoive une demande de création
là où il fallait lire une demande de modification.

⛔ **Une forme ÉCARTÉE n'est jamais un point de départ.** Voir
`references/partir-d-un-ecran-existant.md`.

### 1. Écoutez ce qu'il veut, dans ses mots

Ne le poussez pas vers un formulaire. « Je voudrais voir tous les
dossiers bloqués avec le nom du candidat » est une demande parfaitement
recevable.

### 2. Traduisez-la en demande structurée

Écrivez un fichier JSON :

```json
{
  "intention": "reprenez SA phrase, telle qu'il l'a dite",
  "depart": "/file",
  "forme": "file | tableau | fiche | tableau-de-bord",
  "etape": "validation-1",
  "niveau": "base",
  "elements": [{ "concept": "Dossier", "attributs": ["numero_bail", "statut"] }],
  "taches": ["identite"],
  "gestes": ["supprimer"]
}
```

Tous les champs sont optionnels sauf `intention`. **`depart`** nomme
l'écran existant dont on part, quand il y en a un — c'est lui qui
transforme une demande de création en demande de modification. **`gestes`** dit ce que
l'écran permettrait de *faire* — c'est souvent là que se joue le
dépassement.

Pour savoir quels concepts et attributs existent :

```bash
node "${CLAUDE_PLUGIN_ROOT}/outils/valider-demande.mjs" --demande - <<< '{"forme":"?"}'
```

### 3. Composez

```bash
node "${CLAUDE_PLUGIN_ROOT}/outils/composer-libre.mjs" \
  --demande <demande>.json --sortie <écran>.html
```

### 4. Lisez le code de sortie — c'est lui qui décide de la suite

| Code | Ce que ça veut dire | Ce que vous faites |
|---|---|---|
| **0** | conforme, l'écran est composé | dites où est le fichier |
| **3** | **ça dépasse** — rien n'a été composé | voir ci-dessous |
| 1 | la demande est illisible | corrigez-la |

## 🔴 Quand ça dépasse (code 3)

**L'outil a déjà écrit ce qu'il faut dire.** Reprenez-le tel quel : la
règle y est nommée **dans les mots du client**, avec le pourquoi.

Ensuite, **posez-lui la question et attendez** :

> Voulez-vous le faire quand même ? Si oui, je compose l'écran en le
> marquant comme sortant du cadre, et je prépare une demande de
> changement pour l'équipe.

⚠️ **Ne composez rien tant qu'il n'a pas répondu.** Et ne réécrivez pas
la règle avec vos mots : celle que l'outil affiche est la règle
**opposable**, extraite telle quelle. La reformuler, c'est risquer de lui
faire dire autre chose.

**S'il dit oui** :

```bash
node "${CLAUDE_PLUGIN_ROOT}/outils/composer-libre.mjs" \
  --demande <demande>.json --sortie <écran>.html --je-veux-quand-meme
```

L'écran est composé **et marqué**, et une demande de changement est
écrite à côté. Dites-lui de la remettre à l'équipe, comme ses écrans.

**S'il dit non** : ajustez la demande avec lui et relancez.

## Ce que vous ne faites jamais

- **Vous ne contournez pas.** Si l'outil signale un dépassement, ne
  modifiez pas la demande en douce pour qu'elle passe — l'écran perdrait
  sa marque, et l'équipe ne saurait jamais que le client voulait autre
  chose.
- **Vous ne parlez pas notre langue.** Pas de code d'exigence, pas
  d'identifiant de règle, pas de « ontologie », « invariant », « BRD ».
  Le client lit sa règle, pas notre référence.
- **Vous n'inventez pas de règle.** Si l'outil ne signale rien, c'est
  conforme. Votre intuition n'est pas un référentiel.

## Pour aller plus loin

- `references/partir-d-un-ecran-existant.md` — partir de ce qui existe
  plutôt que de le redessiner
- `references/trois-verdicts.md` — le détail des trois issues
- `references/boite-de-reception.md` — l'anatomie de la file de travail
- `references/signaletique.md` — les archétypes, le grain, les niveaux
- `donnees/PROVENANCE-REGLES.md` — d'où viennent les règles, et ce
  qu'elles ne couvrent pas
