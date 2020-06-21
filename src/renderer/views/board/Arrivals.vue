<template>
  <Board
    type="arrivals"
    :services="arrivals"
    :error="error"
    :page="page"
  />
</template>

<script>
import { ipcRenderer } from 'electron';
import Board from '@components/Board';

export default {
  components: { Board },
  props: {
    location: {
      type: String,
      required: true,
      default: '',
    },
    page: {
      type: Number,
      required: false,
      default: 1,
    },
  },

  data: () => ({
    arrivals: [],
    error: null,
  }),

  mounted() {
    const refreshRate = 30000;

    this.requestArrivals();

    const syncRefreshInterval = setInterval(() => {
      if (Date.now() % refreshRate <= 500) {
        this.requestArrivals();
        setInterval(this.requestArrivals, refreshRate);
        clearInterval(syncRefreshInterval);
      }
    }, 500);

    ipcRenderer.on('arrivals', this.receiveArrivals);
  },

  methods: {
    requestArrivals() {
      ipcRenderer.send('arrivals', this.location);
    },
    receiveArrivals(e, services) {
      this.error = null;
      if (services.error) {
        this.error = services.error;
      } else {
        this.arrivals = services;
      }
    },
  },
};
</script>
