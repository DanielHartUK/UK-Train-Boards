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
    },

    mounted() {
        console.log('Component mounted.');
    },
};
</script>
