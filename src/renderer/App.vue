<template>
  <div
    id="app"
    class="App"
    :class="{
      'App--Main': routes.includes('/main'),
      'App--Board': routes.includes('/board'),
    }"
  >
    <router-view />
  </div>
</template>

<script>

export default {
  data: () => ({
    view: 'main',
    viewData: {},
  }),

  computed: {
    routes() {
      return this.$route.matched.map((m) => m.path);
    },
  },
};

</script>

<style lang="scss" src="@renderer/styles/app.scss"/>
