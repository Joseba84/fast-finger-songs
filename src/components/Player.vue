
<template>
  <div v-if="songs">
    <h2>{{ songs[this.currentSongIndex].title }}</h2>
    <div class="wrapper">
      <span @click="togglePlayback" class="play" :class="toggleActive"></span>
      <img v-if="songs[this.currentSongIndex].image" :src="songs[this.currentSongIndex].image" alt="">
    </div>
    <div :style="{width:percentage}" class="progress-bar"></div>
  </div>
</template>

<script>
import vueHowler from 'vue-howler';
import eventBus from '../eventBus';

const DURATION = 2;

export default {
  name: 'Player',
  props:['songs'],
  mixins: [vueHowler],
  data() {
    return {
      currentSong: 0,
    }
  },
  computed: {
    percentage() {
      if (this.seek >= DURATION) {
      console.log('NEXT');
      this.stop();
      this.emitMethod();
      
    }
      return this.progress * 100 + '%';
    },
    toggleActive() {
      return this.playing ? '' : 'active';
    },
    currentSongIndex() {
      return this.currentSong;
    }
  },
  created() {
   
  },
  methods: {
    emitMethod () {
      let increment = this.currentSongIndex + 1;
      eventBus.$emit('changeSong', increment);
    }
  }
}
</script>
