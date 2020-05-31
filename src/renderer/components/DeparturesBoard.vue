<template>
  <Board
    :services="departures"
    type="departures"
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
  }),

  mounted() {
    this.requestDepartures();

    ipcRenderer.on('departures', this.receiveDepartures);
  },

  methods: {
    requestDepartures() {
      ipcRenderer.send('departures', this.location);
    },
    receiveDepartures(e, services) {
      console.log(services);
      this.departures = services?.trainServices;
    },
  },
};
</script>
