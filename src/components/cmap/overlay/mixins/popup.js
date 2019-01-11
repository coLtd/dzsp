import EventsMixin from '../../mixins/events'

export default {
  mixins: [EventsMixin],
  inject: ['getLayers', 'addLayer', 'removeLayer'],
  props: {
    popupProps: Object, // { minWidth: 50, maxWidth: 500, autoPan: true, closeButton: true, offset: [0, 7], autoPanPadding: [5, 5], keepInView: false, className: "", zoomAnimation: true }
    popupEvent: {
      type: String,
      default: 'click'
    }
  },
  mounted () {
    this.createLayer()
  },
  destroyed () {
    if (this.openPopup) {
      this.getLayers().then(layers => {
        layers.closeInfoWindow()
      })
    }
    this.removeLayer(this.layer)
  },
  data () {
    return {
      layer: null,
      openPopup: false,
    }
  },
  methods: {
    createLayer () {
      this.layer = this.create()
      if (!this.layer) return
      this.addLayer(this.layer)
      this.bindPopupEvent()
    },
    bindPopupEvent () {
      if (!this.$slots.default || !this.popupEvent) return

      let self = this
      this.addListener(this.layer, this.popupEvent, function (point) {
        self.popupOpen(point)
      })
    },
    popupOpen (point) {
      this.openPopup = false
      this.$forceUpdate()
      this.$nextTick(() => {
        this.openPopup = true
        this.$forceUpdate()
        this.getLayers().then(layers => {
          let popup = layers.openInfoWindow(this.latlng, this.$el.children[0], this.defaultPopupProps || this.popupProps)
          let self = this
          let closeEvent = window.CEvent.addListener(popup, 'close', function () {
            window.CEvent.removeListener(closeEvent)
            self.popupClose()
          })
          this.$emit('c-popupopen')
        })
      })
    },
    popupClose () {
      this.$nextTick(() => {
        this.$emit('c-popupclose')
      })
    }
  },
  render (h) {
    let keys = Object.keys(this.$slots)
    if (!keys.length) return null

    let children = (this.popupEvent && !this.openPopup) ? [] : [this.$slots.default]
    keys.filter(k => k !== 'default').forEach(k => children.push(this.$slots[k]))
    return h('div', { style: { display: 'none' } }, children)
  }
}
