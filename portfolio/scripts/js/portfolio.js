new Vue({
  el:'#page',
  data: {
    isActive: false,
  },
  created() {
    //this.registerSW();
  },
  methods: {
    registerSW() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
        .register('./sw.js')
        .then(() => {
          console.log('SW is registered');
        });
      }
    },
    toggleActive() {
      this.isActive = !this.isActive && event.target.classList.contains('tk-toggle')
      ? true
      : false;
    }
  }
})