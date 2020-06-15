<template>
  <div class="MainView">
    <div
      id="nav"
      class="MainView__Navigation Navigation"
    >
      <div class="Navigation__Top">
        <NavigationItem
          to="/main/"
          label="New Board"
          icon="plus"
        />
      </div>
      <div class="Navigation__Bottom">
        <NavigationItem
          to="/main/settings"
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
