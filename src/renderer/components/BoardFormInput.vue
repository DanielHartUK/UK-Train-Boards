<template>
  <input
    :value="value"
    v-bind="$attrs"
    @input="input"
  />
</template>

<script>

export default {
  props: {
    value: {
      default: null,
    },
    modifier: {
      type: String,
      default: null,
    },
  },

  methods: {
    input(el) {
      let { value } = el.target;

      if (this.modifier === 'number') {
        value = parseFloat(value) || value;
      }

      this.$emit('input', value);
    },
  },
};

</script>
