
<template>
  <div v-if="songs">
    <div class="wrapper">
      <span  class="play"></span>
      <img v-if="songs[this.currentSong].image" :src="songs[this.currentSong].image" alt="">
    </div>
    <audio ref="player" controls>
      <source :src="track" type="audio/mpeg">
    </audio>
    <button @click="nextSong">NEXT</button>
    <h2>{{ songs[this.currentSong].title }}</h2>
    <!--<div :style="{width:percentage}" class="progress-bar"></div>-->
   {{ currentSong }} <br>
   {{ track }}
  </div>
</template>

<script>

const DURATION = 2;

export default {
  name: 'Player',
  props: ['songs'],
  data() {
    return {
      currentSong: 0,
      track: this.songs[0].source
      }
  },
  mounted() {
     this.$watch('track', () => {
                this.$refs.player.load();
                this.$refs.player.play();
            });
  },
  computed: {
    song() {
      return this.songs[this.currentSong].source
    }
  },
  methods: {
    nextSong() {
      let trackSource = this.songs[this.currentSong++].source
      this.track = trackSource === "" ? this.songs[this.currentSong+2].source: trackSource;
    }
  }
}
</script>
