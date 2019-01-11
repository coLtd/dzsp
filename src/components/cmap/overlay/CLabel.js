import EventsMixin from '../mixins/events'

export default {
  mixins: [EventsMixin],
  name: 'c-label',
  inject: ['addLayer', 'removeLayer'],
  props: {
    latlng: {
      type: [Array, Object], // [lat, lng, alt] | {lat: Number, lng: Number}
      required: true
    },
    text: String,
    className: String,
    offsetX: Number,
    offsetY: Number,
    labelColor: String
  },
  data () {
    return {
      label: null
    }
  },
  mounted () {
    this.createLabel()
  },
  updated () {
    if (!this.label.getContainer()) return

    this.updateText()
  },
  destroyed () {
    this.removeLayer(this.label)
  },
  watch: {
    latlng (v) {
      if (!v || !this.label || !this.label.map_) return
      this.label.setLatLng(v)
    },
    className (v) {
      this.label.getContainer().className = v
    },
    labelColor () {
      this.updateColor()
    },
    text () {
      this.updateText()
    }
  },
  methods: {
    createLabel () {
      this.label = new window.CLabel(this.latlng, this.$slots.default ? this.$el.innerHTML : this.text, this.offsetX, this.offsetY, this.className)
      this.addLayer(this.label)
      this.updateColor()
    },
    updateColor () {
      if (!this.labelColor) return

      if (!this.label.getContainer()) {
        this.$nextTick(function () {
          this.updateColor()
        })
        return
      }
      this.label.getContainer().style.color = this.labelColor
    },
    updateText () {
      this.label.setText(this.$slots.default ? this.$el.innerHTML : this.text)
    }
  },
  render (h) {
    if (!this.$slots.default) return null
    return h('div', { style: { display: 'none' } }, [this.$slots.default])
  }
}
