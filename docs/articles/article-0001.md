---
title: Créer une App d'aide à la prononciation (Partie 1)

---

# Créer une App d'aide à la prononciation (Partie 1)

L'objet de ce tutoriel est de réaliser une application permettant de contrôler la prononciation de l'utilisateur.

Pour le suivre, il faut avoir des connaissances en javascript et plus idéalement en Vue.js 3.

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

```sh
cd learn2speak
npm run dev
```

Votre navigateur par défaut devrait ouvrir la page à l'adresse suivante [http://localhost:9000](http://localhost:9000)

![Squelette applicatif Quasar](/article-0001/application-quasar-gen.png)

### Modification du squelette proposé pour obtenir l'ergonomie ciblée

L'application d'exemple est disponible, nous allons enlever les éléments dont nous n'avons pas besoin. Pour cela nous allons ouvrir le code source dans VSCode (vous pouvez bien entendu utiliser un autre éditeur)

```sh
code .
```

#### Modification du layout

Quasar met à notre disposition la notion de `Layout` puis de page incluse dans ce dernier. Les pages et le layout sont choisis via le router. Pour ce tutoriel, nous n'avons pas besoin de connaitre ces notions, mais vous pouvez les apprendre ici : [Quasar layout](https://quasar.dev/layout/routing-with-layouts-and-pages)

Nous n'avons pas besoin de drawer, du moins pas pour l'instant nous allons donc le supprimer du fichier `src/layouts/MainLayout.vue`. Pour cela supprimer la section du `<template>` comprise entre les tags `<drawer>...</drawer>`, puis nous allons modifier le header pour afficher l'icône puis le nom de l'application, cela nous donne le code suivant pour le template :

```html
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-icon name="interpreter_mode" size="md" />
        <q-toolbar-title>
          Learn2Speak
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
```

Nous pouvons ensuite supprimer toute la partie script pour la remplacer par le code suivant :

```
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  setup () {
  }
})
</script>
```

Nous n'avons pas besoin de plus pour la partie layout car notre application ne définira qu'une unique page.

#### La page principale

L'implémentation de la page principale se trouve dans le fichier : `src/pages/IndexPage.vue`

il s'agit de la page principale où nous allons positionner notre champs de texte et le bouton d'enregistrement.

Pour ce fichier, nous simplement retirer le logo de Quasar du template (la balise `<img>`) et modifier la partie script pour utiliser l'api de composition de vueJS 3, de façon à ce que le source ressemble au fichier suivant :

```
<template>
  <q-page class="flex flex-center">

  </q-page>
</template>

<script setup>

</script>
```

Nous allons maintenant ajouter le le champ de texte grâce au composant Quasar [QInput](https://quasar.dev/vue-components/input)

Pour cela nous ajouter au template de la page le composant `q-input`

```
<template>
  <q-page class="flex flex-center">
    <q-input
      type="textarea"
      :lines="2"
      autogrow
      hint="Input a word or a sentence"
      clearable
    />
  </q-page>
</template>
```

Vous pouvez vous apercevoir que le champ de texte s'affiche au centre de l'écran, ceci est dû aux classes Quasar `flex` et `flex-center`. Ces classes sont définies par [Quasar : Flexbox](https://quasar.dev/layout/grid/introduction-to-flexbox). Nous allons remédier à cela en plaçant le champ de texte en haut de l'écran, nous allons aussi en profiter pour styler le composant.

Quasar nous met même à disposition un [Flex Playground](https://quasar.dev/layout/grid/flex-playground) pour expérimenter et trouver les classes à poser

```
<template>
  <q-page class="column wrap content-center items-center">
    <q-input
      class="input-text"
      v-model="sentence"
      type="textarea"
      :lines="2"
      autogrow
      hint="Input a word or a sentence"
      clearable
    />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

// Reference on the word or sentence to be pronounced
const sentence = ref('')

</script>

<style scoped>
.input-text {
  width: 80vw;
  max-width: 400px;
}
</style>
```

Comme vous pouvez le voir, nous avons défini une référence `sentence` dans la partie script pour stocker la valeur saisie par l'utilisateur. Elle est associée via la directive `v-model` au composant `q-input`

Nous allons finir cette première partie en ajoutant le bouton permettant l'enregistrement de notre prononciation du mot ou de la phrase. Pour cela nous allons tout simplement utiliser le composant [`q-button`](https://quasar.dev/vue-components/button) de Quasar et le positionner après notre champ de texte.

```
<template>
  <q-page class="column wrap content-center items-center">
    <q-input
      class="input-text q-mt-lg"
      v-model="sentence"
      type="textarea"
      :lines="2"
      autogrow
      hint="Input a word or a sentence"
      clearable
    />
    <div>
    <q-btn
      class="q-mt-lg"
      icon="mic"
      color="primary"
      round
      size="30px"
      @click="record"
    />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

// Reference on the word or sentence to be pronounced
const sentence = ref('')

function record () {
  console.log('Record')
}
</script>

<style scoped>
.input-text {
  width: 80vw;
  max-width: 400px;
}
</style>
```

A noter que nous avons ajouté la classe `q-mt-lg` pour aérer un peu l'interface en laissant un peu d'espace au dessus de chacun des composants. Vous pouvez vous référer à la documentation Quasar sur [l'espacement](https://quasar.dev/style/spacing).

## Conclusion

Nous avons donc réussi à obtenir le squelette de notre application.

Dans une prochaine partie nous verrons comment acquérir l'audio, puis comment obtenir un score via l'api [SpeechSuper](https://docs.speechsuper.com/#/)
- Partie 2 : Aquisition de l'audio
- Partie 3 : Obtention du score via l'API SpeechSuper
- Partie 4 : Packaging de l'application
