<template>
  <div class="service">
    <div class="service__scheduled">
      {{ service.scheduled }}
    </div>
    <div class="service__location">
      {{ location }}
    </div>
    <div
      class="service__platform"
      :class="{'service__changed': changed.platform}"
    >
      {{ service.platform }}
    </div>
    <div
      class="service__expected"
      :class="{'service__changed': changed.expected}"
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
            location: null,
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

            const locations = [];
            // If multiple locations, push the names to an array
            if (Array.isArray(location)) {
                for (let i = 0; i < location.length; i++) {
                    let name = location[i].locationName;
                    if ('via' in location[i]) name += ` ${location[i].via}`;
                    locations.push(name);
                }
                location.locationName = locations.join(' & ');
            } else if ('via' in location) {
                location.locationName += ` ${location.via}`;
            }

            this.location = location.locationName;
            if (this.location && location.locationName !== this.location) this.alertChanged('location');
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
