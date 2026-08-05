#!/usr/bin/env node
/* =====================================================================
   COMPOSER UN ÉCRAN DE BOÎTE DE RÉCEPTION
   Extension `approbator-atelier` · Société Immobilière Bélanger

   ---------------------------------------------------------------------
   CE QUE FAIT CET OUTIL
   ---------------------------------------------------------------------
   Il prend une ÉTAPE et des TYPES DE TÂCHE du catalogue, et écrit UN SEUL
   fichier HTML qui s'ouvre par double-clic : pas de serveur, pas de
   compte, pas de fichier voisin, aucune requête réseau.

   ---------------------------------------------------------------------
   POURQUOI IL REFUSE CE QUI N'EST PAS AU CATALOGUE
   ---------------------------------------------------------------------
   Ce n'est pas pour brider. C'est pour que **le chemin le plus court
   produise quelque chose de reprenable**. Un écran composé ici porte,
   sur chaque ligne, l'étape / l'archétype / le grain / l'exigence dont
   il relève — sans que personne ait eu à annoter quoi que ce soit.

   Quand le client veut ce que le catalogue ne porte pas, ce n'est pas un
   défaut de l'outil : c'est une DEMANDE DE CHANGEMENT. La compétence
   `demande-de-changement` prend le relais.

   ---------------------------------------------------------------------
   USAGE
   ---------------------------------------------------------------------
     node composer-ecran.mjs --etape <code> [options]

     --etape <code>          REQUIS. Un des dix codes du catalogue.
     --niveau <code>         base (défaut) · intermediaire · eleve
     --taches <t1,t2,…>      Types de tâche. Défaut : tous ceux du niveau.
     --titre <texte>         Titre de l'écran.
     --sortie <chemin>       Défaut : ./boite-<etape>-<niveau>.html
     --exemples <chemin.json>  Dossiers et personnes à afficher.
     --lister                Affiche le catalogue et sort.
   ===================================================================== */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE_PLUGIN = process.env.CLAUDE_PLUGIN_ROOT
  ? resolve(process.env.CLAUDE_PLUGIN_ROOT)
  : resolve(ICI, '..');

const CATALOGUE = JSON.parse(
  readFileSync(join(RACINE_PLUGIN, 'donnees', 'catalogue.json'), 'utf8'));
const COQUILLE = readFileSync(
  join(RACINE_PLUGIN, 'gabarits', 'coquille.html'), 'utf8');

/* ── Les exemples par défaut ─────────────────────────────────────────
   Un dossier qui porte À LA FOIS des tâches de grain personne et de
   grain dossier : c'est ce qui rend visible que la file montre les deux
   sans les confondre (EF-03). Données inventées, aucune donnée réelle —
   EF-38 interdit les renseignements personnels hors production. */
/* ⚠️ DEUX DOSSIERS, PAS UN — et leurs dates d'emménagement diffèrent.
   Avec un seul, la file ne peut RIEN montrer de son tri : toutes les
   lignes portent la même urgence, l'ordre est indiscernable de l'ordre
   d'insertion, et un contrôle qui vérifierait le tri serait vrai par
   construction. Le second dossier est ce qui rend le tri observable.

   ⚠️ Le type de logement et le loyer sont là pour la DENSITÉ : une ligne
   qui ne porte qu'un titre oblige à ouvrir chaque tâche pour savoir de
   quoi elle parle. C'est ce qui sépare une boîte de réception d'une
   liste. Données inventées — EF-38 interdit les renseignements
   personnels hors production. */
const EXEMPLES_PAR_DEFAUT = {
  dossiers: {
    'BAIL-2026-0148': {
      unite: '4212, rue Sainte-Catherine Est — app. 302',
      logement: '4½',
      loyer: 1450,
      emmenagement: '2026-09-01',
      personnes: ['Amélie Fournier', 'Karim Belhadj'],
    },
    'BAIL-2026-0151': {
      unite: '870, avenue Mont-Royal Est — app. 5',
      logement: '3½',
      loyer: 1195,
      emmenagement: '2026-08-10',
      personnes: ['Sophie Tremblay'],
    },
  },
  personnes: ['Amélie Fournier', 'Karim Belhadj'],
};

/* ── Lecture des options ─────────────────────────────────────────────── */
function options(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const cle = a.slice(2);
    const suivant = argv[i + 1];
    if (suivant === undefined || suivant.startsWith('--')) { o[cle] = true; }
    else { o[cle] = suivant; i++; }
  }
  return o;
}

function lister() {
  console.log('\nLES DIX ÉTAPES — le client les numérote lui-même\n');
  for (const e of CATALOGUE.etapes) {
    console.log(`  ${String(e.rang).padStart(2)}  ${e.code.padEnd(22)} ${e.libelle}`);
  }
  console.log('\nLES SIX ARCHÉTYPES — le geste attendu\n');
  for (const a of CATALOGUE.archetypes) {
    console.log(`  ${a.glyphe}  ${a.code.padEnd(14)} ${a.libelle.padEnd(14)} ${a.part.padStart(5)}  ${a.aide}`);
  }
  console.log('\nLES TYPES DE TÂCHE — grain · niveau · archétype\n');
  for (const t of CATALOGUE.types_de_tache) {
    console.log(
      `  ${t.type.padEnd(24)} ${t.grain.padEnd(9)} ${t.niveau.padEnd(14)} ` +
      `${t.archetype.padEnd(13)} ${t.bloquant ? 'bloquant' : '        '}  ${t.libelle}`);
  }
  console.log(
    `\n⚠️  L'atelier ne DÉDUIT aucune étape pour une tâche.\n` +
    `   ${CATALOGUE.rattachement_tache_etape.motif}\n`);
}

/* Le nom d'un répertoire voisin qui ressemble à celui demandé — sans
   dictionnaire de traductions : on compare aux entrées RÉELLES du parent.
   « Bureau » retrouve ainsi « Desktop » parce que macOS n'a que celui-là,
   et le message peut nommer le vrai chemin au lieu de le deviner. */
const EQUIVALENTS = { bureau: 'desktop', documents: 'documents',
  telechargements: 'downloads', images: 'pictures', bureautique: 'desktop' };
function suggererDossier(chemin) {
  const parent = dirname(chemin);
  if (!existsSync(parent)) return null;
  const voulu = basename(chemin).normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const cible = EQUIVALENTS[voulu];
  if (!cible) return null;
  for (const entree of readdirSync(parent)) {
    if (entree.toLowerCase() === cible) return join(parent, entree);
  }
  return null;
}

/* ── Le refus qui aiguille, plutôt qu'il ne bloque ───────────────────── */
function refuser(quoi, valeur, connus, suite) {
  const liste = connus.map((c) => `      · ${c}`).join('\n');
  console.error(
    `\n⛔ « ${valeur} » n'est pas ${quoi} du catalogue.\n\n` +
    `   Ce qui existe :\n${liste}\n\n` +
    `   Si c'est bien ${quoi} que vous voulez et qu'il n'y est pas, ce n'est pas\n` +
    `   une erreur de votre part — c'est une DEMANDE DE CHANGEMENT.\n` +
    `   ${suite}\n`);
  process.exit(1);
}

/* ── Composition ─────────────────────────────────────────────────────── */
function composer(o) {
  const codeEtape = o.etape;
  if (!codeEtape || codeEtape === true) {
    console.error(
      '\n⛔ Il manque --etape.\n\n   Les dix étapes :\n' +
      CATALOGUE.etapes.map((e) => `      ${e.code.padEnd(22)} ${e.libelle}`).join('\n') +
      '\n');
    process.exit(1);
  }

  const etape = CATALOGUE.etapes.find((e) => e.code === codeEtape);
  if (!etape) {
    refuser('une étape', codeEtape, CATALOGUE.etapes.map((e) => `${e.code} — ${e.libelle}`),
      'Demandez « je veux ajouter une étape » : l\'atelier la formulera pour l\'équipe.');
  }

  const codeNiveau = typeof o.niveau === 'string' ? o.niveau : 'base';
  const niveau = CATALOGUE.niveaux.find((n) => n.code === codeNiveau);
  if (!niveau) {
    refuser('un niveau', codeNiveau, CATALOGUE.niveaux.map((n) => `${n.code} — ${n.libelle}`),
      'Demandez « je veux un niveau de plus » : l\'atelier le formulera pour l\'équipe.');
  }

  let types;
  if (typeof o.taches === 'string') {
    types = o.taches.split(',').map((s) => s.trim()).filter(Boolean);
    for (const t of types) {
      if (!CATALOGUE.types_de_tache.some((c) => c.type === t)) {
        refuser('un type de tâche', t,
          CATALOGUE.types_de_tache.map((c) => `${c.type} — ${c.libelle}`),
          'Demandez « je veux une tâche qui … » : l\'atelier la formulera pour l\'équipe.');
      }
    }
  } else {
    types = CATALOGUE.types_de_tache
      .filter((t) => t.niveau === codeNiveau)
      .map((t) => t.type);
  }

  if (types.length === 0) {
    console.error(
      `\n⛔ Aucun type de tâche au niveau « ${niveau.libelle} ».\n` +
      `   Précisez --taches, ou choisissez un autre niveau.\n`);
    process.exit(1);
  }

  const exemples = typeof o.exemples === 'string'
    ? JSON.parse(readFileSync(o.exemples, 'utf8'))
    : EXEMPLES_PAR_DEFAUT;

  const codesDossier = Object.keys(exemples.dossiers ?? {});
  if (codesDossier.length === 0) {
    console.error('\n⛔ Le fichier d\'exemples ne porte aucun dossier.\n');
    process.exit(1);
  }
  /* ⚠️ LA FILE PORTE LES TÂCHES DE TOUS LES DOSSIERS, pas d'un seul.
     Une file d'un seul dossier ne peut rien montrer d'un tri par urgence :
     toutes ses lignes ont la même échéance. C'est aussi la réalité du
     travail — un agent traite ce qui presse, quel que soit le dossier. */
  const taches = [];
  for (const codeDossier of codesDossier) {
    const dossier = exemples.dossiers[codeDossier];
    const personnes = dossier.personnes
      ?? exemples.personnes ?? ['(personne à nommer)'];

    /* Une tâche de grain PERSONNE existe en autant d'exemplaires qu'il y a
       de signataires ; une tâche de grain DOSSIER n'existe qu'une fois.
       C'est le catalogue qui le dit, pas cet outil. */
    for (const code of types) {
      const def = CATALOGUE.types_de_tache.find((t) => t.type === code);
      if (def.grain === 'personne') {
        for (const p of personnes) {
          taches.push({ type: code, dossier: codeDossier, personne: p,
            justification: def.justifie });
        }
      } else {
        taches.push({ type: code, dossier: codeDossier, personne: null,
          justification: def.justifie });
      }
    }
  }

  const titre = typeof o.titre === 'string'
    ? o.titre
    : `File de travail — ${etape.libelle}`;

  /* ⚠️ LA DATE DE COMPOSITION EST ÉCRITE DANS L'ÉCRAN, pas lue à
     l'ouverture. Le fichier est autonome et voyage : un « J-5 » recalculé
     à chaque ouverture dirait autre chose le mois suivant, et le client
     croirait que ses données ont bougé. Ce qu'il voit est figé au moment
     où l'écran est fait — comme une capture, pas comme un tableau vivant. */
  const ecran = {
    etape: etape.code, niveau: niveau.code, taches,
    dossiers: exemples.dossiers,
    compose_le: new Date().toISOString().slice(0, 10),
  };

  /* Substitution EN UNE PASSE : une valeur injectée ne peut pas contenir
     le marqueur d'une autre et se faire substituer à son tour. */
  const valeurs = {
    __CATALOGUE__: pourScriptJSON(CATALOGUE),
    __ECRAN__: pourScriptJSON(ecran),
    __TITRE__: echapperHTML(titre),
  };
  const html = COQUILLE.replace(
    /__CATALOGUE__|__ECRAN__|__TITRE__/g, (m) => valeurs[m]);

  const sortie = typeof o.sortie === 'string'
    ? resolve(o.sortie.replace(/^~(?=\/|$)/, homedir()))
    : resolve(process.cwd(), `boite-${etape.code}-${niveau.code}.html`);

  /* ⚠️ Le composeur refuse soigneusement une étape, un niveau ou un type de
     tâche inconnus, puis laissait `--sortie` produire douze lignes de trace
     de pile Node. Un répertoire absent est une faute d'usage comme les
     autres : elle se dit en une phrase, avec le geste de réparation. */
  const dossierSortie = dirname(sortie);
  if (!existsSync(dossierSortie)) {
    const proche = suggererDossier(dossierSortie);
    console.error(
      `\n⛔ Le répertoire « ${dossierSortie} » n'existe pas.\n\n` +
      (proche ? `   Vouliez-vous dire « ${proche} » ?\n` +
                `   (sur macOS, le Bureau s'appelle « Desktop » sur le disque —\n` +
                `    seul son nom affiché est traduit)\n\n` : '') +
      `   Créez-le, ou choisissez un autre chemin :\n` +
      `      mkdir -p "${dossierSortie}"\n`);
    process.exit(1);
  }

  writeFileSync(sortie, html, 'utf8');

  const nbPersonne = taches.filter((t) =>
    CATALOGUE.types_de_tache.find((c) => c.type === t.type).grain === 'personne').length;

  console.log(`\nÉcran composé.\n`);
  console.log(`  Étape      ${etape.libelle}`);
  console.log(`  Niveau     ${niveau.libelle}`);
  console.log(`  Tâches     ${taches.length} (${nbPersonne} de grain personne, ${taches.length - nbPersonne} de grain dossier)`);
  console.log(`  Fichier    ${sortie}`);
  console.log(`\n  Ouvrez-le par double-clic. Il fonctionne seul, sans réseau.\n`);
}

/* Un JSON placé dans un <script type="application/json"> doit être
   inerte : seule la séquence `</` peut refermer la balise. */
function pourScriptJSON(o) {
  return JSON.stringify(o).split('<').join('\\u003c').split('>').join('\\u003e');
}
function echapperHTML(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const o = options(process.argv.slice(2));
if (o.lister) { lister(); }
else { composer(o); }
