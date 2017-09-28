
<template>
  <div v-if="this.songs.length > 0">
    <div class="wrapper">
      <!--<span class="play"></span>-->
      <img :src="this.songs[this.currentSong].image" alt="">
    </div>
    <audio ref="player" @timeupdate="onTimeUpdateListener">
      <source :src="this.songs[this.currentSong].source" type="audio/mpeg">
    </audio>
    <div class="progress-bar" :style="{width: this.progress}"></div>
    <h2>{{ this.songs[this.currentSong].title }}</h2>
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
      currentTime: 0,
      progress: 0
    }
  },
  created() {
    setTimeout(()=>{
      this.$refs.player.play();
    },1000)
  },
  computed: {
    song() {
      return this.songs[this.currentSong];
    },
    player() {
      return this.$refs.player;
    }   
  },
  methods: {
    nextSong() {
      let trackSource = this.songs[this.currentSong++].source;
      trackSource === "" ? this.songs[this.currentSong + 2].source : trackSource;
      this.player.load();
      this.player.play();
    },
    onTimeUpdateListener() {
      this.currentTime = this.$refs.player.currentTime;
      this.progress =(this.currentTime /  this.$refs.player.duration) * 100 + "%";
      if(this.progress === '100%') {
        this.nextSong();
      }
    }
  }
}
</script>
