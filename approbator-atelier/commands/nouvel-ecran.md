---
description: Compose l'écran que la personne décrit — file de travail, tableau, fiche, tableau de bord — puis vérifie qu'il respecte les règles du module.
---

Composez l'écran que la personne demande, en suivant la compétence
`atelier-ecran`.

**Écoutez d'abord ce qu'elle veut, dans ses mots.** Ne la poussez pas
vers un formulaire : « je voudrais voir les dossiers bloqués avec le nom
du candidat » est une demande recevable telle quelle.

Traduisez-la en demande structurée, puis composez :

```bash
node "${CLAUDE_PLUGIN_ROOT}/outils/composer-libre.mjs" \
  --demande <demande>.json --sortie <écran>.html
```

**Lisez le code de sortie** — c'est lui qui décide de la suite :

- **0** — conforme, l'écran est composé. Dites où est le fichier.
- **3** — ça dépasse. **Rien n'a été composé.** Reprenez le message tel
  quel : la règle y est nommée dans les mots de la personne. Puis
  demandez-lui si elle veut le faire quand même, **et attendez sa
  réponse**. Si oui, relancez avec `--je-veux-quand-meme` : l'écran sera
  composé, marqué, et une demande de changement écrite à côté.
- **1** — la demande est illisible. Corrigez-la.

Ne contournez jamais un dépassement en modifiant la demande en douce :
l'écran perdrait sa marque, et l'équipe ne saurait pas ce que la personne
voulait vraiment.
