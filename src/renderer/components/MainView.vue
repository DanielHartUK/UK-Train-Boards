<template>
  <div class="MainView">
    <div
      id="nav"
      class="MainView__Navigation Navigation"
    >
      <div class="Navigation__Top">
        <NavigationItem
          to="/"
          label="New Board"
          icon="plus"
        />
        <NavigationItem
          to="/favorites"
          label="Favorites"
          icon="heart"
        />
      </div>
      <div class="Navigation__Bottom">
        <NavigationItem
          to="/settings"
          label="Settings"
          icon="cog"
        />
      </div>
    </div>
    <router-view class="MainView__Body"/>
  </div>
</template>

<script>
import NavigationItem from '@components/NavigationItem.vue';

export default {
  components: { NavigationItem },
};
</script>

<style lang="scss">
  @use '@renderer/styles/main-view.scss';
</style>
