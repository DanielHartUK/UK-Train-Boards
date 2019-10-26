<template>
  <div
    v-resize:debounce="calculateRows"
    class="container-fluid"
  >
    <div class="row">
      <div class="col-12">
        <h1 ref="title">
          {{ trans(`boards.${type}`) }}
        </h1>
        <table class="services">
          <thead ref="thead">
            <tr>
              <th class="services__time">
                {{ trans('boards.time') }}
              </th>
              <th class="services__location">
                {{ trans(`boards.${type}-location`) }}
              </th>
              <th class="services__platform">
                {{ trans('boards.plat') }}
              </th>
              <th class="services__expected">
                {{ trans('boards.expected') }}
              </th>
            </tr>
          </thead>
          <tbody ref="tbody">
            <Board-Service
              v-for="service in services.slice(offset, page * rowsPerPage)"
              :key="service.serviceID"
              :service="service"
              :type="type"
            />
            <Board-Service-Filler
              v-for="filler in fillers"
              :key="`filler-${filler}`"
            />
          </tbody>
          <tfoot ref="tfoot">
            <tr class="service">
              <Board-Page
                :page="page"
                :pages="pages"
              />
              <Board-Clock />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import resize from 'vue-resize-directive';

export default {
    name: 'Board',

    directives: {
        resize,
    },

    props: {
        type: {
            type: String,
            required: true,
        },
        stn: {
            type: String,
            required: true,
        },
        page: {
            type: Number,
            default: 1,
        },
    },

    data: () => ({
        services: [{
            origin: {
                location: {
                    locationName: 'Loading',
                    crs: 'LOD',
                },
            },
            destination: {
                location: {
                    locationName: 'Loading',
                    crs: 'LOD',
                },
            },
        }],
        via: true,
        rowsPerPage: 8,
        pages: 1,
        offset: 0,
        refreshInterval: 30000,
        loading: {
            services: false,
        },
    }),

    computed: {
        fillers() {
            return Math.max(0, this.rowsPerPage - this.services.length);
        },
    },

    mounted() {
        this.getServices();
        this.calculateRows();

        this.offset = (this.page - 1) * this.rowsPerPage;
    },

    methods: {
        getServices() {
            this.loading.services = true;

            axios.get(this.route(`api.${this.type}`, { stn: this.stn }))
                .then((response) => {
                    this.services = response.data;
                    this.calculatePages();
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

        calculateRows() {
            if (!this.$refs.tbody.firstChild) return;

            const rowHeight = this.$refs.tbody.firstChild.offsetHeight;
            const freeSpace = window.innerHeight
                - this.$refs.title.offsetHeight
                - this.$refs.thead.offsetHeight
                - this.$refs.tfoot.firstChild.offsetHeight;

            this.rowsPerPage = Math.max(1, Math.floor(freeSpace / rowHeight));
            this.calculatePages();
        },

        calculatePages() {
            this.pages = Math.max(1, Math.ceil(this.services.length / this.rowsPerPage));
        },
    },
};
</script>
