<template>
  <td
    class="PageIndicator"
    colspan="2"
  >
    {{ $t('Page') }}
    {{ page }}
    {{ $t('of') }}
    {{ pages }}
  </td>
</template>

<script>
export default {
  name: 'BoardPage',
  props: {
    page: {
      type: Number,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
  },
};
</script>
