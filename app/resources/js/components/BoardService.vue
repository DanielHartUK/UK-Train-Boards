<template>
  <tr class="service">
    <td class="service__scheduled">
      {{ service.scheduled }}
    </td>
    <td
      class="service__location"
      :class="{'service__changed': changed.location}"
    >
      {{ serviceLocation }}
    </td>
    <td
      class="service__platform"
      :class="{'service__changed': changed.platform}"
    >
      {{ service.platform }}
    </td>
    <td
      class="service__expected"
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
            const location = this.type === 'departures' ? this.service.destination.location : this.service.origin.location;

            // If multiple locations, push the names to an array then join them with '&'
            if (Array.isArray(location)) {
                const locations = [];
                for (let i = 0; i < location.length; i++) {
                    locations.push(location[i].locationName);
                }
                location.locationName = locations.join(' & ');
            }

            const output = {};
            output.name = location.locationName;
            output.via = 'via' in location ? location.via : null;

            if (!_.isEmpty(this.location) && this.location.name !== output.name) this.alertChanged('location');
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
