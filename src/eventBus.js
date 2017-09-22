import Vue from 'vue';
const eventBus = new Vue({
    data() {
        return {
            currentSong: 0
        }
    }
});
export default eventBus;