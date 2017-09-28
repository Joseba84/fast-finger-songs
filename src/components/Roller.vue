<template>
  <div class="roller" >
                <ul>
                    <li v-for="item in songs" :key="item.key" :class="getActive(item.key)" >
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
    name:'Roller',
    props: ['songs'],
    data() {
        return {
           active: 0
        }
    },
    mounted() {
        eventBus.$on('currentIndex',(i) => {
            this.active = i;
        });    
    },
    methods: {
        getActive(item) {
            return item == this.active ? 'active' : '';
        }
    }
}

</script>


