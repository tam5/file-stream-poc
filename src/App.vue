<template>
  <div id="app" class="h-full container mx-auto">
    <Uploader />
    <Monitors class="mt-24" />
  </div>
</template>

<script>
import Uploader from './components/Uploader.vue'
import Monitors from './components/Monitors.vue'

export default {
  name: 'app',
  components: {
    Uploader,
    Monitors
  }
}
</script>

<style lang="scss">

 html, body {
     height: 100%;
 }

 #app {
     font-family: 'Avenir', Helvetica, Arial, sans-serif;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
     text-align: center;
     color: #2c3e50;
 }
</style>
