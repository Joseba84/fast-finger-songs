<template>
    <div class="roller">
        <ul>
            <li v-for="item in songs" :key="item.key" :class="getActive(item.key)">
                <img :src="item.image" alt="">
                <div class="content">
                    <p>{{ item.title }}</p>
                    <p class="album">{{ item.album }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import eventBus from '../eventBus';

export default {
    name: 'Roller',
    props: ['songs'],
    data() {
        return {
            active: 0,
            nextTwo: 3
        }
    },
    mounted() {
        eventBus.$on('currentIndex', (i) => {
            this.active = i;
            this.nextTwo = i + 3;
        });
    },
    methods: {
        getActive(item) {
            let classType = '';
            if (item == this.active) {
                classType = 'current active';
            } else if (item >= this.active && item < this.nextTwo) {
                classType = 'active';
            }
            return classType;
        }
    }
}

</script>


