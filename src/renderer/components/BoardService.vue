<template>
  <tr class="Service">
    <td class="Service__Scheduled">
      {{ service.scheduled }}
    </td>
    <td
      class="Service__Location"
      :class="{'Service__Changed': changed.location}"
    >
      {{ serviceLocation }}
    </td>
    <td
      class="Service__Platform"
      :class="{'Service__Changed': changed.platform}"
    >
      {{ service.platform }}
    </td>
    <td
      class="Service__Expected"
    >
      {{ service.expected }}
    </td>
  </tr>
</template>

<script>
export default {
  name: 'BoardService',

  props: {
    service: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    via: {
      type: String,
      required: false,
      default: 'off',
    },
  },

  data: () => ({
    location: {},
    changed: {
      destination: false,
      platform: false,
    },
    showVia: false,
  }),

  computed: {
    serviceLocation() {
      if (this.via === 'off' || !this.location.via) return this.location.name;
      if (this.via === 'oneline') return this.location.name + this.location.via;

      if (this.via === 'alternate') {
        if (this.showVia) return this.location.via;
        return this.location.name;
      }

      return this.location.name;
    },
  },

  watch: {
    service(updated, original) {
      this.parseLocation();

      if (updated.platform !== original.platform) {
        this.alertChanged('platform');
      }
    },
  },

  beforeMount() {
    this.parseLocation();
  },

  mounted() {
    if (this.via === 'alternate') {
      this.alternateLocation();
    }
  },

  methods: {
    /**
     * Handle the location of the service
     * Assigns a location string to the location data entry
     */
    parseLocation() {
      const location = this.type === 'departures' ? this.service.destination : this.service.origin;

      // If multiple locations, push the names to an array then join them with '&'
      if (Array.isArray(location)) {
        const locations = [];
        for (let i = 0; i < location.length; i += 1) {
          locations.push(location[i].name);
        }
        location.name = locations.join(' & ');
      }

      const output = {};
      output.name = location.name;
      output.via = 'via' in location ? location.via : null;

      if (Object.keys(this.location).length > 0 && this.location.name !== output.name) this.alertChanged('location');
      this.location = output;
    },

    /**
     * Trigger the changed animation on a property
     * @param {string} property The property that has changed
     */
    alertChanged(property) {
      this.changed[property] = true;

      setTimeout(() => {
        this.changed[property] = false;
      }, 10000);
    },

    toggleVia() {
      this.showVia = !this.showVia;
      this.alternateLocation();
    },

    alternateLocation() {
      if (this.showVia) {
        setTimeout(this.toggleVia, 5000);
      } else {
        setTimeout(this.toggleVia, 10000);
      }
    },
  },
};
</script>
