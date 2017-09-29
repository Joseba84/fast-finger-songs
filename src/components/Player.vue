
<template>
<div>
  <div v-if="this.songs.length === 0" class="spinner"></div>
  <div v-if="this.songs.length > 0">
    <div class="wrapper">
      <span @click="togglePlayPause" class="play" :class="toggleActive"></span>
      <img :src="this.songs[this.currentSong].image" alt="">
    </div>
    <audio ref="player" @timeupdate="onTimeUpdateListener">
      <source :src="this.songs[this.currentSong].source" type="audio/mpeg">
    </audio>
    <div class="progress-bar" :style="{width: this.progress}"></div>
    <h2>{{ this.songs[this.currentSong].title }}</h2>
  </div>
</div>
</template>

<script>
import eventBus from '../eventBus';
const DURATION = 2;

export default {
  name: 'Player',
  props: ['songs'],
  data() {
    return {
      currentSong: 0,
      currentTime: 0,
      progress: 0,
      playing: false
    }
  },
  computed: {
    song() {
      this.$refs.player.play();
      return this.songs[this.currentSong];
    },
    player() {
      return this.$refs.player;
    },
    toggleActive() {
     return this.playing ? 'active' : '';
    }   
  },
  methods: {
    nextSong() {
      let trackSource = this.songs[this.currentSong++].source;
      this.player.load();
      this.player.play();
      eventBus.$emit('currentIndex',this.currentSong);
    },
    onTimeUpdateListener() {
      this.currentTime = this.$refs.player.currentTime;
      this.progress =(this.currentTime /  this.$refs.player.duration) * 100 + "%";
      if(this.progress === '100%') {
        this.nextSong();
      }
    },
    togglePlayPause() {
      if(this.playing) {
        this.pause();
      }else{
        this.play();
      }
    },
    play() {
      this.$refs.player.play();
      this.playing = true;
    },
    pause() {
      this.$refs.player.pause();
      this.playing = false;
    }
  }
}
</script>
