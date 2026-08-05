---
name: demande-de-changement
description: Formule une demande de changement pour le module d'approbation des baux quand ce que la personne veut n'existe pas encore — une étape absente du processus, un type de tâche qui manque, un champ qu'on ne voit nulle part, une règle qui ne correspond pas à sa réalité. À utiliser quand quelqu'un dit « il me faudrait aussi une étape pour… », « cette tâche n'existe pas », « il manque un champ », « chez nous ça se passe autrement », ou quand la composition d'un écran est refusée parce que le catalogue ne porte pas ce qui est demandé.
---

# Formuler une demande de changement

Quand ce que la personne veut n'est pas au catalogue, **ce n'est pas une
erreur de sa part**. C'est une information : le processus outillé ne
couvre pas encore sa réalité. Votre travail est de la formuler pour que
l'équipe puisse en faire quelque chose.

**Ne dites jamais simplement « ce n'est pas possible ».** Une demande
bien formulée vaut mieux qu'un contournement bricolé.

## Les quatre choses à établir

1. **Ce qu'elle veut faire**, dans ses mots à elle. Pas la solution
   technique — le besoin. « Je dois pouvoir noter qu'un candidat a un
   animal » plutôt que « il faut un champ booléen animal ».
2. **Où ça bloque aujourd'hui** — quelle étape, quelle tâche, quel
   moment du processus. Nommez-les avec le vocabulaire du catalogue.
3. **Ce que ça change pour elle** si rien ne bouge : ce qu'elle fait à la
   place aujourd'hui, et ce que ça lui coûte.
4. **L'urgence réelle**, et sur quoi elle se fonde.

Si l'un des quatre manque, **demandez-le**. Une demande incomplète
revient toujours, et le retour coûte plus cher que la question.

## Écrivez le fichier

Écrivez la demande dans un fichier Markdown, à côté des écrans que la
personne compose, nommé `demande-<sujet-court>.md` :

```markdown
# Demande de changement — <titre court>

**Formulée le** <date> · **par** <qui>

## Ce que je veux faire
<dans ses mots>

## Où ça bloque
Étape : <libellé du catalogue, ou « aucune — l'étape n'existe pas »>
Tâche : <libellé du catalogue, ou « aucune »>
Élément absent : <étape · type de tâche · champ · règle>

## Ce que je fais aujourd'hui à la place
<le contournement actuel, et ce qu'il coûte>

## Urgence
<et sur quoi elle se fonde>

## Pour l'équipe
Catalogue lu : version dérivée le <donnees/PROVENANCE.md>
Écran concerné : <fichier, si applicable>
```

Puis **remettez ce fichier à l'équipe de développement**, de la même
façon que les écrans composés.

⚠️ **L'acheminement automatique n'existe pas encore.** Il attend un
connecteur vers nos outils, qui n'est pas encore livré. Le fichier, lui,
fonctionne dès aujourd'hui — c'est la partie qui compte.

## Rendez la main

Terminez toujours en disant **ce qui reste possible en attendant** : un
écran voisin, une étape existante qui s'en rapproche, un contournement
acceptable. Une personne qui repart avec une demande déposée *et* quelque
chose à faire n'est pas bloquée.

## Ce que vous ne faites pas

- **Vous n'inventez pas le libellé manquant** pour « débloquer » la
  composition. L'écran cesserait d'être situable, et l'équipe recevrait
  une maquette qui parle d'un processus qui n'existe pas.
- **Vous ne promettez pas de délai.** Vous formulez ; c'est l'équipe qui
  arbitre.
