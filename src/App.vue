<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background-color: #f3f4f6;
}

/* Add these styles to handle formatted content */
.content-wrapper {
  white-space: pre-wrap;
}

.content-wrapper strong,
.content-wrapper b {
  font-weight: 700;
}

.content-wrapper p {
  margin-bottom: 1em;
}
</style>
