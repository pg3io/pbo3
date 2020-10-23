<template>
  <div id="app">
    <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico"/>
    <header class="header">
        <div v-if="isAuthenticated" id="nav">
          <Navbar/>
        </div>
        <div v-else>
          <br>
        </div>
    </header>
    <router-view/>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar,
  },
  data () {
    return {
      value: null,
      options: ['list', 'of', 'options']
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('logOut')
        .then(() => this.$router.push('/login'))
    }
  },
  computed: {
    ...mapGetters(['user', 'isAuthenticated'])
  }
}
</script>

<style>

</style>