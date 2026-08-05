#!/usr/bin/env node
/* =====================================================================
   VALIDER UNE DEMANDE CONTRE LE BRD
   Extension `approbator-atelier` · Société Immobilière Bélanger
   P-20260728-0002 · T-20260803-0070

   ---------------------------------------------------------------------
   CE QUE CETTE COUCHE AJOUTE, ET POURQUOI ELLE NE POUVAIT PAS MANQUER
   ---------------------------------------------------------------------
   L'atelier confronte déjà les demandes aux règles dérivées de
   l'ONTOLOGIE. L'ontologie dit de quoi on parle. Le BRD dit ce qu'on doit
   faire, POUR QUELLE VERSION, et ce qu'on ne « corrige » pas.

   Trois demandes réelles, soumises au validateur d'ontologie seul, ont
   rendu « conforme » — mesuré, pas supposé :

     · un écran de cession de bail            → prévu en V2
     · un écran qui déplace la signature
       après Validation 2                     → contre la règle opposable
     · un tableau de bord du dépôt de loyer   → prévu en V2

   Le client aurait obtenu ses trois écrans, et il en aurait conclu que
   c'est prévu. C'est le trou que cette couche ferme.

   ---------------------------------------------------------------------
   ⚠️ ELLE NE PEUT PAS ÊTRE VRAIE PAR CONSTRUCTION
   ---------------------------------------------------------------------
   Elle ne lit RIEN de ce que l'atelier produit. Elle lit `donnees/brd.json`,
   dérivé de la copie du BRD par `scripts/derive-brd-atelier.mjs`, elle-même
   rapatriée de Somcraft. Si elle interrogeait la sortie du composeur, elle
   serait toujours d'accord — c'est le trou de filet trouvé sur
   `T-20260803-0001`, où six mutations sont passées en vert.

   ---------------------------------------------------------------------
   ⚠️ ZÉRO MOT DE NOTRE MÉTIER DANS CE QUE LE CLIENT LIT
   ---------------------------------------------------------------------
   Le champ `quoi` et le champ `pourquoi` sont lus PAR LE CLIENT. Aucun
   identifiant d'exigence, aucun numéro de version, aucun nom de fichier.
   L'identifiant vit dans `trace`, que seule l'équipe lit — et c'est lui
   qui rend la demande de changement exploitable.
   ===================================================================== */

import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE_PLUGIN = process.env.CLAUDE_PLUGIN_ROOT
  ? resolve(process.env.CLAUDE_PLUGIN_ROOT)
  : resolve(ICI, '..');

export const BRD = JSON.parse(
  readFileSync(join(RACINE_PLUGIN, 'donnees', 'brd.json'), 'utf8'));

/* Plier les accents plutôt que de s'y fier. Une frontière de mot (`\b`)
   collée à un caractère accentué NE MORD JAMAIS — c'est ce qui a rendu un
   contrôle de ce chantier vrai par construction. On ne s'en sert nulle
   part ici : on cherche des locutions pliées, dans du texte plié. */
const plier = (s) => String(s ?? '').normalize('NFD')
  .replace(/[̀-ͯ]/g, '').toLowerCase();

/* ═══════════════════════════════════════════════════════════════════════
   LA VALIDATION
   ═══════════════════════════════════════════════════════════════════════
   Même forme de demande que `valider-demande.mjs`, et même forme de
   dépassement — pour que les deux couches se composent sans traduction
   au moment où elles seront branchées ensemble.

     {
       "intention": "…",                 les mots du client
       "forme": "file|tableau|fiche|…",
       "etape": "validation-1",          optionnel
       "ordre_des_etapes": ["…", "…"],   optionnel — un écran de catalogue
       "elements": [ … ], "taches": [ … ], "gestes": [ … ]
     }
   ═══════════════════════════════════════════════════════════════════════ */
export function validerContreBrd(demande) {
  const depassements = [];
  /* Ce qui n'est pas un dépassement mais ne doit pas se perdre : une
     ambiguïté que seule une question au client peut lever. Voir plus bas. */
  const precisions = [];
  const ajouter = (quoi, pourquoi, trace) => depassements.push({ quoi, pourquoi, trace });

  const intention = plier(demande.intention);

  /* ── 1. LA RÈGLE OPPOSABLE — la priorité ────────────────────────────────
     Chez le client on signe TÔT, et c'est un choix d'affaires. Le BRD
     l'inscrit parce que « c'est exactement le genre de chose qu'un
     développeur bien intentionné corrige en croyant bien faire ». Elle a
     déjà produit du code faux deux fois.

     ⚠️ Le seul mot « signature » ne suffit PAS à faire un dépassement :
     trois exigences de la V1 parlent de signature, et un écran qui la
     montre est parfaitement légitime. Ce qui heurte la règle, c'est la
     RENCONTRE de trois choses — ce qui est protégé, un déplacement vers
     l'aval, et l'une des étapes d'ancrage. */
  for (const opp of BRD.regles_opposables) {
    const heurt = lireLeHeurt(intention, demande.ordre_des_etapes, opp);

    if (heurt.certitude === 'caracterise') {
      ajouter(
        `Ce que vous demandez déplace « ${opp.protege.etape.toLowerCase()} » après ` +
        `« ${heurt.ancre.toLowerCase()} », et c'est une décision d'affaires que vous avez ` +
        `déjà prise.`,
        `Chez vous on fait signer tôt, volontairement` +
        (opp.raison_client ? ` : « ${opp.raison_client} »` : '') +
        `. Ce n'est pas un défaut de séquence que l'outil viendrait réparer — ` +
        `c'est le mécanisme qui engage le candidat. Si cet ordre doit changer, ` +
        `c'est vous qui le décidez, pas la conception.`,
        {
          regle_opposable: opp.id, clause: opp.clause,
          etape_protegee: opp.protege.etape, rang_protege: opp.protege.rang,
          ancres: opp.ancres, certitude: 'caracterise',
          detecte_par: heurt.detecte_par,
        });
    } else if (heurt.certitude === 'a_lever') {
      /* ⚠️ NI SILENCE, NI REFUS — et c'est délibéré.

         Affirmer ici produirait un FAUX CRÉDIBLE : dire au client qu'il
         déplace la signature alors qu'il demande seulement à la voir. Un
         instrument qui accuse à tort fait défaire du travail juste ; celui
         qui se tait laisse chercher ailleurs. La question ne fait ni l'un
         ni l'autre.

         Elle NE FAIT PAS dépassement et n'empêche pas de composer : la
         compétence DOIT la poser au client avant de livrer l'écran. */
      precisions.push({
        question:
          `Voulez-vous simplement VOIR où en est « ${opp.protege.etape.toLowerCase()} » ` +
          `à ce moment-là, ou voulez-vous CHANGER le moment où l'on fait signer ?`,
        pourquoi_on_demande:
          `Les deux se ressemblent à l'écrit et n'ont rien à voir. Voir, c'est ` +
          `immédiat. Changer le moment de la signature, ce serait revenir sur une ` +
          `décision que vous avez prise volontairement` +
          (opp.raison_client ? ` : « ${opp.raison_client} »` : '') + `.`,
        trace: {
          regle_opposable: opp.id, clause: opp.clause,
          certitude: 'a_lever', detecte_par: heurt.detecte_par,
        },
      });
    }
  }

  /* ── 2. LA PORTÉE — ce que le BRD reporte à plus tard ───────────────────
     Une exigence hors V1 n'est PAS interdite : elle est « pas encore ». La
     nuance décide du ton, et la demande de changement part quand même —
     c'est elle qui capitalise. */
  for (const ex of BRD.exigences) {
    if (!ex.hors_v1) continue;
    const terme = ex.vocabulaire.find((t) => intention.includes(plier(t)));
    if (!terme) continue;
    ajouter(
      `« ${terme} », ce n'est pas prévu dans la première version de votre outil.`,
      `C'est bien au programme` + quand(ex.portees) + `, et c'est écrit dans ` +
      `ce qui a été convenu pour votre module. Un écran construit aujourd'hui ` +
      `resterait vide : rien derrière ne sait encore le remplir.`,
      { exigence: ex.id, portees: ex.portees, section: ex.section,
        terme_reconnu: terme, detecte_par: 'intention' });
  }

  /* ── 3. LES ÉTAPES qui n'existent pas chez le client ────────────────────
     L'ordre relevé au §0 est celui que le client NUMÉROTE lui-même. Une
     étape inventée par une demande n'est pas une étape de son processus. */
  for (const libelle of demande.ordre_des_etapes ?? []) {
    const connue = BRD.ordre_des_etapes.some((e) => plier(e.libelle).includes(plier(libelle))
      || plier(libelle).includes(plier(e.libelle)));
    if (!connue) {
      ajouter(
        `« ${libelle} » ne fait pas partie de vos étapes.`,
        `Votre processus en compte ${BRD.ordre_des_etapes.length}, et ce sont vos propres ` +
        `mots : ${BRD.ordre_des_etapes.map((e) => e.libelle).join(' · ')}.`,
        { detecte_par: 'ordre-des-etapes' });
    }
  }

  const conforme = depassements.length === 0;
  return {
    conforme,
    verdict: conforme ? 'conforme' : 'depasse',
    intention: demande.intention ?? null,
    depassements,
    /* ⚠️ Une demande peut être « conforme » ET porter des précisions. La
       compétence DOIT les poser au client avant de livrer l'écran — les
       ignorer rendrait ce canal muet, et on retomberait sur le silence
       que ce lot répare. */
    precisions_a_lever: precisions,
    /* Sans ce contexte, on ne peut pas dire CONTRE QUOI la demande a été
       jugée — ni s'apercevoir qu'elle a été jugée contre un BRD périmé. */
    juge_contre: {
      brd: BRD.source.version.faisant_foi,
      version_lue_ou: BRD.source.version.lue_ou,
      empreinte_du_brd: BRD.source.empreinte,
      exigences: BRD.couverture.exigences,
      regles_opposables: BRD.couverture.regles_opposables,
      derive_le: BRD.derive_le,
    },
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   LIRE LE HEURT — par JETONS, et par RELATION D'ORDRE
   ═══════════════════════════════════════════════════════════════════════
   Deux défauts mesurés sur la version précédente, et ils avaient LA MÊME
   CAUSE : elle cherchait des SOUS-CHAÎNES et jugeait sur la position des
   mots plutôt que sur ce qu'ils disent.

     · 5 formulations de déplacement sur 10 passaient EN SILENCE — l'ancre
       en tête de phrase, l'ordre dit par « avant », l'ancre nommée « la
       première validation », « d'abord … ensuite ».

     · Des demandes légitimes étaient ACCUSÉES : « signe » cherché en
       sous-chaîne fait de « consigner », « désigner » et « assigner » des
       heurts. « désignation » paraît quarante fois dans l'ontologie.

   Un instrument qui accuse à tort fait défaire du travail juste ; celui qui
   se tait laisse chercher ailleurs. Les deux se corrigent au même endroit.

   Ce qui suit lit donc :
     ① des JETONS entiers, avec une flexion bornée — « signés » est une
        flexion de « signe » ; « consigner » ne commence pas par « signe » ;
     ② une RELATION D'ORDRE entre deux entités, portée par un marqueur
        placé ENTRE elles — c'est la relation qui condamne, pas les mots.
   ═══════════════════════════════════════════════════════════════════════ */

/* Découpe en jetons pliés, en gardant la position de chacun. */
function jetons(texte) {
  const out = [];
  for (const m of plier(texte).matchAll(/[a-z0-9]+/g)) {
    out.push({ mot: m[0], debut: m.index, fin: m.index + m[0].length });
  }
  return out;
}

/* Un jeton appartient-il à la famille du mot protégé ?
   Ancré au DÉBUT du jeton, avec une flexion bornée à la fin. C'est ce qui
   distingue « signe/signés/signer » de « consigner/désigner/assigner ». */
function estDuProtege(mot, famille, suffixes) {
  return famille.some((base) => suffixes.some((suf) => mot === base + suf));
}

/* Situe chaque entité (protégé, ancres) dans le flux de jetons. */
function situerLesEntites(texte, opp) {
  const v = opp.vocabulaire_du_heurt;
  const js = jetons(texte);
  const plie = plier(texte);
  const entites = [];

  for (const j of js) {
    if (estDuProtege(j.mot, v.protege, v.suffixes_flexion)) {
      entites.push({ genre: 'protege', libelle: opp.protege.etape, debut: j.debut });
    }
  }
  for (const a of v.ancres) {
    for (const forme of a.formes) {
      let i = plie.indexOf(forme);
      while (i !== -1) {
        entites.push({ genre: 'ancre', libelle: a.etape ?? a.libelle, debut: i });
        i = plie.indexOf(forme, i + 1);
      }
    }
  }
  return entites.sort((x, y) => x.debut - y.debut);
}

/* La lecture complète. */
function lireLeHeurt(intention, ordrePropose, opp) {
  const v = opp.vocabulaire_du_heurt;

  /* ── ① L'ordre STRUCTURÉ : le signal le plus sûr des trois ────────────
     La prose se discute ; un catalogue d'étapes proposé se MESURE. */
  const parOrdre = ordreQuiDeplace(ordrePropose, opp);
  if (parOrdre) {
    return { certitude: 'caracterise', ancre: parOrdre.libelle, detecte_par: 'ordre-des-etapes' };
  }

  const plie = plier(intention);
  const entites = situerLesEntites(intention, opp);
  const protege = entites.find((e) => e.genre === 'protege');
  const ancre = entites.find((e) => e.genre === 'ancre');
  if (!protege || !ancre) return { certitude: null };

  /* ── ② Un verbe de réordonnancement, les deux entités citées ──────────
     « inverser », « repousser », « déplacer » disent l'intention sans
     qu'aucune relation ne soit lisible dans la phrase. */
  if (v.verbes_declares.some((m) => plie.includes(plier(m)))) {
    return { certitude: 'caracterise', ancre: ancre.libelle, detecte_par: 'verbe-de-deplacement' };
  }

  /* ── ③ LA RELATION D'ORDRE ────────────────────────────────────────────
     On cherche un marqueur placé ENTRE deux entités de genres différents,
     et on résout qui vient en premier. */
  const marqueurs = [
    ...v.marqueurs_ordre.B_AVANT_A.map((m) => ({ mot: m, sens: 'B_AVANT_A' })),
    ...v.marqueurs_ordre.A_AVANT_B.map((m) => ({ mot: m, sens: 'A_AVANT_B' })),
  ];

  for (let i = 0; i < entites.length - 1; i++) {
    const A = entites[i];
    const B = entites.slice(i + 1).find((e) => e.genre !== A.genre);
    if (!B) continue;
    const entre = plie.slice(A.debut, B.debut);

    for (const { mot, sens } of marqueurs) {
      if (!entre.includes(plier(mot))) continue;
      // « A après B » → B d'abord ; « A avant B » → A d'abord.
      const premier = sens === 'B_AVANT_A' ? B : A;
      const second = premier === A ? B : A;
      // Interdit dès que le protégé arrive APRÈS l'ancre.
      if (premier.genre === 'ancre' && second.genre === 'protege') {
        return {
          certitude: 'caracterise',
          ancre: premier.libelle,
          detecte_par: `relation-d-ordre (${mot})`,
        };
      }
      // L'ordre correct, dit explicitement : rien à signaler.
      return { certitude: null };
    }
  }

  /* ── ④ Le marqueur EN TÊTE : « Après Validation 1, … » ────────────────
     Cette forme situe dans le temps AUTANT qu'elle déplace, et rien dans
     la phrase ne tranche — sauf le verbe. Observer n'est pas agir.
       « Après Validation 1, je veux VOIR si la signature a été reçue »  ✓
       « Après la Validation 2, on fera signer le candidat »             ✗ */
  const tete = plie.slice(0, entites[0].debut);
  const marqueurEnTete = v.marqueurs_ordre.B_AVANT_A.find((m) => tete.includes(plier(m)));
  if (marqueurEnTete && entites[0].genre === 'ancre') {
    const observe = v.verbes_observation.some((verbe) => plie.includes(plier(verbe)));
    return observe
      ? { certitude: 'a_lever', ancre: entites[0].libelle, detecte_par: 'marqueur-en-tete-et-observation' }
      : { certitude: 'caracterise', ancre: entites[0].libelle, detecte_par: `marqueur-en-tete (${marqueurEnTete})` };
  }

  /* ── ⑤ Les deux entités, aucune relation lisible ─────────────────────
     On ne se tait pas — mais on n'affirme rien non plus. */
  const adjacence = [...v.marqueurs_ordre.B_AVANT_A, ...v.marqueurs_ordre.A_AVANT_B]
    .some((m) => plie.includes(plier(m)));
  return adjacence
    ? { certitude: 'a_lever', ancre: ancre.libelle, detecte_par: 'adjacence-sans-relation' }
    : { certitude: null };
}

/* Un ordre d'étapes proposé place-t-il l'étape protégée APRÈS une ancre ?
   On compare des RANGS, pas des mots : c'est le seul angle où « après » a
   un sens mesurable. */
function ordreQuiDeplace(ordrePropose, opp) {
  if (!Array.isArray(ordrePropose) || ordrePropose.length === 0) return null;

  const situer = (libelle) => ordrePropose.findIndex(
    (x) => plier(x).includes(plier(libelle)) || plier(libelle).includes(plier(x)));

  const rangProtege = situer(opp.protege.etape);
  if (rangProtege === -1) return null;

  for (const a of opp.ancres) {
    const rangAncre = situer(a.etape);
    if (rangAncre !== -1 && rangProtege > rangAncre) {
      return { libelle: a.etape, rang_propose: rangProtege, rang_ancre: rangAncre };
    }
  }
  return null;
}

/* « au programme pour plus tard » — sans jamais écrire « V1.1 » ni « V2 »
   au client. Ce sont nos mots, pas les siens. */
function quand(portees) {
  if (portees.includes('V1.1')) return ', pour une version rapprochée';
  if (portees.includes('V2')) return ', pour une version ultérieure';
  return '';
}

/* ═══════════════════════════════════════════════════════════════════════
   LA DEMANDE DE CHANGEMENT
   ═══════════════════════════════════════════════════════════════════════
   Quand le client confirme vouloir son écran malgré le dépassement, on
   compose, on marque HORS CADRE, et CECI part vers l'équipe.

   ⚠️ Elle CITE L'EXIGENCE. Une demande qui ne nomme qu'une règle
   d'ontologie oblige l'équipe à retrouver elle-même de quoi il s'agit ;
   celle-ci pointe le passage du BRD à amender, et c'est ce qui la rend
   exploitable. */
export function demandeDeChangement(demande, rapport) {
  if (rapport.conforme) return null;

  const exigences = [...new Set(rapport.depassements
    .map((d) => d.trace?.exigence).filter(Boolean))];
  const opposables = [...new Set(rapport.depassements
    .map((d) => d.trace?.regle_opposable).filter(Boolean))];

  return {
    intention_du_client: demande.intention ?? null,
    demande_composee_hors_cadre: true,
    // Ce que l'équipe doit rouvrir, nommément.
    a_amender: [
      ...exigences.map((id) => {
        const ex = BRD.exigences.find((e) => e.id === id);
        return {
          quoi: 'exigence',
          id,
          portees: ex?.portees ?? null,
          section: ex?.section ?? null,
          enonce: ex?.enonce ?? null,
          question_pour_l_equipe:
            `Le client demande « ${ex?.vocabulaire[0] ?? id} », prévu ${(ex?.portees ?? []).join(' / ')}. ` +
            `Avance-t-on cette exigence, ou tient-on la portée ?`,
        };
      }),
      ...opposables.map((id) => {
        const o = BRD.regles_opposables.find((x) => x.id === id);
        return {
          quoi: 'regle_opposable',
          id,
          clause: o?.clause ?? null,
          question_pour_l_equipe:
            `Le client demande un écran qui heurte une décision d'affaires qu'il a lui-même prise. ` +
            `⚠️ Cette règle ne se change QUE par le client, et elle a déjà produit du code faux ` +
            `deux fois : ne pas la relâcher sans confirmation explicite de sa part.`,
        };
      }),
    ],
    ce_que_le_client_a_lu: rapport.depassements.map((d) => d.quoi),
    juge_contre: rapport.juge_contre,
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   LIGNE DE COMMANDE
   ═══════════════════════════════════════════════════════════════════════
   Code : 0 = conforme · 3 = dépasse (ce n'est pas une erreur) · 1 = illisible */
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const i = process.argv.indexOf('--demande');
  if (i === -1 || !process.argv[i + 1]) {
    console.error('\n⛔ Usage : node valider-contre-brd.mjs --demande <chemin.json|->\n');
    process.exit(1);
  }
  const chemin = process.argv[i + 1];
  let demande;
  try {
    const brut = chemin === '-' ? readFileSync(0, 'utf8') : readFileSync(resolve(chemin), 'utf8');
    demande = JSON.parse(brut);
  } catch (e) {
    console.error(`\n⛔ Demande illisible : ${e.message}\n`);
    process.exit(1);
  }
  const rapport = validerContreBrd(demande);
  const sortie = { ...rapport };
  if (!rapport.conforme) sortie.demande_de_changement = demandeDeChangement(demande, rapport);
  console.log(JSON.stringify(sortie, null, 2));
  process.exit(rapport.conforme ? 0 : 3);
}
