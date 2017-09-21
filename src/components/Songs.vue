<template>
    <section>
        <article class="grid">
            <div>
           <h1>{{ playlist.title }}</h1>
            <img :src="playlist.picture_xl" :alt="playlist.title" class="playlist-image">
            </div>
            
            <div class="card">
                <h2></h2> 
                <div class="wrapper">
                      <span class="play"></span>
                <img :src="formatedSongs[0].image" alt="">
                </div>
                <p>{{ formatedSongs[0].source }}</p>
                <div>
                    <player :sources="formatedSongs[0].source" songs="songs"></player>
                </div>
            </div>
        </article>
    </section>
</template>

<script>
import axios from 'axios';
import Player from './Player.vue';

export default {
    name: 'songs',
    props: ['songs'],
    data() {
        return {
            songs: [],
            playlist: "",
        }
    },
    
    components: {
        Player
    },

    created() {
        this.getPlaylist();
        eventBus.$on('duration', (duration) => {
            console.log(duration);
        });
    },

    methods: {
        getPlaylist() {

            let randomNumber = Math.floor((Math.random() * 9) + 0);
            let url = 'http://api.deezer.com/chart';

            axios.get(url)
                .then(res => {
                    this.playlist = res.data.playlists.data[randomNumber];
                    this.getSongs();
                    console.log(this.playlist);
                }).catch(error => {
                    console.log('erro', error);
                })
                
        },
        getSongs() {

            let playlistId = this.playlist.id;
            let url = `https://api.deezer.com/playlist/${playlistId}`;
            
            axios.get(url)
                .then((res) => {
                    this.songs = res.data.tracks.data;
                    console.log(res.data.tracks.data);
                })
                .catch((error) => console.log(error));
        }
    },

    computed: {
        formatedSongs() {
            var formatedSongs = [];
            for (var key in this.songs) {
                formatedSongs[key] = {
                    title: this.songs[key].title.replace(/'/g, ''),
                    source: [this.songs[key].preview],
                    image: this.songs[key].album.cover_big
                }
            }
            return formatedSongs;
        }
    }
}
</script>
