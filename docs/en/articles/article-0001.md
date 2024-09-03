The purpose of this tutorial is to create an application to control the user's pronunciation.

To follow it, you must have knowledge of javascript and more ideally Vue.js 3.

## The idea

I recently decided to get back to German. The main difficulty I encounter in this language is pronouncing it correctly. Usually I listen to an example, record myself repeating it and listen to myself again. It's a complicated process and I must admit I don't have a very good ear.

Based on this observation, I wondered if there was an App or an API that could tell me if I was pronouncing a word or a sentence correctly in German! After some investigations and great discoveries, I wanted to code my own App to solve my problem.

Here's how I did it!

## Available APIs

After some research, I was able to find Apps that solved my problem. But overall, pronunciation validation was often just an additional function of a paid application (or one that worked with a subscription). I then decided to look for APIs.

Here is the list of APIs that do the job :

- [Google Cloud Speech-to-Text API](https://cloud.google.com/speech-to-text/docs)
- [Microsoft Azure Speech Service](https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/)
- [iSpeech Pronunciation](https://www.ispeech.org/api/#pronunciation)
- [Speechmatics](https://docs.speechmatics.com)
- [Speechace](https://www.speechace.com/docs)
- [Elsa Now](https://api-external-doc.elsanow.co/intro)
- [SpeechSuper](https://docs.speechsuper.com/#/)

These APIs are paid but generally allow you to get 2 weeks of access to test and experiment.

Since I wanted to check my pronunciation of German, I chose to test with the SpeechSuper API because it supports several languages ​​including German. Later in the tutorial we will try the Speechace API to demonstrate how easy it is to switch from one API to another depending on your needs.

## Definition of the application's ergonomics

The goal is to implement a simple App that allows you to enter a word, record your voice, send the audio recording to the API and display your score.

This is what the application will look like:

![App design](/article-0001/application-quasar-gen.png)

So we will create an application that will present a text field allowing the entry of a word or a sentence. A button will allow you to listen to it.
We then have a button to record our voice, this one will change style when it is in recording mode. Just click on it to stop and send to the API to obtain a pronunciation score.
Once the score is obtained, it is displayed as a tile with a color representing our score, from red to green to orange.

## Initialization of the application

The ideal would be to be able to deploy the App as a webapp, but also as a native Android application. For this reason we will use [Quasar](https://quasar.dev/).

### The Quasar framework

Quasar is an open-source Vue.js framework for developing applications with a single codebase. They can be deployed on the web (SPA, PWA, SSR), as a mobile application (Android, iOS) or as a Desktop application (MacOs, Windows, Linux).

### Preparation

If this is not already the case, you need to install [NodeJS](https://nodejs.org/en/download/package-manager/current). The better is to use [volta](https://volta.sh/) as it will allow you to use differents versions of NodeJs depending on your projects.

We will start by initializing our project with the Quasar scaffolding tool.

```console
npm i -g @quasar/cli
npm init quasar
```

The `cli` will ask us several questions, choose the following options :

- App with Quasar CLI
- Project folder : learn2speak
- Quasar v2
- Javascript
- Quasar App with Vite
- Package name : learn2speak
- Project product name : Learn to speak
- Project description : Assess your pronounciation
- Author : yourself
- CSS preprocessor : Sass with SCSS syntax
- Features needed :
  - ESLint
  - Axios
- ESLint preset : Standard
- Install project dependencies : Yes, use npm

Once the command is executed, you can enter the directory and serve the application locally:

```console
cd learn2speak
npm run dev
```

Your default browser should open the page at the following address [http://localhost:9000](http://localhost:9000)


![Quasar App skeleton](/article-0001/design-app-en.png)

### Modification of the proposed skeleton to obtain the targeted ergonomics

The example application is available, we will remove the elements we do not need. To do this we will open the source code in VSCode (you can of course use another editor)


```console
code .
```

#### Layout modification

Quasar provides us with the notion of `Layout` and then of page included in the latter. The pages and the layout are chosen via the router. For this tutorial, we do not need to know these notions, but you can learn them here: [Quasar layout](https://quasar.dev/layout/routing-with-layouts-and-pages)

We do not need drawer, at least not for now so we will delete it from the `src/layouts/MainLayout.vue` file. To do this, delete the section of the `<template>` included between the `<drawer>...</drawer>` tags, then we will modify the header to display the icon then the name of the application, this gives us the following code for the template:


```vue
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

We can then remove the entire script part and replace it with the following code:


```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  setup () {
  }
})
</script>
```

We don't need more for the layout part because our application will define only one page.

#### The main page

The implementation of the main page is in the file: `src/pages/IndexPage.vue`

this is the main page where we will position our text field and the save button.

For this file, we simply remove the Quasar logo from the template (the `<img>` tag) and modify the script part to use the vueJS 3 composition api, so that the source looks like the following file:


```vue
<template>
  <q-page class="flex flex-center">

  </q-page>
</template>

<script setup>

</script>
```

We will now add the text field using the Quasar component [QInput](https://quasar.dev/vue-components/input)

To do this we add the `q-input` component to the page template:

```vue
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

You can see that the text field is displayed in the center of the screen, this is due to the Quasar `flex` and `flex-center` classes. These classes are defined by [Quasar: Flexbox](https://quasar.dev/layout/grid/introduction-to-flexbox). We will fix this by placing the text field at the top of the screen, we will also take advantage of this to style the component.

Quasar even provides us with a [Flex Playground](https://quasar.dev/layout/grid/flex-playground) to experiment and find the classes to put.

```vue
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

As you can see, we have defined a `sentence` reference in the script part to store the value entered by the user. It is associated via the `v-model` directive to the `q-input` component

We will finish this first part by adding the button allowing the recording of our pronunciation of the word or sentence. For this we will simply use the [`q-button`](https://quasar.dev/vue-components/button) component of Quasar and position it after our text field.


```vue
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

Note that we added the `q-mt-lg` class to air out the interface a bit by leaving some space above each component. You can refer to the Quasar documentation on [spacing](https://quasar.dev/style/spacing).

The application will look like:

![The App after part 1](/article-0001/app-after-part1.png)

## What will we do next

We have therefore managed to obtain the skeleton of our application.

In a future part we will see how to acquire the audio, then how to obtain a score via the [SpeechSuper](https://docs.speechsuper.com/#/) API
- Part 2: Enter the sentence and listen an example
- Part 3: Acquiring the audio and get the score via the SpeechSuper API
- Part 4: Packaging the application

## Conclusion

Don't hesitate on comments the post ! Part 2 will follow soon !
