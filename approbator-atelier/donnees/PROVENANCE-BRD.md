# Provenance du BRD dans l'atelier

> ⚠️ **Fichier écrit par `scripts/derive-brd-atelier.mjs`.** Rien ici n'est saisi à la main.

## D'où vient ce que l'atelier sait du BRD

| | |
|---|---|
| Document | `/business-requirements/approbation-baux/BRD.md` (Somcraft) |
| Identifiant | `85c52610-6b5d-4440-b705-59943f031a9b` |
| **Version qui fait foi** | **`v1.4.0`**, lue au **§8 Changelog** |
| Empreinte de la copie | `d0fb2a31f15ad4aafae1ca084a7346213710b967afc1f389b186c3c8fb461d0d` |
| Copie dans le dépôt | `business-requirements/approbation-baux/BRD.md` |
| Dérivé le | 2026-08-03 (révision `b2bf8e9`) |

> ⚠️ **Divergence de version, relevée et non masquée.** Le front-matter porte « v1.0.0 », le §8 Changelog porte « v1.4.0 ». Le BRD tranche lui-même : c'est le §8 qui fait foi. Divergence relevée, jamais masquée.

## Pourquoi la source est copiée dans le dépôt

Le BRD vit dans Somcraft, **derrière une clé**. Un validateur qui ne peut pas
lire sa source **se tait**, et son silence passe pour un accord.

En rapatriant la source, la dérivation devient **hors ligne** : le contrôle de CI
re-dérive et compare **sans aucune clé**. La clé ne sert plus qu'à une seule
chose — savoir si le BRD a **bougé** (`npm run verify:brd-peremption`).

La copie n'est écrite que par `scripts/rapatrier-brd.mjs`. Son empreinte est le
**sha256 de son contenu**, et c'est exactement ce que Somcraft rend comme
`fingerprint` : le même octet des deux côtés de la clé.

## Ce qui est RÉELLEMENT opposé au client

> ⚠️ Le tableau suivant dit ce qui est **dérivé**. Ce n'est pas la même chose que ce
> qui est **attrapé** — une revue a montré que les deux divergeaient. Ce bloc-ci dit
> la **mesure**, et il est re-mesuré à chaque exécution de
> `scripts/eprouver-harnais-brd.mjs`, branché au gate de PR : une déclaration qui
> deviendrait fausse **fait rougir la chaîne**.

| Ce qui est opposé | Par quelle voie | État |
|---|---|---|
| La règle opposable du §0 | la **prose** du client — relation d'ordre · marqueur en tête · verbe de réordonnancement | **vif** |
| La règle opposable du §0 | un **ordre d'étapes structuré** | ⚠️ **dormant — aucun appelant** ne construit ce champ dans le greffon |
| La portée V1 / V1.1 / V2 | la **prose** du client, par un vocabulaire dérivé de chaque énoncé | **vif** |

Mesuré sur un corpus de **22 formulations, dans les deux sens** : 10 façons de demander
le déplacement de la signature, 12 demandes légitimes — dont quatre portant « signe » à
l'intérieur d'un autre mot (`consigner`, `désigner`, `assigner`, `désignation`).

### Ce qui n'est PAS couvert

- Les **8 exigences de la V1 sans aucune règle** dans l'ontologie (`EF-10` `EF-24`
  `EF-29` `EF-37` `EF-46` `EF-48` `EF-49` `EF-55`). Ce lot leur donne leur **portée**,
  pas de règle : les combler relève de l'ontologie, pas du BRD.
- Les demandes exprimées autrement qu'en **français courant** : le vocabulaire est
  lexical, pas sémantique.

## Ce que l'atelier y gagne

| Ce qui entre | Combien | Ce que ça rend opposable |
|---|---|---|
| Exigences | 58 | ce qui est demandé, et **pour quelle version** |
| — dont hors V1 | 17 | un écran de V2 n'est plus composé en silence |
| Règles d'affaires (§5) | 6 | les règles nommées du module |
| **Règles opposables (§0)** | **1** | **la signature ne se déplace pas** |
| Étapes du processus | 10 | le rang qui donne son mordant à la règle opposable |

### OPP-01 — cet ordre est une INTENTION du client. On ne le « corrige » pas.

> Aucune story, aucune maquette, aucun catalogue d'étapes ne déplace la signature après Validation 1 ou Validation 2.

**Dans les mots du client** : Le candidat, lui, a signé dès l'étape ②. C'est un choix assumé : signer tôt engage le candidat (il a aussi payé son enquête), au prix d'un peu d'insatisfaction quand SIB refuse ensuite.

Prédicat éprouvé : **En attente de signature** (rang 3) reste avant **Validation 1** (rang 4) et **Validation 2** (rang 5).

---

*Dérivé de `/business-requirements/approbation-baux/BRD.md` — P-20260728-0002 · T-20260803-0070.*
