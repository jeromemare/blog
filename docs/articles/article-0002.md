---
title: Créer une App d'aide à la prononciation (Partie 2)
---

# Créer une App d'aide à la prononciation (Partie 2)

L'objet de ce post est de réaliser une application permettant de contrôler la prononciation de l'utilisateur.

Pour suivre ce tutoriel, il faut avoir des connaissances en javascript et plus particulièrement en Vue.js 3.

## Ce que nous allons faire

Nous avions dans [l'article précédent](/articles/article-0001) mis en place le squelette de l'application avec le framework [Quasar](https://quasar.dev/) basé sur [VueJS](https://vuejs.org/)

Nous allons maintenant mettre en place le premier des deux composants principaux de l'application :
- Le composant responsable de la saisie du mot ou de la phrase à prononcer. Ce dernier pourra lire le mot pour permettre à l'utilisateur d'écouter ce qu'il doit prononcer
- Le composant d'acquisition vocale. Il s'agit d'un bouton permettant d'enregistrer sa voix puis d'envoyer l'enregistrement à l'api.

Nous allons commencer par créer le squelette du composant et à le positionner dans la page principale de l'application.

Pour cela, créer le fichier `WordInputField.vue` dans le répertoire `/src/components`. Vous pouvez en profiter pour supprimer le fichier `EssentialLink.vue` qui n'est plus utile.

## Création d'un composant vue

```vue
<template>
  <q-input
    class="input-text q-mt-lg"
    v-model="sentence"
    type="textarea"
    :lines="2"
    autogrow
    hint="Input a word or a sentence"
    clearable
  />
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

Une fois cela fait nous pouvons utiliser le composant dans la page principale : `/src/pages/IndexPage.vue`

```vue
<template>
  <q-page class="column wrap content-center items-center">
    <sentence-input-field />
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
import SentenceInputField from '../components/SentenceInputField'

function record () {
  console.log('Record')
}
</script>
```

Comme vous pouvez le voir, cela nous permet de supprimer la section `style` et le code du script déclarant la référence `sentence`

Nous allons maintenant pouvoir nous concentrer sur le design de ce composant

## Design du composant

Nous allons implémenter le composant suivant.

![Design du composant de saisie](/article-0002/design-input-field-fr.png)

Avec son composant [`q-input`](https://quasar.dev/vue-components/input) Quasar a déjà fait quasiment tout le travail pour nous !

Voici comment nous allons modifier notre template html

```vue
<template>
  <q-input
    class="input-text q-mt-lg"
    v-model="sentence"
    type="textarea"
    :lines="2"
    autogrow
    hint="Input a word or a sentence"
    clearable
  >
    <template v-slot:after>
      <q-btn
        round
        dense
        flat
        icon="record_voice_over"
      >
        <q-tooltip>Listen the word or the sentence</q-tooltip>
      </q-btn>
    </template>
  </q-input>
</template>
```

## Synthèse vocale

Il nous reste maintenant faire prononcer ce qui a été saisi, c'est à dire le contenu de la référence sentence à notre device.

Nous allons l'api [SpeechSyntesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis). Pour simplifier l'usage de l'api nous allons utiliser un wrapper autour de celle-ci : [`Artyom.js`](https://sdkcarlos.github.io/sites/artyom.html) qui est disponible en tant que module npm.

Dans une console, installez le module :

```bash
npm i --save artyom.js
```

Puis ajouter le code d'initialisation dans la partie javascript du composant

```vue
<script setup>
import { ref } from 'vue'
import Artyom from 'artyom.js'

// Reference on the word or sentence to be pronounced
const sentence = ref('')

const artyom = new Artyom()
artyom.initialize({
  debug: false,
  continuous: false,
  listen: false,
  lang: 'de-DE'
})

async function speak () {
  artyom.say(sentence.value)
}
</script>
```

Notez que nous utilisons la langue allemande en initialisant Artyom avec : `lang: 'de-DE'`
Nous pourrions utiliser une autre langue comme :
- Le français : 'fr-FR'
- L'espagnol : 'es-ES'

Il ne reste plus qu'à ajouter notre fonction `speak` au bouton :

```vue{7}
<template v-slot:after>
  <q-btn
    round
    dense
    flat
    icon="record_voice_over"
    @click="speak"
  >
    <q-tooltip>Listen the word or the sentence</q-tooltip>
  </q-btn>
</template>
```

## Petites améliorations du composant

Nous allons apporter quelques améliorations à notre composant.

Tout d'abord, si l'api n'est pas disponible il ne faut pas faire apparaitre le bouton.
Pour cela nous allons tout simplement créer une référence qui va tester la disponibilité de l'api `isSpeachSyntesisAvailable` et conditionner la création du bouton à celle-ci :

```vue{8,16-18}
<script setup>
import { ref } from 'vue'
import Artyom from 'artyom.js'

// Reference on the word or sentence to be pronounced
const sentence = ref('')

const isSpeechSyntesisAvailable = ref(false)

const artyom = new Artyom()
artyom.initialize({
  debug: false,
  continuous: false,
  listen: false,
  lang: 'de-DE'
}).then(() => {
  isSpeechSyntesisAvailable.value = artyom.speechSupported()
})

async function speak () {
  artyom.say(sentence.value)
}
```

Dans l'implémentation nous attendons la fin de l'initialisation pour savoir si la synthèse vocale est disponible, il faut donc ne rendre disponible le bouton qu'une fois l'initialisation effectuée. Pour cela nous allons ajouter une référence `isArtyomReady` et une computed pour savoir si le bouton est `disable` `cannotSpeak` (on préfère utiliser `cannotSpeak` que `canSpeak` car nous allons l'associer à l'état `disable`, il vaut donc mieux qu'elle soit à `true` quand le bouton sera `disabled`)

```vue{2,7-11,21}
<script setup>
import { ref, computed } from 'vue'
import Artyom from 'artyom.js'

// Reference on the word or sentence to be pronounced
const sentence = ref('')
const isArtyomReady = ref(false)
const isSpeechSyntesisAvailable = ref(false)
const cannotSpeak = computed(() => {
  return !sentence.value || !isArtyomReady.value || !isSpeechSyntesisAvailable.value
})

const artyom = new Artyom()
artyom.initialize({
  debug: false,
  continuous: false,
  listen: false,
  lang: 'de-DE'
}).then(() => {
  isSpeechSyntesisAvailable.value = artyom.speechSupported()
  isArtyomReady.value = true
})

async function speak () {
  artyom.say(sentence.value)
}
```

Il faut prendre en compte ce point dans notre template

```vue{17}
<template>
  <q-input
    class="input-text q-mt-lg"
    v-model="sentence"
    type="textarea"
    :lines="2"
    autogrow
    hint="Input a word or a sentence"
    clearable
  >
    <template v-slot:after>
      <q-btn
        round
        dense
        flat
        icon="record_voice_over"
        :disable="cannotSpeak"
        @click="speak"
      >
        <q-tooltip>Listen the word or the sentence</q-tooltip>
      </q-btn>
    </template>
  </q-input>
</template>
```

Il ne reste plus qu'à interdire à l'utilisateur de cliquer deux fois sur le bouton. Pour cela nous allons utiliser une nouvelle ref `isSpeaking` pour savoir si la synthèse vocale est en cours ou non, et ajouter son état au calcul de la computed `cannotSpeak`

```vue{9,11,26-31}
<script setup>
import { ref, computed } from 'vue'
import Artyom from 'artyom.js'

// Reference on the word or sentence to be pronounced
const sentence = ref('')
const isArtyomReady = ref(false)
const isSpeechSyntesisAvailable = ref(false)
const isSpeaking = ref(false)
const cannotSpeak = computed(() => {
  return isSpeaking.value || !sentence.value || !isArtyomReady.value || !isSpeechSyntesisAvailable.value
})

const artyom = new Artyom()
artyom.initialize({
  debug: false,
  continuous: false,
  listen: false,
  lang: 'de-DE'
}).then(() => {
  isSpeechSyntesisAvailable.value = artyom.speechSupported()
  isArtyomReady.value = true
})

async function speak () {
  isSpeaking.value = true
  artyom.say(sentence.value, {
    onEnd: function () {
      isSpeaking.value = false
    }
  })
}
```

Nous avons maintenant une application qui permet de saisir une phrase et de l'écouter dans la langue choisie. Pour cela nous avons isoler un composant vue indépendant.

![L'application après la partie 1](/article-0002/app-after-part2.png){width=300}

## Que reste-t-il à faire ?

Dans une prochaine partie nous verrons comment acquérir l'audio,et obtenir un score via l'api [SpeechSuper](https://docs.speechsuper.com/#/)

- Partie 3 : Acquisition de l'audio et du score via l'API SpeechSuper
- Partie 4 : Packaging de l'application

## Conclusion

N'hésitez pas à commenter l'article ! La partie 3 arrive bientôt !
