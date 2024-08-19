---
title: Créer une App d'aide à la prononciation

---

# Créer une App d'aide à la prononciation

L'objet de ce post est de réaliser une application permettant de contrôler la prononciation de l'utilisateur.

Pour suivre ce tutoriel, il faut avoir des connaissances en javascript et plus particulièrement en Vue.js 3.

## Idée

J'ai décidé il y a peu de me remettre à l'allemand. La principale difficulté que je rencontre dans cette langue de la prononcer correctement. Habituellement j'écoute un exemple, je m'enregistre en train de le répéter et je me réécoute. C'est un process compliqué et je dois vous l'avouer je n'ai pas une très bonne oreille.

A partir de ce constat, je me suis demandé si il n'existerait pas une App ou une api qui pourrait me dire si je prononce correctement un mot voir une phrase en allemand ! Après quelques investigations et belles découvertes j'ai eu l'envie de coder ma propre App pour résoudre mon problème.

Voici comment je m'y suis pris !

## Les APIs disponibles

Après quelques recherches j'ai pu trouver des Apps qui résolvaient mon problème. Mais dans l'ensemble, la validation de la prononciation n'était souvent qu'une fonction annexe d'une application payante (voir fonctionnant avec abonnement). Je me suis alors mis en tête de rechercher des APIs.

Voici la liste des APIs que j'ai pu identifier :

- [Google Cloud Speech-to-Text API](https://cloud.google.com/speech-to-text/docs)
- [Microsoft Azure Speech Service](https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/)
- [iSpeech Pronunciation](https://www.ispeech.org/api/#pronunciation)
- [Speechmatics](https://docs.speechmatics.com)
- [Speechace](https://www.speechace.com/docs)
- [Elsa Now](https://api-external-doc.elsanow.co/intro)
- [SpeechSuper](https://docs.speechsuper.com/#/)

L'ensemble de ces apis sont payantes mais permettent en règle générale d'obtenir un accès de 2 semaines pour tester et expérimenter.

Vu que je voulais contrôler ma prononciation de l'allemand j'ai choisi de tester avec l'api SpeechSuper car elle supporte plusieurs langues dont l'allemand. Plus tard dans le tutorial nous essaierons l'api Speechace pour démontrer la facilité à passer d'une api à une autre suivant les besoins.

## Définition de l'ergonomie de l'application

L'objectif est d'implémenter une App simple permettant de saisir un mot, d'enregistrer notre voix, d'envoyer l'enregistrement audio à l'api et d'afficher notre score.

Voici à quoi va ressembler l'application

| Saisir un texte à prononcer | Enregistrer notre prononciation | Afficher le résultat de l'enregistrement | Visualiser les différentes tentatives |
| :---: | :---: | :---: | :---: |
|![Ergonomics 1](/article-0001/ergonomics-01.png){width=110} | ![Ergonomics 2](/article-0001/ergonomics-02.png){width=110}|![Ergonomics 3](/article-0001/ergonomics-03.png){width=110} | ![Ergonomics 4](/article-0001/ergonomics-04.png){width=110}|

Nous allons donc créer une application qui présentera un champ de texte permettant la saisie d'un mot ou d'une phrase. Un boutton permettra de l'écouter.
Nous avons ensuite un boutton pour enregistrer notre voix, celui-ci changera de style quand il sera en mode enregistrement. Il suffira de cliquer dessus pour arrêter et envoyer à l'api pour obtenoir un score de prononciation.
Une fois le score obtenu, il est affiché sous forme de tuile avec une couleur représentant notre score, du rouge au vert en passant par le orange.

## Initialisation de l'application

L'idéal serait de pouvoir déployer l'App comme webapp, mais aussi comme une application native Android. Pour cette raison nous allons utiliser [Quasar](https://quasar.dev/).

### Le framework Quasar

Quasar est un framework Vue.js open-source pour développer des applications avec une codebase unique. Elles peuvent être déployées sur le web (SPA, PWA, SSR), en tant qu'application mobile (Android, iOS) ou encore en tant qu'application Desktop (MacOs, Windows, Linux)

### Préparation

Si ce n'est pas encore le cas, il vous faut installer [NodeJS](https://nodejs.org/en/download/package-manager/current). Je vous conseille d'utiliser [volta](https://volta.sh/) ce dernier vous permettra d'utiliser différentes versions de NodeJs suivant vos projets.

Nous allons commencer par initialiser notre projet avec l'outil de scaffolding de Quasar

```sh
npm i -g @quasar/cli
npm init quasar
```

Le cli va nous poser plusieurs questions, choisir les options suivantes
- App with Quasar CLI
- Project folder : learn2speak
- Quasar v2
- Javascript
- Quasar App with Vite
- Package name : learn2speak
- Project product name : Learn to speak
- Project description : Assess your pronounciation
- Author : vous même
- CSS preprocessor : Sass with SCSS syntax
- Features needed :
	- ESLint
	- Axios
- ESLint preset : Standard
- Install project dependencies : Yes, use npm

Une fois l'exécution de la commande, vous pouvez entrer dans le répertoire et servir l'application en local :

```
cd learn2speak
npm run dev
```

Votre navigateur par défaut devrait ouvrir la page à l'adresse suivante [http://localhost:9000](http://localhost:9000)

![Squelette applicatif Quasar](/article-0001/application-quasar-gen.png)

L'application d'exemple est disponible, nous allons enlever les éléments dont nous n'avons pas besoin. Pour cela nous allons ouvrir le code source dans VSCode (vous pouvez bien entendu utiliser un autre éditeur)

```
code .
```

### Modification du squelette proposé pour obtenir l'ergonomie ciblée




### Ergonomie

Cible en terme d'ergonomie

Préparation des cases vides

## Enregistreur vocal

TODO

## Envoi à l'api

TODO

## Affichage du résultat

TODO

## Déploiement sur Github Pages

TODO

## Packaging Android

TODO

## Et après ?

- Rejouer l'enregistrement
- Traduire le mot via google translate api
- Un mot au hasard
- Gérer plusieurs langues
- ?





  ::: code-group
```js [config.js]
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "My Awesome Blog",
    description: "Talking about the future !",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' },
        ],
        search: {
            provider: 'local'
        }
    }
})
```
:::

## Another Sub Section

Ea consequuntur veniam ut veniam laborum sit recusandae deserunt. Quo ipsa odit ut temporibus ipsam cum consequatur itaque et possimus tempore et quia cumque!
