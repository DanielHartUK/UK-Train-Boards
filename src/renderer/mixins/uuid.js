let uuid = 0;

export default {
  data: () => ({
    uuid: null,
  }),

  beforeMount() {
    this.uuid = uuid;
    uuid += 1;
  },
};
