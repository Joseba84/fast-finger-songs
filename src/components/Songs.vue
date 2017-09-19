<template>
    <section>
        <article class="grid">
            <div>
            <h1>{{ playlist.title }}</h1>
            <img :src="playlist.picture_xl" :alt="playlist.title" class="playlist-image">
            </div>
            
            <div class="card">
                <h2>{{ formatedSongs[1].title }}</h2> 
                <img :src="formatedSongs[1].image" :alt="formatedSongs[1].title">
                <p>{{ formatedSongs[1].source }}</p>
                <div>
                    <player v-if="formatedSongs[1].source != ''" :sources="formatedSongs[0].source"></player>
                </div>
            </div>
        </article>
    </section>
</template>

<script>
import axios from 'axios';
import Player from './Player.vue'

export default {
    name: 'songs',
    components: {
        Player
    },

    data() {
        return {
            songs: [],
            playlist: "",
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
<style lang="scss">
h1 { font-size: 1.5rem; }
ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.text-center {
    text-align: center;
}

.card {
    & img {
        max-width: 200px;
    }
}

.grid {
    display: flex;
    flex-direction: column;
}

.playlist-image {
    max-width: 30%;
}
</style>
