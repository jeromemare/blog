---
title: How to create a pronunciation assessment App (Part 2)
---

The purpose of this tutorial is to create an application to control the user's pronunciation.

To follow it, you must have knowledge of javascript and more ideally Vue.js 3.

## What we are going to do

In [the previous article](/articles/article-0001) we set up the skeleton of the application with the [Quasar](https://quasar.dev/) framework based on [VueJS](https://vuejs.org/)

We will now set up the first of the two main components of the application:
- The component responsible for entering the word or sentence to be pronounced. The latter will be able to read the word to allow the user to listen to what he must pronounce
- The voice acquisition component. This is a button to record his voice and then send the recording to the API.

We will start by creating the skeleton of the component and positioning it in the main page of the application.

To do this, create the `WordInputField.vue` file in the `/src/components` directory. You can take this opportunity to delete the `EssentialLink.vue` file which is no longer useful.

## Creating a vue component

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

Once this is done we can use the component in the main page: `/src/pages/IndexPage.vue`

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

As you can see, this allows us to remove the `style` section and the script code declaring the `sentence` reference

We will now be able to focus on the design of this component

## Component design

We will implement the following component.

![Design of the input component](/article-0002/design-input-field-en.png)

With its [`q-input`](https://quasar.dev/vue-components/input) component, Quasar has already done almost all the work for us!

Here is how we will modify our html template

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

## Speech synthesis

Now we have to pronounce what was entered, that is to say the content of the sentence reference to our device.

We will use the [SpeechSyntesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) API. To simplify the use of the API we will use a wrapper around it: [`Artyom.js`](https://sdkcarlos.github.io/sites/artyom.html) which is available as an npm module.

In a console, install the module:

```bash
npm i --save artyom.js
```

Then add the initialization code in the javascript part of the component

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

Note that we are using the German language by initializing Artyom with: `lang: 'de-DE'`
We could use another language like:
- French: 'fr-FR'
- Spanish: 'es-ES'

All that's left is to add our `speak` function to the button:

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

## Small improvements to the component

We will make some improvements to our component.

First of all, if the API is not available, the button should not appear.
To do this, we will simply create a reference that will test the availability of the API `isSpeachSyntesisAvailable` and condition the creation of the button on this:

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

In the implementation we wait for the end of the initialization to know if the speech synthesis is available, so we must only make the button available once the initialization is done. To do this we will add an `isArtyomReady` reference and a computed to know if the button is `disable` `cannotSpeak` (we prefer to use `cannotSpeak` than `canSpeak` because we will associate it with the `disable` state, so it is better that it is `true` when the button is `disabled`)

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
</script>
```

This point must be taken into account in our template

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

All that remains is to prohibit the user from clicking the button twice. For this we will use a new ref `isSpeaking` to know if the speech synthesis is in progress or not, and add its state to the calculation of the computed `cannotSpeak`

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
</script>
```

We now have an application that allows you to enter a sentence and listen to it in the chosen language. For this we have isolated an independent view component.

![The application after part 1](/article-0002/app-after-part2.png){width=300}

## What is left to do?

In a future part we will see how to acquire the audio, and obtain a score via the [SpeechSuper](https://docs.speechsuper.com/#/) API

- Part 3: Acquiring the audio and the score via the SpeechSuper API
- Part 4: Packaging the application

## Conclusion

Feel free to comment on the article! Part 3 is coming soon!
