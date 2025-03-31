<template>
  <div id="app">
    <LetterForm />
  </div>
</template>

<script>
import LetterForm from './components/LetterForm.vue'

export default {
  name: 'App',
  components: {
    LetterForm
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
