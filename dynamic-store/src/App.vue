<template>
  <div id="app">
    <h1>Vue-ssr</h1>
    <router-link class="link" to="/comp1">Comp1</router-link>
    <router-link class="link" to="/comp2">comp2</router-link>

    <router-view class="view"></router-view>
  </div>
</template>

<style>
  .link {
    margin: 10px;
  }
</style>

<script>
  import './assets/common.css'
</script>
