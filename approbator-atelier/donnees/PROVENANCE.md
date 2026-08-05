# D'où vient `catalogue.json`, et à quelle date

> ⛔ **Fichier dérivé.** Écrit par `scripts/derive-catalogue-atelier.mjs` du dépôt
> `sibelanger`. Toute modification à la main sera écrasée à la prochaine dérivation,
> et fera rougir `scripts/verifier-atelier.mjs`.

**Dérivé le** 2026-08-05 · **révision du dépôt** `096a600`

## Les sources lues, et ce que chacune a donné

| Grain | Source | Ce qu'elle donne |
|---|---|---|
| Les dix étapes — code, rang | `supabase/migrations/20260731032127_catalogue_du_classeur_et_garde_lue.sql` | Le bloc `insert into public.etape`. Relevé du classeur client le 2026-07-31, dix étapes numérotées par le client lui-même. |
| Les dix libellés **du client** | `docs/moteur-taches/etapes-relevees-du-classeur-client.md` | Le tableau « Ce que le classeur dit ». Libellés exacts de `MASTER Approbation des baux.xlsx`, colonne A. |
| Les six archétypes | `maquettes/donnees/catalogue-taches.js` — `SIB_ARCHETYPES` | Glyphe, libellé, part, aide. Signalétique non chromatique (EF-04). |
| Les types de tâche | `maquettes/donnees/catalogue-taches.js` — `SIB_CATALOGUE` | Grain, niveau, archétype, caractère bloquant, exigences. |
| L'habillage | `maquettes/assets/tokens.css`, `maquettes/assets/banc.css`, `maquettes/assets/logos.css` | Jetons de marque relevés du vrai site, signalétique, logos en `data:` URI. |

## Le croisement qui tient les étapes

Les deux sources d'étapes sont **croisées à chaque dérivation** : même nombre, mêmes
rangs, et libellés égaux après normalisation (minuscules, accents et ponctuation
retirés, préfixe de rang `N-` retiré). **Une divergence fait échouer la dérivation.**

C'est ce croisement qui empêche l'une des deux de se périmer en silence — le défaut
qu'un catalogue recopié à la main porte toujours.

### Les dix étapes, telles qu'elles sortent

| Rang | Code | Libellé lu par le client | Libellé du module |
|---|---|---|---|
| 1 | `reception` | 1- Validation initiale Trustii | Validation initiale (Trustii) |
| 2 | `envoi-des-documents` | 2- Envoi des documents | Envoi des documents |
| 3 | `attente-de-signature` | 3- En attente de signature | En attente de signature |
| 4 | `validation-1` | 4- Validation 1 | Validation 1 |
| 5 | `validation-2` | 5- Validation 2 | Validation 2 |
| 6 | `endosseur-ou-depot` | 6- Endosseur ou Dépôt | Endosseur ou dépôt |
| 7 | `validation-du-dpa` | 7- Validation du DPA | Validation du DPA |
| 8 | `paiement-1er-mois` | 8- Paiement du 1er mois | Paiement du 1er mois |
| 9 | `approbation-finale` | 9- Approbation Finale | Approbation finale |
| 10 | `refus-du-dossier` | 10- Refus du dossier | Refus du dossier |

## Ce qui n'a **pas** été repris, et pourquoi

- **`maquettes/donnees/etapes.config.js`** — huit libellés neutres « Étape 1 » …
  « Étape 8 ». Le fichier est gardé sous cette forme parce que deux harnais l'épinglent,
  et il porte lui-même l'avertissement de ne pas s'y brancher. **L'atelier ne le lit pas.**

- **Le champ `etape` de `SIB_CATALOGUE`** — son rattachement tâche → étape
  **n'est pas fondé** (`T-20260803-0019`) : il pointe vers les huit identifiants opaques
  ci-dessus, et place des tâches sur des étapes qui ne les connaissent pas
  (« Décider la préqualification », « Approbation finale »). Il est recopié dans
  `catalogue.json` sous le nom **`etape_fixture_non_fondee`**, avec son motif, et
  **l'atelier a interdiction de s'en servir pour placer une tâche**. Le client choisit
  l'étape parmi les dix ; l'atelier n'en déduit aucune.

## Les versions déclarées par les sources, le jour de la dérivation

- **BRD du module Approbator** — trois valeurs coexistent : le pointeur ServiceDesk dit
  **1.3.0** (posé le 2026-07-31), le brief du lot dit **1.4.0**, l'entête du document
  Somcraft dit **v1.0.0**. Aucune n'a été retenue comme faisant foi : le catalogue ne
  dérive pas du BRD, il en cite seulement les codes d'exigence portés par
  `SIB_CATALOGUE`. **Un connecteur qui servirait « le BRD courant » devrait nommer sa
  source** (exigence O-4).

- **Ontologie du module** — le pointeur ServiceDesk est vide, et la passe `0.2.0` est
  délibérément non commencée (`T-20260731-0028`). Elle n'est donc pas une source de
  cette dérivation. Elle s'y ajoutera quand elle sera publiée.
