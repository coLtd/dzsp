import Path from './mixins/path'
import { watchSetter } from '../util'

export default {
  name: 'c-circle',
  mixins: [Path],
  props: {
    latlng: {
      type: Object,
      required: true
    },
    radius: {
      type: Number | Object,
      required: true
    },
    fill: {
      type: Boolean,
      default: true
    }
  },
  watch: watchSetter('layer', ['latlng', 'radius']),
  methods: {
    create () {
      let opts = this.$props
      let p = new window.CLatLng(this.latlng.lat, this.latlng.lng)
      let r = typeof this.radius === 'number' ? this.radius : p.distanceTo(new window.CLatLng(this.radius.lat, this.radius.lng))
      return new window.CCircle(p, r, opts)
    }
  }
}
