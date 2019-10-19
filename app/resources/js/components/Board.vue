<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h1>{{ trans(`boards.${type}`) }}</h1>
        <div class="services">
          <Board-Service
            v-for="service in services"
            :key="service.serviceID"
            :service="service"
            :type="type"
          />
        </div>
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
            required: true,
        },
        stn: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            services: {},
            refreshInterval: 30000,
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
            axios.get(this.route(`api.${this.type}`, { stn: this.stn }))
                .then((response) => {
                    this.services = response.data;
                    setTimeout(() => {
                        this.getServices();
                    }, this.refreshInterval);
                })
                .catch((error) => {
                    console.error(error, error.response);
                    setTimeout(() => {
                        this.getServices();
                    }, this.refreshInterval * 3);
                })
                .finally(() => {
                    this.loading.services = false;
                });
        },
    },
};
</script>
