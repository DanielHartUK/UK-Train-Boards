<template>
  <div class="BoardView">
    <DeparturesBoard
      v-if="boardData.board === 'departures'"
      v-bind="boardData"
    />
    <p v-else>
      {{ $t('Unsupported Board') }}
    </p>
  </div>
</template>

<script>
import DeparturesBoard from '@components/DeparturesBoard';

export default {
  components: { DeparturesBoard },
  props: {
    boardData: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="scss">
  @use '@renderer/styles/main-view.scss';
</style>
