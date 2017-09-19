<template>
  <div class="hello">
    <h1>Fast Finger Songs</h1>
    <p>Para aquellos que padecen el sindrome del "Fast Finger".</p>
    <p> Y no pueden agunatar más de 30 segundos escuchando una canción... siempre con el dedito en el botón de siguiente...</p>
    <router-link to="/songs"><a>Go to songs!!!Fast Faaaaasstt!!</a></router-link>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
     
    }
  }
}
</script>
<style lang="scss">
.hello {
  text-align: center;
}

.container {
  margin: 50px 0;
}
</style>

