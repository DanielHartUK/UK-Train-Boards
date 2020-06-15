<template>
  <router-view
    v-if="boardData"
    v-bind="boardData"
    class="BoardView"
  />
  <p v-else>Loading...</p>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  data: () => ({
    boardData: null,
  }),

  beforeCreate() {
    ipcRenderer.once('board-data', (e, data) => {
      this.boardData = data;
    });
  },
};
</script>
