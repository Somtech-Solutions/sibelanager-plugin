#!/usr/bin/env node
/* =====================================================================
   COMPOSER UN ÉCRAN — À PARTIR D'UNE DEMANDE, PAS D'UN FORMULAIRE
   Extension `approbator-atelier` · Société Immobilière Bélanger

   ---------------------------------------------------------------------
   CE QUI CHANGE PAR RAPPORT À `composer-ecran.mjs`
   ---------------------------------------------------------------------
   `composer-ecran.mjs` compose UNE forme — la file de travail — et refuse
   tout ce qui n'est pas au catalogue. Le client ne pouvait pas se
   tromper, et il ne pouvait pas travailler.

   Celui-ci prend une DEMANDE et compose ce qu'elle décrit. Il ne refuse
   rien. Il VALIDE, puis :

     conforme  → il compose, sans rien signaler
     dépasse   → il NOMME la règle dans les mots du client, demande s'il
                 veut le faire quand même, ET NE COMPOSE RIEN
     confirmé  → il compose, MARQUE l'écran hors cadre, et écrit une
                 demande de changement à remettre à l'équipe

   ⚠️ Le troisième cas est le cœur. Un refus se contourne ou décourage ;
   une demande CAPITALISE — elle transforme le bricolage du client en
   entrée utile.

   ---------------------------------------------------------------------
   USAGE
   ---------------------------------------------------------------------
     node composer-libre.mjs --demande <fichier.json> --sortie <x.html>
     node composer-libre.mjs --demande <fichier.json> --sortie <x.html> \
                             --je-veux-quand-meme

     --demande <chemin|->    la demande (voir valider-demande.mjs)
     --sortie <chemin>       le fichier à écrire
     --je-veux-quand-meme    compose malgré un dépassement, marque l'écran
                             et produit la demande de changement
     --demande-de-changement <chemin>   où écrire la demande
                             (défaut : à côté de la sortie)

   Codes de sortie
     0  composé
     3  dépassement signalé, RIEN composé — la réponse du client est attendue
     1  demande illisible ou options manquantes
   ===================================================================== */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

import { validerDemande, REFERENTIEL } from './valider-demande.mjs';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE_PLUGIN = process.env.CLAUDE_PLUGIN_ROOT
  ? resolve(process.env.CLAUDE_PLUGIN_ROOT)
  : resolve(ICI, '..');

const CATALOGUE = JSON.parse(
  readFileSync(join(RACINE_PLUGIN, 'donnees', 'catalogue.json'), 'utf8'));
const COQUILLE = readFileSync(
  join(RACINE_PLUGIN, 'gabarits', 'coquille.html'), 'utf8');

/* Des exemples inventés — EF-38 interdit les renseignements personnels
   réels hors production, et une maquette n'en a pas besoin. */
const EXEMPLES = {
  dossiers: {
    'BAIL-2026-0148': {
      unite: '4212, rue Sainte-Catherine Est — app. 302',
      emmenagement: '2026-09-01',
      personnes: ['Amélie Fournier', 'Karim Belhadj'],
    },
    'BAIL-2026-0152': {
      unite: '1180, avenue Papineau — app. 5',
      emmenagement: '2026-10-01',
      personnes: ['Josée Tremblay'],
    },
  },
};

function options(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const cle = a.slice(2);
    const suivant = argv[i + 1];
    if (suivant === undefined || suivant.startsWith('--')) o[cle] = true;
    else { o[cle] = suivant; i++; }
  }
  return o;
}

const echapper = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pourScriptJSON = (o) => JSON.stringify(o)
  .split('<').join('\\u003c').split('>').join('\\u003e');

/* ═══════════════════════════════════════════════════════════════════════
   LE DIALOGUE DE DÉPASSEMENT — dans SES mots
   ═══════════════════════════════════════════════════════════════════════ */
function direLeDepassement(rapport) {
  const n = rapport.depassements.length;
  console.log(`\n${'─'.repeat(68)}`);
  console.log(n === 1
    ? '\nCe que vous demandez sort du cadre défini sur un point.\n'
    : `\nCe que vous demandez sort du cadre défini sur ${n} points.\n`);

  rapport.depassements.forEach((d, i) => {
    console.log(`  ${n > 1 ? `${i + 1}. ` : ''}${d.quoi}`);
    console.log(`     ${d.pourquoi}\n`);
  });

  console.log('Rien n\'a été composé — c\'est à vous de décider.\n');
  console.log('  · Si vous voulez le faire QUAND MÊME, relancez avec');
  console.log('    --je-veux-quand-meme : l\'écran sera composé, marqué comme');
  console.log('    sortant du cadre, et une demande partira vers l\'équipe.');
  console.log('  · Sinon, ajustez votre demande et relancez.\n');
  console.log(`${'─'.repeat(68)}\n`);
}

/* ═══════════════════════════════════════════════════════════════════════
   LA DEMANDE DE CHANGEMENT — ce qui fait capitaliser au lieu de refuser
   ═══════════════════════════════════════════════════════════════════════ */
function ecrireLaDemande(chemin, demande, rapport, ecranProduit) {
  const lignes = rapport.depassements.map((d, i) => {
    const t = d.trace;
    return `### ${i + 1}. ${d.quoi}\n\n` +
      `**La règle** : ${d.pourquoi}\n\n` +
      (t
        ? `<!-- Pour l'équipe : règle ${t.regle} · concept ${t.concept}` +
          `${t.exigences?.length ? ` · exigences ${t.exigences.join(', ')}` : ''}` +
          `${t.regles_affaires?.length ? ` · règles d'affaires ${t.regles_affaires.join(', ')}` : ''} -->\n`
        : '<!-- Pour l\'équipe : aucune règle du module — l\'atelier n\'a simplement pas cet outil. -->\n');
  }).join('\n');

  const texte = `# Demande de changement — ${demande.intention ?? 'écran hors cadre'}

> Produite automatiquement par l'atelier, au moment où la composition a été
> confirmée malgré un dépassement. **Elle n'a pas encore été transmise** :
> remettez ce fichier à l'équipe de développement, comme vos écrans.

## Ce que je voulais faire

${demande.intention ?? '(non précisé)'}
${demande.depart ? `
## Sur quel écran

**${demande.depart}** — un écran qui existe déjà.

> ⚠️ **Ceci est une demande de MODIFICATION, pas de création.** L'écran de
> départ est nommé ci-dessus : il n'y a rien à deviner, et rien à redessiner.
> Sans ce rattachement, l'équipe reçoit « il veut un écran qui… » et cherche
> lequel.
` : ''}
## Ce qui dépasse le cadre

${lignes}

## Ce que j'ai obtenu

L'écran a été composé et **marqué comme sortant du cadre** :
\`${basename(ecranProduit)}\`

## La demande telle qu'elle a été formulée

\`\`\`json
${JSON.stringify(demande, null, 2)}
\`\`\`

<!-- Jugé contre : ontologie ${rapport.juge_contre.ontologie} ·
     BRD ${rapport.juge_contre.brd_relu_contre} ·
     ${rapport.juge_contre.regles} règles ·
     référentiel dérivé le ${rapport.juge_contre.referentiel_derive_le} -->
`;
  writeFileSync(chemin, texte, 'utf8');
}

/* ═══════════════════════════════════════════════════════════════════════
   LA COMPOSITION
   ═══════════════════════════════════════════════════════════════════════ */
function ecranDepuisDemande(demande, depassements) {
  const forme = demande.forme ?? 'file';
  const codesDossier = Object.keys(EXEMPLES.dossiers);

  const base = {
    forme,
    etape: demande.etape ?? CATALOGUE.etapes[0].code,
    niveau: demande.niveau ?? 'base',
    dossiers: EXEMPLES.dossiers,
    taches: [],
    titre_zone: demande.intention ?? null,
    // ⚠️ La marque voyage AVEC la donnée de l'écran : le gabarit la pose
    // lui-même. Personne ne peut composer un écran hors cadre en oubliant
    // de le marquer.
    // ⚠️ `pourquoi` voyage AUSSI : le critère exige que celui qui ouvre
    // l'écran voie LAQUELLE des règles est dépassée, pas seulement qu'il
    // y en a une. Sans la règle, la marque alerte sans informer.
    hors_cadre: depassements.map((d) => ({ quoi: d.quoi, pourquoi: d.pourquoi })),
  };

  if (forme === 'file') {
    const types = demande.taches?.length
      ? demande.taches
      : CATALOGUE.types_de_tache.filter((t) => t.niveau === base.niveau).map((t) => t.type);
    for (const code of types) {
      const def = CATALOGUE.types_de_tache.find((t) => t.type === code);
      if (!def) continue;
      if (def.grain === 'personne') {
        for (const p of EXEMPLES.dossiers[codesDossier[0]].personnes) {
          base.taches.push({ type: code, dossier: codesDossier[0], personne: p });
        }
      } else {
        base.taches.push({ type: code, dossier: codesDossier[0], personne: null });
      }
    }
    return base;
  }

  /* Tableau · fiche · tableau de bord : les colonnes viennent des
     attributs demandés, les lignes des dossiers d'exemple. */
  const el = (demande.elements ?? [])[0] ?? { concept: 'Dossier', attributs: [] };
  const attributs = el.attributs?.length
    ? el.attributs
    : (REFERENTIEL.concepts.find((c) => c.id === el.concept)?.attributs ?? []).slice(0, 5);

  base.colonnes = attributs.map((a) => ({ clef: a, titre: enJoli(a) }));
  base.lignes = codesDossier.map((code) => {
    const d = EXEMPLES.dossiers[code];
    const l = { concept: el.concept };
    for (const a of attributs) l[a] = valeurExemple(a, code, d);
    return l;
  });

  if (forme === 'tableau-de-bord') {
    base.compteurs = [
      { clef: 'dossiers', valeur: codesDossier.length, quoi: 'dossiers en cours' },
      { clef: 'etapes', valeur: CATALOGUE.etapes.length, quoi: 'étapes au processus' },
      { clef: 'taches', valeur: CATALOGUE.types_de_tache.length, quoi: 'types de tâche' },
    ];
  }
  return base;
}

const enJoli = (a) => a.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

function valeurExemple(attribut, code, d) {
  if (/bail|numero/.test(attribut)) return code;
  if (/unite|espace|logement/.test(attribut)) return d.unite;
  if (/emmenagement|date/.test(attribut)) return d.emmenagement;
  if (/nom|personne/.test(attribut)) return d.personnes[0];
  if (/courriel|email/.test(attribut)) return 'exemple@exemple.invalide';
  if (/etape/.test(attribut)) return CATALOGUE.etapes[3].libelle;
  if (/statut|etat/.test(attribut)) return 'en cours';
  if (/niveau/.test(attribut)) return 'base';
  if (/actif|est_/.test(attribut)) return 'oui';
  return '—';
}

/* ═══════════════════════════════════════════════════════════════════════ */
const o = options(process.argv.slice(2));

if (!o.demande || o.demande === true) {
  console.error('\n⛔ Il manque --demande <fichier.json|->\n');
  process.exit(1);
}
if (!o.sortie || o.sortie === true) {
  console.error('\n⛔ Il manque --sortie <fichier.html>\n');
  process.exit(1);
}

let demande;
try {
  const brut = o.demande === '-'
    ? readFileSync(0, 'utf8')
    : readFileSync(resolve(String(o.demande).replace(/^~(?=\/|$)/, homedir())), 'utf8');
  demande = JSON.parse(brut);
} catch (e) {
  console.error(`\n⛔ Demande illisible : ${e.message}\n`);
  process.exit(1);
}

const sortie = resolve(String(o.sortie).replace(/^~(?=\/|$)/, homedir()));
if (!existsSync(dirname(sortie))) {
  console.error(`\n⛔ Le répertoire « ${dirname(sortie)} » n'existe pas.\n` +
    `   Créez-le, ou choisissez un autre chemin :\n      mkdir -p "${dirname(sortie)}"\n`);
  process.exit(1);
}

const rapport = validerDemande(demande);

/* ── Le dépassement non confirmé : on ne compose RIEN ────────────────── */
if (!rapport.conforme && !o['je-veux-quand-meme']) {
  direLeDepassement(rapport);
  process.exit(3);
}

const ecran = ecranDepuisDemande(demande, rapport.conforme ? [] : rapport.depassements);
const titre = demande.intention
  ? String(demande.intention).replace(/^./, (c) => c.toUpperCase())
  : 'Écran composé';

const valeurs = {
  __CATALOGUE__: pourScriptJSON(CATALOGUE),
  __ECRAN__: pourScriptJSON(ecran),
  __TITRE__: echapper(titre),
};
const html = COQUILLE.replace(/__CATALOGUE__|__ECRAN__|__TITRE__/g, (m) => valeurs[m]);
writeFileSync(sortie, html, 'utf8');

console.log(`\nÉcran composé.\n`);
console.log(`  Forme      ${ecran.forme}`);
console.log(`  Fichier    ${sortie}`);

if (!rapport.conforme) {
  const cheminDemande = typeof o['demande-de-changement'] === 'string'
    ? resolve(o['demande-de-changement'])
    : join(dirname(sortie), `demande-de-changement-${basename(sortie, '.html')}.md`);
  ecrireLaDemande(cheminDemande, demande, rapport, sortie);

  console.log(`\n  ⚠ Cet écran sort du cadre défini — il porte la marque.`);
  for (const d of rapport.depassements) console.log(`      · ${d.quoi}`);
  console.log(`\n  Une demande de changement a été préparée :`);
  console.log(`      ${cheminDemande}`);
  console.log(`\n  Remettez-la à l'équipe, comme vos écrans.\n`);
} else {
  console.log(`\n  Ouvrez-le par double-clic. Il fonctionne seul, sans réseau.\n`);
}
