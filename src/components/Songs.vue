<template>
    <section>
        <article class="grid">
            <div class="card" v-if="formatedSongs">
                <div v-if="currentSongSource != undefined">
                    <player :songs="formatedSongs"></player>
                </div>
            </div>
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

export default {
    name: 'songs',
    components: {
        Player
    },
    data() {
        return {
            songs: [],
            playlist: ""
        }
    },
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
        currentSongSource() {
            var index = 0;
            var source = this.formatedSongs[0].source;
            return source;
        }
    }
}
</script>
