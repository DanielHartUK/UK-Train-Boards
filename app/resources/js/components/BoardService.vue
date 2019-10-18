<template>
  <div class="service">
    {{ service.scheduled }} -
    {{ location.locationName }} -
    {{ service.expected }}
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
        };
    },

    mounted() {
        this.location = this.type === 'departures' ? this.service.destination : this.service.origin;
    },

    methods: {},
};
</script>
