
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
    created() {
      console.log(this.duration);
      eventBus.$emit('duration', duration);
    },
    computed: {
      percentage() {
        return this.progress * 100 + '%';
      }
    }
  }
</script>
