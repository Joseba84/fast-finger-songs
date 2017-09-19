<template>
    <section>
        <article class="grid">
            <!--<div v-for="song in formatedSongs" v-if="songs" class="card">  v-for="song in songs" 
                    <h2>{{ song.title }}</h2>
                        <p>{{ song.preview }}</p>
                      <div v-if="song.source">
                        <player :sources="song.source"></player>
                      </div>
                </div> -->
        </article>
    </section>
</template>

<script>
import axios from 'axios';
import Player from './Player.vue'

const CORS = "https://cors-anywhere.herokuapp.com/";

export default {
    name: 'songs',
    components: {
        Player
    },

    data() {
        return {
            playlist: [],
            songs: []
        }
    },

    created() {
        this.getRandomList();
        //this.getApiData();
    },

    methods: {
        getRandomList() {

            let randomNumber = Math.floor((Math.random() * 9) + 0);
            let url = 'http://api.deezer.com/chart';
           
            let options = {
                method: 'GET',
                mode: 'no-cors',
                cache: 'default'
            }
            fetch(url, options)
                .then(function(response) {
                    if(response.ok) {
                        console.log(response.json());
                        return response.json();
                    }
                })
                .then(function(json) {
                    console.log(json);
                });
            /* axios.get(url)
             .then((response) => {
                 this.playlist = response.data.playlists.data[randomNumber].tracklist;
             })
             .catch((error) =>  console.log(error));*/
        },
        getApiData() {

            let url = this.playlist;

            axios.get(url)
                .then((response) => {
                    this.songs = response.data.data;
                    console.log(response.data);
                })
                .catch((error) => console.log(error));
        }
    },

    computed: {
        formatedSongs() {
            var formatedSongs = [];
            for (var key in this.songs) {
                formatedSongs[key] = {
                    title: this.songs[key].title,
                    source: [this.songs[key].preview]
                }
            }
            return formatedSongs;
        }
    }
}
</script>
<style lang="scss" scoped>
ul {
    list-style: none;
    padding: 0;
    margin: 0;
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
</style>
