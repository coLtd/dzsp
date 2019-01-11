export default {
  name: 'c-cartogram',
  inject: ['getLayers'],
  data () {
    let pr
    let promise = new Promise(resolve => { pr = resolve })
    return {
      cartogram: null,
      promise,
      resolve: pr
    }
  },
  created () {
    this.createCartogram()
  },
  beforeDestroy () {
    this.getCartogram().then(cartogram => cartogram.dispose())
  },
  methods: {
    async createCartogram () {
      let layers = await this.getLayers()
      this.cartogram = new window.CCartogram(layers)
      this.resolve(this.cartogram)
    },
    getCartogram () {
      return this.promise
    }
  },
  render (h) {
    if (!this.$slots.default) return null
    return h('div', [this.$slots.default])
  },
  provide () {
    return {
      getCartogram: this.getCartogram
    }
  }
}
