
<template>
  <div v-if="songs">
    <div class="wrapper">
      <span class="play"></span>
      <img v-if="songs[this.currentSong].image" :src="songs[this.currentSong].image" alt="">
    </div>
    <audio v-if="track != undefined" ref="player" controls @timeupdate="onTimeUpdateListener">
      <source :src="track" type="audio/mpeg">
    </audio>
    <div class="progress-bar" :style="{width: this.progress}"></div>
    <button @click="nextSong">NEXT</button>
    <h2>{{ songs[this.currentSong].title }}</h2>
  </div>
</template>

<script>

const DURATION = 2;

export default {
  name: 'Player',
  props: ['songs'],
  data() {
    return {
      track: this.songs[0].source,
      currentSong: 0,
      currentTime: 0,
      progress: 0
    }
  },
  mounted() {
    this.$watch('track', () => {
      this.player.load();
      this.player.play();
    });
  },
  computed: {
    song() {
      return this.songs[this.currentSong].source;
    },
    player() {
      return this.$refs.player;
    }   
  },
  methods: {
    nextSong() {
      let trackSource = this.songs[this.currentSong++].source
      this.track = trackSource === "" ? this.songs[this.currentSong + 2].source : trackSource;
    },
    onTimeUpdateListener() {
      this.currentTime = this.$refs.player.currentTime;
      this.progress =(this.currentTime /  this.$refs.player.duration) * 100 + "%";
      }
  }
}
</script>
