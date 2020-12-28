<template>
  <div
    class="Board"
    :class="{'Board--HideCursor': mouseHidden}"
    @mouseover="hideMouse"
  >
    <resize-observer @notify="calculateRows"/>
    <h1 ref="title">
      {{ $t(`${type}`) }}
    </h1>
    <table class="Services">
      <thead ref="thead">
      <tr>
        <th class="Services__Time">
          {{ $t('Time') }}
        </th>
        <th class="Services__Location">
          {{ $t(`${type}-location`) }}
        </th>
        <th class="Services__Platform">
          {{ $t('Plat') }}
        </th>
        <th class="Services__Expected">
          {{ $t('Expected') }}
        </th>
      </tr>
      </thead>
      <tbody ref="tbody">
      <BoardServiceFiller
        v-if="error"
        :content="`${$t('Error')}: ${error}`"
      />
      <BoardService
        v-else
        v-for="service in services.slice(offset, page * rowsPerPage)"
        :key="service.serviceId"
        :service="service"
        :type="type"
        :via="via"
      />
      <BoardServiceFiller
        v-for="filler in fillers"
        :key="`filler-${filler}`"
      />
      </tbody>
      <tfoot
        class="Services__Footer"
        ref="tfoot"
      >
      <tr class="Service">
        <BoardPage
          :page="page"
          :pages="pages"
        />
        <BoardClock/>
      </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
// import resize from 'vue-resize-directive';
import 'vue-resize/dist/vue-resize.css';
import { ResizeObserver } from 'vue-resize';

import BoardService from '@components/BoardService';
import BoardServiceFiller from '@components/BoardServiceFiller';
import BoardPage from '@components/BoardPage';
import BoardClock from '@components/BoardClock';

function outerHeight(element) {
  const height = element.offsetHeight;
  const style = window.getComputedStyle(element);

  return ['top', 'bottom']
    .map((side) => parseInt(style[`margin-${side}`], 10))
    .reduce((total, side) => total + side, height);
}

export default {
  name: 'Board',

  components: {
    ResizeObserver,
    BoardServiceFiller,
    BoardService,
    BoardPage,
    BoardClock,
  },

  props: {
    services: {
      type: Array,
      required: true,
    },
    error: {
      type: String,
      required: false,
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
    offset: 0,
    via: 'off',
    mouseHidden: false,
    mouseTimeout: null,
  }),

  computed: {
    servicesCount() {
      return this.error ? 1 : this.services.length;
    },
    fillers() {
      return Math.max(0, this.rowsPerPage - (this.servicesCount - this.offset));
    },
    pages() {
      return Math.max(1, Math.ceil(this.servicesCount / this.rowsPerPage));
    },
  },

  mounted() {
    this.calculateRows();

    this.offset = (this.page - 1) * this.rowsPerPage;
  },

  methods: {
    calculateRows() {
      if (!this.$refs.tbody?.firstElementChild?.offsetHeight) return;

      const rowHeight = outerHeight(this.$refs.tbody.firstElementChild);
      const freeSpace = window.innerHeight
        - outerHeight(this.$refs.title)
        - outerHeight(this.$refs.thead)
        - outerHeight(this.$refs.tfoot.firstElementChild);

      this.rowsPerPage = Math.max(1, Math.floor(freeSpace / rowHeight));
      this.offset = (this.page - 1) * this.rowsPerPage;
    },

    hideMouse() {
      clearTimeout(this.mouseTimeout);
      this.mouseHidden = false;
      this.mouseTimeout = setTimeout(() => {
        this.mouseHidden = true;
      }, 1000);
    },
  },
};
</script>
