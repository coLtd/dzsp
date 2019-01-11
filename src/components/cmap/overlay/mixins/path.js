import Popup from './popup'

const props = ['stroke', 'color', 'dashArray', 'lineCap', 'lineJoin', 'weight', 'opacity', 'fill', 'fillColor', 'fillOpacity', 'clickable']

export default {
  mixins: [Popup],
  props: {
    stroke: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: '#0033ff'
    },
    dashArray: {
      type: String,
      default: null
    },
    lineCap: {
      type: String,
      default: null
    },
    lineJoin: {
      type: String,
      default: null
    },
    weight: {
      type: Number,
      default: 5
    },
    opacity: {
      type: Number,
      default: 0.5
    },
    fill: {
      type: Boolean,
      default: false
    },
    fillColor: {
      type: String,
      default: null
    },
    fillOpacity: {
      type: Number,
      default: 0.2
    },
    clickable: {
      type: Boolean,
      default: true
    }
  },
  watch: props.reduce((r, prop) => {
    r[prop] = function () {
      if (!this.layer) return
      this.layer.setStyle(this.$props)
    }
    return r
  }, {})
}
