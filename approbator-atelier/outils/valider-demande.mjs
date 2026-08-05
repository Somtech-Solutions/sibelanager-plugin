#!/usr/bin/env node
/* =====================================================================
   VALIDER UNE DEMANDE D'ÉCRAN
   Extension `approbator-atelier` · Société Immobilière Bélanger

   ---------------------------------------------------------------------
   L'INVERSION
   ---------------------------------------------------------------------
   L'atelier n'interdit plus. Il COMPOSE ce qu'on lui demande, et confronte
   la demande au référentiel. Trois verdicts, pas deux :

     conforme  → on compose, rien à signaler
     dépasse   → on NOMME la règle dans les mots du client, on demande
                 s'il veut le faire quand même, ET ON NE COMPOSE RIEN
     confirmé  → on compose, on marque l'écran HORS CADRE, et une demande
                 de changement part vers l'équipe

   Le troisième cas est le cœur : un refus se contourne ou décourage, une
   demande CAPITALISE.

   ---------------------------------------------------------------------
   ⚠️ CE VALIDATEUR NE DOIT PAS ÊTRE VRAI PAR CONSTRUCTION
   ---------------------------------------------------------------------
   Il compare la demande AU RÉFÉRENTIEL — dérivé de l'ontologie et de la
   migration — jamais à ce que le composeur produit. S'il comparait la
   demande à la sortie de l'atelier, il serait TOUJOURS d'accord : c'est
   exactement le trou de filet trouvé en revue sur `T-20260803-0001`, où
   six mutations sont passées en vert parce que le contrôle interrogeait
   le fichier qu'il venait d'écrire.

   Le harnais du dépôt en fait la preuve : `verifier-atelier.mjs` lui
   soumet des demandes fabriquées qui enfreignent chacune une règle
   distincte, et exige qu'il les attrape TOUTES et qu'il soit SILENCIEUX
   sur une demande conforme.

   ---------------------------------------------------------------------
   USAGE
   ---------------------------------------------------------------------
     node valider-demande.mjs --demande <chemin.json>
     node valider-demande.mjs --demande - < demande.json

   Sortie : un rapport JSON sur la sortie standard.
   Code    : 0 = conforme · 3 = dépasse (ce n'est pas une erreur) · 1 = demande illisible
   ===================================================================== */

import { readFileSync, realpathSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/* La couche BRD — portée V1/V1.1/V2 et règles d'affaires opposables.
   Livrée par #45, branchée ici : sans cet appel elle ne garantit rien. */
import { validerContreBrd } from './valider-contre-brd.mjs';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE_PLUGIN = process.env.CLAUDE_PLUGIN_ROOT
  ? resolve(process.env.CLAUDE_PLUGIN_ROOT)
  : resolve(ICI, '..');

export const REFERENTIEL = JSON.parse(
  readFileSync(join(RACINE_PLUGIN, 'donnees', 'referentiel.json'), 'utf8'));

/* ═══════════════════════════════════════════════════════════════════════
   LA FORME D'UNE DEMANDE
   ═══════════════════════════════════════════════════════════════════════
   {
     "intention": "…",              ce que le client veut, dans SES mots
     "forme": "file|tableau|fiche|tableau-de-bord|…",
     "etape": "validation-1",       optionnel
     "niveau": "base",              optionnel
     "elements": [                  ce que l'écran montre
       { "concept": "Dossier", "attributs": ["numero_bail", "statut"] }
     ],
     "taches": ["identite"],        optionnel
     "gestes": ["supprimer"]        optionnel — ce que l'écran permet DE FAIRE
   }
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Les gestes que l'écran offre, et les règles qu'ils peuvent heurter ──
   ⚠️ Ce n'est PAS une liste d'interdits. C'est une table de correspondance
   entre un geste et le VOCABULAIRE des règles : elle sert à retrouver,
   dans les règles du référentiel, celles qui parlent de ce geste. Ce
   sont ces règles-là — extraites de l'ontologie, jamais réécrites ici —
   qui décident. */
const VOCABULAIRE_DES_GESTES = {
  supprimer: ['supprim', 'efface', 'détrui', 'purge', 'retir', 'enlev', 'elimin'],
  modifier: ['modifi', 'change', 'corrig', 'rectifi', 'édit', 'met à jour'],
  creer: ['créat', 'crée', 'génère', 'naît', 'ajout', 'nouveau'],
  exporter: ['export', 'sort', 'transmet', 'télécharg', 'envoi'],
  /* ⚠️ CES DEUX-LÀ PORTAIENT UNE LISTE VIDE, ET C'ÉTAIT UNE AFFIRMATION
     QUE RIEN NE MESURAIT : « lire et confirmer ne heurtent aucune règle ».
     12 règles du module en parlent — dont « un refus exige DEUX PERSONNES
     DISTINCTES » et « l'humain confirme, jamais d'auto-refus ». Et
     confirmer est le geste LE PLUS FRÉQUENT du produit : un écran pour
     approuver passait donc en silence.

     C'est le même défaut que celui corrigé pour les gestes inconnus, un
     cran plus profond : on avait appris à dire « je ne sais pas » sur ce
     qu'on ne connaît pas, et on continuait d'affirmer sur ce qu'on
     croyait connaître. On mesure maintenant, comme les autres. */
  consulter: ['consult', 'lect', 'affich', 'visualis'],
  confirmer: ['confirm', 'valid', 'approb', 'approuv', 'contresign'],
};

/* ⚠️ LES SYNONYMES QUE L'AGENT ÉCRIRA. C'est lui qui traduit le français
   du client en JSON : « je veux pouvoir effacer un utilisateur » devient
   le mot qui lui vient, pas forcément la clé canonique. On ramène donc
   les formes voisines sur leur clé, avant de juger. */
const SYNONYMES = {
  supprimer: ['effacer', 'retirer', 'enlever', 'detruire', 'purger', 'eliminer', 'supression'],
  modifier: ['editer', 'changer', 'corriger', 'rectifier', 'mettre a jour', 'update'],
  creer: ['ajouter', 'nouveau', 'generer', 'creation'],
  exporter: ['telecharger', 'envoyer', 'extraire', 'sortir'],
  consulter: ['lire', 'voir', 'afficher', 'consultation', 'visualiser'],
  confirmer: ['valider', 'approuver', 'cocher'],
};

/* Ramène un geste écrit librement sur sa clé canonique. Casse, accents et
   espaces sont normalisés — « Supprimer », « supprimer » et « effacer »
   tombent tous sur `supprimer`. Rend `null` si on ne reconnaît pas : ce
   cas-là se DIT, il ne se valide pas. */
function clefDuGeste(brut) {
  const g = sansAccent(String(brut).trim()).replace(/\s+/g, ' ');
  if (!g) return null;
  if (Object.hasOwn(VOCABULAIRE_DES_GESTES, g)) return g;
  for (const [clef, formes] of Object.entries(SYNONYMES)) {
    if (sansAccent(clef) === g || formes.some((f) => sansAccent(f) === g)) return clef;
  }
  return null;
}

const sansAccent = (s) => String(s ?? '').normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLowerCase();

/* ═══════════════════════════════════════════════════════════════════════
   LA VALIDATION
   ═══════════════════════════════════════════════════════════════════════ */
export function validerDemande(demande) {
  const depassements = [];

  const ajouter = (quoi, pourquoi, regle) => {
    depassements.push({
      // ⚠️ Ce que le client LIT. Aucun identifiant, aucun code, aucun
      // mot de notre métier — le harnais le vérifie.
      quoi, pourquoi,
      // Ce que l'équipe lit dans la demande de changement, à part.
      trace: regle
        ? { regle: regle.id, concept: regle.concept,
            exigences: regle.exigences, regles_affaires: regle.regles_affaires }
        : null,
    });
  };

  /* ── 1. La forme demandée ─────────────────────────────────────────────
     Une forme non outillée n'est PAS interdite : elle est « pas encore
     outillée ». La nuance décide du ton, et la demande part quand même. */
  const forme = demande.forme;
  if (forme && !REFERENTIEL.formes_outillees.some((f) => f.code === forme)) {
    ajouter(
      `L'atelier ne sait pas encore composer un écran de type « ${forme} ».`,
      'Il sait faire : ' +
        REFERENTIEL.formes_outillees.map((f) => `${f.nom.toLowerCase()} (${f.aide})`).join(' · ') +
        ". Ce n'est pas une règle du module — c'est l'atelier qui n'a pas encore cet outil.",
      null);
  }

  /* ── 2. Les étapes ───────────────────────────────────────────────────── */
  if (demande.etape) {
    const e = REFERENTIEL.grains_du_catalogue.etapes.find((x) => x.code === demande.etape);
    if (!e) {
      ajouter(
        `« ${demande.etape} » ne fait pas partie de vos étapes.`,
        'Votre processus en compte ' + REFERENTIEL.grains_du_catalogue.etapes.length + ' : ' +
          REFERENTIEL.grains_du_catalogue.etapes.map((x) => x.libelle).join(' · ') + '.',
        null);
    } else if (e.hors_v1) {
      ajouter(
        `L'étape « ${e.libelle} » ne fait pas partie de la première version.`,
        'Elle existe dans votre processus, mais aucun dossier n\'y passe pour l\'instant : ' +
          'un écran pour cette étape serait vide en pratique.',
        null);
    }
  }

  /* ── 3. Le niveau ────────────────────────────────────────────────────── */
  if (demande.niveau && !REFERENTIEL.grains_du_catalogue.niveaux.includes(demande.niveau)) {
    ajouter(
      `« ${demande.niveau} » n'est pas un des niveaux de responsabilité.`,
      'Il y en a ' + REFERENTIEL.grains_du_catalogue.niveaux.length + ' : ' +
        REFERENTIEL.grains_du_catalogue.niveaux.join(' · ') + '.',
      regleQuiParleDe(['niveau de responsabilité']));
  }

  /* ── 4. Les concepts et leurs attributs ──────────────────────────────── */
  for (const el of demande.elements ?? []) {
    const c = REFERENTIEL.concepts.find((x) => x.id === el.concept);
    if (!c) {
      ajouter(
        `« ${el.concept} » n'est pas une notion que le module connaît.`,
        'Ce que le module sait décrire : ' +
          REFERENTIEL.concepts.filter((x) => x.materialise).slice(0, 12)
            .map((x) => x.nom).join(' · ') + '…',
        null);
      continue;
    }
    /* ⚠️ 13 concepts sur 33 n'ont aucun attribut relevé. La garde
       « seulement si on en connaît » était défendable, mais MUETTE : elle
       rendait un accord là où elle ne pouvait rien vérifier. Elle le dit
       maintenant — même principe que pour les gestes. */
    if ((el.attributs ?? []).length > 0 && c.attributs.length === 0) {
      ajouter(
        `Je ne sais pas quelles informations « ${c.nom} » porte.`,
        'Cette notion existe dans le module, mais le détail de ce qu\'on en ' +
        'connaît n\'a pas encore été relevé. Je ne peux donc pas vérifier ' +
        `« ${(el.attributs ?? []).join(' · ')} » — je préfère vous le dire.`,
        null);
    } else {
      for (const a of el.attributs ?? []) {
        if (!c.attributs.includes(a)) {
          ajouter(
            `« ${c.nom} » ne porte pas l'information « ${a} ».`,
            `Ce qu'on en connaît : ${c.attributs.join(' · ')}.`,
            null);
        }
      }
    }
  }

  /* ── 4bis. Ce que l'atelier ne sait composer QU'EN PARTIE ─────────────
     ⚠️ Le lot promet « conforme → il compose ». Il composait en réalité
     PARTIELLEMENT en déclarant conforme : deux concepts demandés, un seul
     rendu, et le client ne l'apprenait jamais. Obtenir moins que ce qu'on
     a demandé sans qu'on vous le dise, c'est la même faute que valider un
     geste qu'on ne sait pas juger. */
  const formeDemandee = demande.forme ?? 'file';
  if ((demande.elements ?? []).length > 1) {
    ajouter(
      `Je ne sais montrer qu'une notion à la fois sur un écran.`,
      `Vous en avez demandé ${demande.elements.length} : ` +
        demande.elements.map((e) => e.concept).join(' · ') +
        `. Je composerais « ${demande.elements[0].concept} » seulement. ` +
        "Ce n'est pas une règle du module — c'est l'atelier qui n'a pas encore cet outil.",
      null);
  }
  if (formeDemandee === 'file' && (demande.elements ?? []).length > 0) {
    ajouter(
      'Sur une file de travail, je ne sais pas choisir les colonnes.',
      'Une file montre les tâches à traiter, avec le geste attendu — sa mise en ' +
        'page est fixe. Pour choisir ce qui s\'affiche, demandez un tableau. ' +
        "Ce n'est pas une règle du module — c'est l'atelier qui n'a pas encore cet outil.",
      null);
  }

  /* ── 5. Les tâches ───────────────────────────────────────────────────── */
  for (const t of demande.taches ?? []) {
    if (!REFERENTIEL.grains_du_catalogue.types_de_tache.includes(t)) {
      ajouter(
        `« ${t} » n'est pas une des tâches du processus.`,
        `Il y en a ${REFERENTIEL.grains_du_catalogue.types_de_tache.length}, ` +
        'de la vérification d\'identité à l\'approbation finale.',
        null);
    }
  }

  /* ── 6. Les gestes, confrontés aux RÈGLES ────────────────────────────
     C'est ici que l'ontologie mord vraiment : on ne juge pas le geste sur
     une liste écrite à la main, on cherche la règle qui en parle. */
  /* ⚠️ UN GESTE QU'ON NE SAIT PAS JUGER SE DIT — IL NE SE VALIDE PAS.
     C'est le mode d'échec que ce lot prétend fermer, et il était revenu
     ici : un geste absent de la table repartait « conforme », donc le
     silence passait pour un accord. Six formulations voisines de gestes
     réellement bloquants passaient à tort.

     Le principe vaut pour tout ce fichier : quand le validateur ne peut
     pas conclure, il le DIT. Ne rien dire est une réponse, et c'est la
     plus dangereuse. */
  for (const g of demande.gestes ?? []) {
    const clef = clefDuGeste(g);

    if (!clef) {
      ajouter(
        `Je ne sais pas vérifier le geste « ${g} ».`,
        'Je sais juger : ' +
          Object.keys(VOCABULAIRE_DES_GESTES).join(' · ') +
          ". Comme je ne peux pas garantir que « " + g + " » respecte les règles " +
          "du module, je préfère vous le dire plutôt que de laisser passer.",
        null);
      continue;
    }

    const mots = VOCABULAIRE_DES_GESTES[clef];
    if (mots.length === 0) continue;   // geste reconnu, sans effet d'écriture

    /* ⚠️ Un geste SANS élément visé était ignoré : la boucle était
       imbriquée dans celle des éléments. On juge alors contre TOUTES les
       règles — s'il n'a pas dit sur quoi, on ne peut pas restreindre. */
    const cibles = (demande.elements ?? []).length > 0
      ? demande.elements.map((el) => el.concept)
      : [null];

    for (const concept of cibles) {
      const regle = regleQuiParleDe(mots, concept);
      if (regle) {
        /* ⚠️ « ENCADRE », pas « va contre ». Le validateur retrouve une
           règle qui parle de ce geste — il ne sait PAS si elle l'interdit
           ou l'exige, et le prétendre serait affirmer sans mesurer.
           Il la MONTRE ; c'est le client qui juge, la règle sous les yeux.
           Un faux visible vaut mieux qu'un faux crédible. */
        ajouter(
          `Une règle du module encadre ce que vous demandez pour « ${regle.concept_nom} ».`,
          `La règle dit : « ${regle.enonce} » — vérifiez que votre écran la respecte.`,
          regle);
      }
    }
  }

  /* ═══════════════════════════════════════════════════════════════════
     LA COUCHE BRD — branchée ici, pas « plus tard »
     ═══════════════════════════════════════════════════════════════════
     ⚠️ Une couche livrée que personne n'appelle, c'est la famille des
     harnais qui ne tournent dans aucune chaîne : elle a l'air d'exister
     et ne garantit rien. Le geste est donc fait au moment où les deux
     moitiés se rencontrent.

     Ce que l'ontologie ne peut pas voir, le BRD le voit : la PORTÉE
     (V1 · V1.1 · V2) et les règles d'affaires opposables. Trois écrans
     hors périmètre passaient conformes ici — une cession de bail, un
     tableau de bord du dépôt, un écran déplaçant la signature après la
     validation 2.

     Les deux listes ont la MÊME FORME, délibérément (`quoi` · `pourquoi`
     · `trace`) : elles se concatènent sans traduction, et le client lit
     une seule voix. */
  const brd = validerContreBrd(demande);
  depassements.push(...brd.depassements);

  const conforme = depassements.length === 0;
  return {
    conforme,
    verdict: conforme ? 'conforme' : 'depasse',
    intention: demande.intention ?? null,
    depassements,
    /* Ce que le BRD ne sait pas trancher sans une réponse du client —
       une portée ambiguë, une exigence qui dépend d'un cas. Ce ne sont
       PAS des dépassements : on les lui pose, il répond, et la demande
       se rejoue. Les laisser tomber ici les rendrait invisibles. */
    precisions_a_lever: brd.precisions_a_lever ?? [],
    // Contexte de la mesure : sans lui, on ne peut pas dire CONTRE QUOI
    // la demande a été jugée.
    juge_contre: {
      ontologie: REFERENTIEL.ontologie.version,
      brd_relu_contre: REFERENTIEL.ontologie.brd_relu_contre,
      regles: REFERENTIEL.couverture.regles,
      referentiel_derive_le: REFERENTIEL.derive_le,
      // La couche BRD nomme sa propre source et son empreinte : sans ça,
      // « jugé contre le BRD » ne dirait pas CONTRE QUELLE VERSION.
      brd: brd.juge_contre,
    },
  };
}

/* Cherche, parmi les règles du référentiel, celle qui parle de ces mots — et du
   concept visé s'il est donné. Rend `null` si aucune : le validateur se
   TAIT plutôt que d'inventer une règle qui n'existe pas. */
function regleQuiParleDe(mots, concept = null) {
  for (const r of REFERENTIEL.regles) {
    if (concept && r.concept !== concept) continue;
    if (mots.some((m) => radicalPresent(sansAccent(r.enonce), sansAccent(m)))) return r;
  }
  return null;
}

/* ⚠️ EN DÉBUT DE MOT, PAS N'IMPORTE OÙ. `includes` trouvait « edit » dans
   « expéditeur » : le validateur citait « Chaque message identifie son
   expéditeur » à quelqu'un qui demandait un écran de modification. Accuser
   à tort fait défaire du travail juste — c'est plus grave que se taire.

   Le radical reste un PRÉFIXE ouvert à droite (`supprim` doit trouver
   « supprimant », « suppression »), mais il doit commencer un mot. */
function radicalPresent(texte, radical) {
  if (!radical) return false;
  const echappe = radical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\p{L}\\p{N}])${echappe}`, 'u').test(texte);
}

/* ═══════════════════════════════════════════════════════════════════════
   LIGNE DE COMMANDE
   ═══════════════════════════════════════════════════════════════════════ */
/* ⚠️ `realpathSync`, pas `resolve` : `resolve()` normalise mais NE RÉSOUT
   PAS les liens symboliques, alors qu'`import.meta.url` porte le chemin
   réel. Lancé derrière un lien — une place de marché locale, une install
   de développement — la garde était fausse, le bloc ne s'exécutait pas,
   et le programme sortait `0`. Or `0` signifie CONFORME dans le contrat
   de sortie : le pire mode d'échec possible, un silence qui vaut accord. */
const memeFichier = (a, b) => {
  try { return realpathSync(a) === realpathSync(b); }
  catch { return resolve(a) === resolve(b); }
};
if (process.argv[1] && memeFichier(process.argv[1], fileURLToPath(import.meta.url))) {
  const i = process.argv.indexOf('--demande');
  if (i === -1 || !process.argv[i + 1]) {
    console.error('\n⛔ Usage : node valider-demande.mjs --demande <chemin.json|->\n');
    process.exit(1);
  }
  const chemin = process.argv[i + 1];
  let brut;
  try {
    brut = chemin === '-' ? readFileSync(0, 'utf8') : readFileSync(resolve(chemin), 'utf8');
  } catch (e) {
    console.error(`\n⛔ Demande illisible : ${e.message}\n`);
    process.exit(1);
  }
  let demande;
  try { demande = JSON.parse(brut); } catch (e) {
    console.error(`\n⛔ La demande n'est pas un JSON valide : ${e.message}\n`);
    process.exit(1);
  }
  const rapport = validerDemande(demande);
  console.log(JSON.stringify(rapport, null, 2));
  process.exit(rapport.conforme ? 0 : 3);
}
