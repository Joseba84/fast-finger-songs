
<template>
  <div>
    <button @click="togglePlayback">{{ playing ? 'Pause' : 'Play' }}</button>
    <div :style="{width:percentage}" class="progress-bar"></div>
  </div>
</template>
<script>
import VueHowler from 'vue-howler/dist/vue-howler.esm.js';

export default {
  mixins: [VueHowler],
  computed: {
    percentage() {
      return this.progress * 100 + '%';
    }
  }
}
</script>
