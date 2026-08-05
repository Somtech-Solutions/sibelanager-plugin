# Les trois issues d'une demande

L'atelier ne dit jamais « non ». Il dit **oui**, **oui mais voici ce que
ça implique**, ou **oui puisque vous le confirmez, et voici ce qui part à
l'équipe**.

## ① Conforme

La demande ne contredit aucune règle du module. L'écran est composé, rien
n'est signalé, aucune marque n'est posée.

**Code de sortie 0.**

C'est le cas le plus fréquent, et c'est voulu : la plupart des écrans
qu'un utilisateur veut sont parfaitement légitimes — ils n'avaient
simplement pas été prévus.

## ② Ça dépasse — et rien n'est composé

Quelque chose dans la demande va contre une règle du module : une étape
qui n'existe pas dans le processus, une information qu'on ne connaît pas,
un geste que le module n'autorise pas.

**Code de sortie 3. Aucun fichier n'est écrit.**

L'atelier affiche alors :

- **ce qui dépasse**, en une phrase ;
- **la règle**, telle qu'elle est écrite dans le modèle du module — pas
  une paraphrase ;
- **la question** : voulez-vous le faire quand même ?

⚠️ **Rien n'est composé tant que la personne n'a pas répondu.** C'est la
différence entre une conversation et un fait accompli.

⚠️ **La règle affichée n'est pas à réécrire.** Elle est extraite telle
quelle du modèle. La reformuler, même mieux, c'est risquer de lui faire
dire autre chose que ce qui est opposable.

## ③ Elle confirme — et là, tout change

L'écran **est composé**, et deux choses se produisent :

**L'écran porte sa marque**, sur quatre canaux, pour que personne ne le
reprenne en le croyant conforme :

- un bandeau rouge en tête, qui dit **laquelle** des règles est dépassée ;
- une bordure sur tout le document ;
- un filigrane « HORS CADRE » en coin ;
- le titre du document lui-même, préfixé `HORS CADRE —`.

Les quatre survivent à l'enregistrement, à l'impression (`@media print`)
et à l'envoi — le fichier est autonome, la marque voyage avec lui.

**Une demande de changement est écrite** à côté de l'écran :

```
demande-de-changement-<nom de l'écran>.md
```

Elle porte ce que la personne voulait, la règle dépassée, l'écran obtenu,
et — en commentaire, invisible à la lecture — la référence exacte pour
l'équipe.

🔴 **C'est le cas qui justifie tout le reste.** Un refus se contourne ou
décourage ; personne n'apprend rien. Une demande capitalise : ce que la
personne bricole devient une entrée utile.

## Ce qui n'existe pas encore

**L'acheminement automatique.** La demande est un fichier, à remettre à
l'équipe comme les écrans. Le connecteur qui la routerait tout seul n'est
pas livré — et la fonction, elle, marche dès aujourd'hui.
