<template>
    <section>
        <article class="grid">
            <div>
                <h1>{{ playlist.title }}</h1>
                <img :src="playlist.picture_xl" :alt="playlist.title" class="playlist-image">
            </div>

            <div class="card" v-if="firstSong">
                <h2>{{ firstSong.title }}</h2>
                <div class="wrapper">
                    <span class="play"></span>
                    <img v-if="firstSong.image" :src="firstSong.image" alt="">
                </div>
<<<<<<< HEAD
                <p>{{ firstSong.source }}</p>
                <div v-if="firstSong.source != ''">
                    <player :sources="firstSong.source"></player>
=======
                <p>{{ formatedSongs[0].source }}</p>
                <div>
                    <player :sources="formatedSongs[0].source" songs="songs"></player>
>>>>>>> 5c207bdb612232e15230dc73043df1d9458d2733
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
            playlist: ""
        }
    },
<<<<<<< HEAD
=======
    
    components: {
        Player
    },

>>>>>>> 5c207bdb612232e15230dc73043df1d9458d2733
    created() {
        this.getPlaylist();
    },
    methods: {
        getPlaylist() {

            let randomNumber = Math.floor((Math.random() * 9) + 0);
            let url = 'http://api.deezer.com/chart';

            axios.get(url)
                .then(res => {
                    this.playlist = res.data.playlists.data[randomNumber];
                    this.getSongs();
                    //console.log(this.playlist);
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
                    //console.log(res.data.tracks.data);
                })
                .catch((error) => console.log(error));
        }
    },

    computed: {
        formatedSongs() {

            let formatedSongs = [];

            for (var key in this.songs) {
                formatedSongs[key] = {
                    title: this.songs[key].title,
                    source: [this.songs[key].preview],
                    image: this.songs[key].album.cover_big
                }
            }
            return formatedSongs;
        },
        firstSong() {
            return this.formatedSongs[0];
        }
    }
}
</script>
