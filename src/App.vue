<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld
    msg="Welcome to Your Vue.js + TypeScript App / Running Vue CLI inside a container!"
  /> -->
  <!-- <link rel="stylesheeet" href="/assets/image-selector/image-selector.css" />
  <link rel="stylesheeet" href="/assets/image-selector/image-selector.js" /> -->
  <MainPage />
</template>

<script lang="ts">
import { defineComponent } from "vue";
//import HelloWorld from "./components/HelloWorld.vue";
import MainPage from "./components/MainPage.vue";

export default defineComponent({
  name: "App",
  components: {
    MainPage,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

a[target="_blank"]:hover {
  background-color: rgb(233, 233, 233);
}

a[target="_blank"] {
  padding: 0.3rem;
  border-radius: 0.5rem;
}
</style>
