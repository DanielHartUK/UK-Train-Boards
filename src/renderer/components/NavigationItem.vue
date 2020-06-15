<template>
  <router-link
    class="Navigation__Item"
    :to="to"
    active-class="Navigation__Item--Active"
    exact-active-class="Navigation__Item--ExactActive"
  >
    <font-awesome-icon
      :icon="['fas', icon]"
      class="Navigation__Icon"
    />
    <span class="Navigation__Label">{{ $t(label) }}</span>
  </router-link>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      required: true,
      default: '/',
    },
    icon: {
      type: String,
      required: true,
      default: '',
    },
    label: {
      type: String,
      required: true,
      default: '',
    },
  },
};
</script>
