<template>
  <Board
    type="departures"
    :services="departures"
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
    departures: [],
    error: null,
  }),

  mounted() {
    const refreshRate = 30000;

    this.requestDepartures();

    const syncRefreshInterval = setInterval(() => {
      if (Date.now() % refreshRate <= 500) {
        this.requestDepartures();
        setInterval(this.requestDepartures, refreshRate);
        clearInterval(syncRefreshInterval);
      }
    }, 500);

    ipcRenderer.on('departures', this.receiveDepartures);
  },

  methods: {
    requestDepartures() {
      ipcRenderer.send('departures', this.location);
    },
    receiveDepartures(e, services) {
      if (services.error) {
        this.error = services.error;
      } else {
        this.departures = services;
      }
    },
  },
};
</script>
