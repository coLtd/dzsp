import EventsMixin from '../mixins/events'

const defaultParams = {
  blankfillcolor: '#444444',
  colors: { A: '#CC6600', B: '#99CC00', C: '#628FC6', D: '#95A602', E: '#f2993c' },
  fillopacity: 0.6, // 图层的透明度
  // 线的参数
  outlinewidth: 0.5,
  outlineopacity: 0.9,
  // 显示区域名称参数
  labelvisible: false,
  // labelfont: '宋体',
  labelfontsize: 11,
  labelfontcolor: '#000000'
}

export default {
  name: 'c-cartogram-four-color',
  mixins: [EventsMixin],
  inject: ['getCartogram'],
  props: {
    // polys data
    value: Array,
    // 上级行政区划代码
    maincode: { type: String, required: true },
    // params
    params: Object,
    // 每个多边形的设置
    styles: Object, // {code: { color: '#555555', weight: 5, opacity: 1, fillCcolor: '#ffffff', fillOpacity: 1, labelColor: 'rgb(100,0,0)' }}
    drillDownEvent: { type: String, default: 'click' }, // [dbclick, click]
    polyClick: Function,
    polyMouseover: Function,
    polyMouseleave: Function
  },
  watch: {
    maincode () {
      this.show()
    }
  },
  data () {
    let gradeParams = Object.assign({}, defaultParams, { maincode: this.maincode, labelvisible: false })

    Object.keys(this.params).forEach(k =>
      Object.defineProperty(gradeParams, k, Object.getOwnPropertyDescriptor(this.params, k))
    )

    return {
      event: this.drillDownEvent === 'dbclick' ? 'dbclickcallback' : 'clickcallbacks',
      gradeParams,
      unwatchs: [],
      showing: {
        promise: Promise.resolve(),
        resolve: null
      }
    }
  },
  created () {
    this.show()
  },
  beforeDestroy () {
    this.clearWatch()
    this.getCartogram().then(cartogram => {
      if (!cartogram.regevents) return
      cartogram.clearAll()
    })
  },
  methods: {
    show () {
      this.showing.promise.then(() => {
        this.showing.promise = new Promise(resolve => {
          this.showing.resolve = resolve
        })
        this.getCartogram().then(cartogram => {
          let self = this
          window.GCMapData.loadPolyData(this.maincode, function (list) {
            self.clearListeners()
            self.clearWatch()
            cartogram.clearAll()
            cartogram.gradeParams = self.gradeParams
            cartogram.loadFourColorMapdb(list)
            cartogram.overlays.forEach(poly => {
              self.unwatchs.push(self.$watch(`styles.${poly.code}`, s => {
                if (s) self.updateStyle(poly, s)
              }))
              let style = self.styles[poly.code]
              if (style) self.updateStyle(poly, style)
              if (self.polyClick) self.addListener(poly, 'click', self.polyClick)
              if (self.polyMouseover) self.addListener(poly, 'mouseover', self.polyMouseover)
              if (self.polyMouseleave) self.addListener(poly, 'mouseleave', self.polyMouseleave)
            })

            self.$emit('input', list)
            self.showing.resolve()
          })
        })
      })
    },
    updateStyle (poly, style) {
      poly.polys[0].setStyle(style)
    },
    clearWatch () {
      this.unwatchs.forEach(unwatch => unwatch())
      this.unwatchs = []
    }
  },
  render (h) {
    if (!this.$slots.default) return null
    return h('div', [this.$slots.default])
  }
}
