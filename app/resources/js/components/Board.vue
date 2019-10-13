<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h1>{{ trans(`boards.${type}`) }}</h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Board',
    props: {
        type: {
            type: String,
            default: null,
        },
        stn: {
            type: String,
            default: null,
        },
    },

    data() {
        return {
            loading: {
                services: false,
            },
        };
    },

    mounted() {
        this.getServices();
    },

    methods: {
        getServices() {
            this.loading.services = true;
            axios.get(this.route('api.departures', { stn: this.stn }))
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.error(error, error.response);
                })
                .finally(() => {
                    this.loading.services = false;
                });
        },
    },
};
</script>
