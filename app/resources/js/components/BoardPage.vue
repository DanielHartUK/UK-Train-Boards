<template>
  <td
    class="page-indicator"
    colspan="2"
  >
    {{ trans('boards.page') }}
    {{ page }}
    {{ trans('boards.of') }}
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
