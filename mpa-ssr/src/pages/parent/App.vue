<template>
  <div id="app">
    <h1>Parent</h1>
    <frame />
  </div>
</template>

<style>
  .link {
    margin: 10px;
  }
</style>

<script>
  import frame from '../../views/frame.vue'
  export default {
    components: {
      frame
    }
  }
</script>
