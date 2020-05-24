<template>
  <div class="DepaturesBoard">
    <h1>{{ $t('Departures') }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    location: {
      type: String,
      required: true,
      default: '',
    },
    page: {
      type: Number,
      required: false,
      default: 1,
    },
  },
};
</script>

<style>

</style>
