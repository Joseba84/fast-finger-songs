
<template>
  <div>
    <span>Progress: {{ (progress * 100) }}%</span>
    <button @click="togglePlayback">{{ playing ? 'Pause' : 'Play' }}</button>
    <button @click="stop">Stop</button>
  </div>
</template>
<script>
  import VueHowler from 'vue-howler/dist/vue-howler.esm.js';
 
  export default {
    mixins: [VueHowler]
  }
</script>