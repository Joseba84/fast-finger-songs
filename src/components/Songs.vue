<template>
    <section>
        <article class="grid">
            <div class="card" v-if="formatedSongs">
                <div>
                    <player :songs="formatedSongs"></player>
                </div>
            </div>
            <roller :songs="formatedSongs"></roller>
            <aside class="playlist">
                <h2>Playlist</h2>
                <img :src="playlist.picture_xl" :alt="playlist.title" class="playlist-image">
                <h3>{{ playlist.title }}</h3>
            </aside>
        </article>
    </section>
</template>

<script>
import axios from 'axios';
import Player from './Player.vue';
import Roller from './Roller.vue';

export default {
    name: 'songs',
    components: {
        Player,
        Roller
    },
    data() {
        return {
            songs: [],
            playlist: ""
        }
    },
    mounted() {
        this.getPlaylist();
    },
    methods: {
        getPlaylist() {

            let randomNumber = Math.floor((Math.random() * 9) + 0);
            let url = 'https://cors-anywhere.herokuapp.com/https://api.deezer.com/chart';

            axios.get(url)
                .then(res => {
                    this.playlist = res.data.playlists.data[randomNumber];
                    this.getSongs();
                }).catch(error => {
                    console.log('erro', error);
                })
        },
        getSongs() {

            let playlistId = this.playlist.id;
            let url = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/playlist/${playlistId}`;

            axios.get(url)
                .then((res) => {
                    this.songs = res.data.tracks.data;
                })
                .catch((error) => console.log(error));
        }
    },

    computed: {
        formatedSongs() {
            let formatedSongs = [];
            let i = 0;
            for (var index in this.songs) {
                if (this.songs[index].title !== '' && this.songs[index].album.cover_big !== '' && this.songs[index].preview !== '' && this.songs[index].album.title !== '') {
                    formatedSongs[i] = {
                        title: this.songs[index].title,
                        source: this.songs[index].preview,
                        image: this.songs[index].album.cover_big,
                        album: this.songs[index].album.title,
                        key: index
                    }
                    i++;
                }
            }

            return formatedSongs;
        }
    }
}
</script>
