<template>
  <v-app id="app">
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {},
  data: () => ({
  }),
};
</script>
<style>
  #app{
    background: rgba(0,0,0,0);
  }
</style>
