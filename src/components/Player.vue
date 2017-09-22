
<template>
  <div v-if="songs">
    <h2>{{ songs[this.currentSong].title }}</h2>
    <div class="wrapper">
      <span @click="togglePlay" class="play" :class="toggleActive"></span>
      <img v-if="songs[this.currentSong].image" :src="songs[this.currentSong].image" alt="">
    </div>
    {{ duration() }}
    {{ songSeek }}
    <div :style="{width:percentage}" class="progress-bar"></div>
  </div>
</template>

<script>
import {Howler} from 'howler';
const DURATION = 2;

export default {
  name: 'Player',
  props: ['songs'],
  data() {
    return {
      currentSong: 0,
      sound: null,
    }
  },
  created() {
    this.sound = new Howl({
      src:[this.songs[this.currentSong].source]  
    });
  },
  computed: {
    percentage() {
      return this.progress * 100 + '%';
    },
    toggleActive() {
      return this.playing ? '' : 'active';
    },
    songSeek() {
      this.sound.on('onplay', function(){
      return this.duration();
      });
      /*if (seekRounded >= DURATION) {
        console.log('NEXT');
        this.stop();
      }
      return seekRounded;*/
    }
  },
  methods: {
    play() {
      this.sound.play();
    },
    stop() {
      this.sound.stop();
    },
    pause() {
      this.sound.pause();
    },
    duration() {
      return this.sound.duration();
    },
    togglePlay() {
      let playing = this.sound.playing(this.sound);
      if(playing) {
        this.pause();
      }else {
        this.play();
      }
    }
  }
}
</script>
