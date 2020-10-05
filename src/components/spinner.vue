<template>
  <div>
    <div id="loader" class="spinner-fast centerDiv"></div>
    <div id="message" class="text-center" style="display: none;"><h1>No results</h1></div>
  </div>
</template>

<script>
export default {
  name: 'Spinner',
  methods: {
    timeout() {
      setTimeout(this.stopLoading, 1000)
    },
    stopLoading() {
      var loader = document.getElementById("loader");
      var message = document.getElementById("message");
      if (loader && message) {
        loader.style.display = "none";
        message.style.display = "block";
      }
    },
  },
  mounted() {
    this.timeout()
  }
}
</script>