<template>
  <div class="service">
    <div class="service__scheduled">
      {{ service.scheduled }}
    </div>
    <div
      class="service__location"
      :class="{'service__changed': changed.location}"
    >
      {{ location.name }}
      <span v-if="location.via">
        {{ location.via }}
      </span>
    </div>
    <div
      class="service__platform"
      :class="{'service__changed': changed.platform}"
    >
      {{ service.platform }}
    </div>
    <div
      class="service__expected"
    >
      {{ service.expected }}
    </div>
  </div>
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
    },

    data() {
        return {
            location: {},
            changed: {
                destination: false,
                platform: false,
            },
        };
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
            console.log(this.service.scheduled, this.location, property);

            setTimeout(() => {
                this.changed[property] = false;
            }, 10000);
        },
    },
};
</script>
