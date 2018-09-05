<template>
  <section>
    <h5>组件1.0</h5>
    <ul>
      <li v-for="(item, index) in nameList" :key="index">{{ item.name }}</li>
    </ul>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    asyncData ({ store, route }) {
      return store.dispatch('getNameList')
    },
    computed: {
      ...mapGetters([
        'nameList'
      ])
    }
  }
</script>
