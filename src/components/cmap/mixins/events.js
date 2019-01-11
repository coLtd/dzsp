export default {
  data () {
    return {
      events: []
    }
  },
  destroyed () {
    this.clearListeners()
  },
  methods: {
    addListener (target, method, fn) {
      this.events.push(window.CEvent.addListener(target, method, fn))
    },
    clearListeners () {
      if (this.events.length) {
        this.events.forEach(e => window.CEvent.removeListener(e))
        this.events = []
      }
    }
  }
}
