<template>
  <tr class="Service Service--Filler">
    <td
      class="Service__Scheduled"
      colspan="4"
      v-html="content"
    />
  </tr>
</template>

<script>
export default {
  name: 'BoardServiceFiller',

  props: {
    content: {
      type: String,
      default: '&nbsp;',
    },
  },
};
</script>
