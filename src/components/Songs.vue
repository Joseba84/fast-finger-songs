<template>
<section>
    <h1>Artistas</h1>
    <article class="grid">
        <div v-for="item in artists" class="card">
            <p>{{ item.name }}</p>
            <img :src="item.images[0].url" :alt="item.name">
        </div>
    </article>
</section>
   
</template>

<script>
import axios from 'axios';
const apiConfig = require('../config.js');

export default {
    name: 'songs',
    mounted() {
        this.getApiData();
    },
    data() {
        return {
            artists: [],
        }
    },
    methods: {
        getApiData() {
            const AT = "Bearer " + apiConfig;
            let authOptions = {
                headers: {
                    'Authorization': AT,
                }
            };
            axios.get('https://api.spotify.com/v1/artists/2wY79sveU1sp5g7SokKOiI/related-artists', authOptions)
                .then((response) => {
                    console.log(response.data.artists)
                    this.artists = response.data.artists;
                })
                .catch((error) => {
                    console.log(error);
                });

        }
    }
}
</script>
<style lang="scss" scoped>
ul {
    list-style: none;
    padding: 0;
    margin:0;
}
.card {
    flex: auto 1 1;

    & img {
        max-width: 200px;
    }
}
.grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}
</style>
