<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">{{ $t('Home') }}</router-link>
      |
      <router-link to="/about">{{ $t('About') }}</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
  @use './styles/app';
</style>
