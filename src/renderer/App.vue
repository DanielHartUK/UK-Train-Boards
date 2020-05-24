<template>
  <div id="app">
    <MainView v-if="view === 'main'"/>
    <BoardView
      v-if="view === 'board'"
      :board-data="viewData"
    />
  </div>
</template>

<script>

import { ipcRenderer } from 'electron';
import MainView from '@components/MainView.vue';
import BoardView from '@components/BoardView.vue';

export default {
  components: {
    MainView,
    BoardView,
  },

  data: () => ({
    view: 'main',
    viewData: {},
  }),

  beforeCreate() {
    ipcRenderer.once('board-data', (e, data) => {
      this.view = 'board';
      this.viewData = data;
    });
  },
};

</script>
