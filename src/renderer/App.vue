<template>
  <div
    id="app"
    class="App"
    :class="{
      'App--Main': routes.includes('/main'),
      'App--Board': routes.includes('/board'),
    }"
  >
    <router-view/>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  data: () => ({
    view: 'main',
    viewData: {},
  }),

  mounted() {
    ipcRenderer.on('get-settings', (e, settings) => {
      this.$store.commit('settings/setSettings', settings);
    });
    ipcRenderer.send('get-settings');
  },

  computed: {
    routes() {
      return this.$route.matched.map((m) => m.path);
    },
  },
};

</script>

<style lang="scss" src="@renderer/styles/app.scss"/>
