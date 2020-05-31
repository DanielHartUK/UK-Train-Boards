<template>
  <div
    v-resize:debounce="calculateRows"
    class="Board"
  >
    <h1 ref="title">
      {{ $t(`${type}`) }}
    </h1>
    <table class="Services">
      <thead ref="thead">
        <tr>
          <th class="Services__Time">
            {{ $t('time') }}
          </th>
          <th class="Services__Location">
            {{ $t(`${type}-location`) }}
          </th>
          <th class="Services__Platform">
            {{ $t('plat') }}
          </th>
          <th class="Services__Expected">
            {{ $t('expected') }}
          </th>
        </tr>
      </thead>
      <tbody ref="tbody">
        <BoardService
          v-for="service in services.slice(offset, page * rowsPerPage)"
          :key="service.serviceID"
          :service="service"
          :type="type"
          :via="via"
        />
        <BoardServiceFiller
          v-for="filler in fillers"
          :key="`filler-${filler}`"
        />
      </tbody>
      <tfoot ref="tfoot">
        <tr class="Service">
<!--          <Board-Page-->
<!--            :page="page"-->
<!--            :pages="pages"-->
<!--          />-->
<!--          <Board-Clock/>-->
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import resize from 'vue-resize-directive';
import BoardService from '@components/BoardService';
import BoardServiceFiller from '@components/BoardServiceFiller';

export default {
  name: 'Board',
  components: { BoardServiceFiller, BoardService },
  directives: {
    resize,
  },

  props: {
    services: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    page: {
      type: Number,
      default: 1,
    },
  },

  data: () => ({
    rowsPerPage: 8,
    pages: 1,
    offset: 0,
    via: 'off',
  }),

  computed: {
    // fillers() {
    //   return Math.max(0, this.rowsPerPage - this.services.length);
    // },
  },

  mounted() {
    // this.calculateRows();

    // this.offset = (this.page - 1) * this.rowsPerPage;
  },

  methods: {
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
