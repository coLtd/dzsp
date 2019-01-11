import Path from './mixins/path'
import { watchSetter } from '../util'

export default {
  name: 'c-polyline',
  mixins: [Path],
  props: {
    latlngs: {
      type: Array,
      required: true
    },
    smoothFactor: {
      type: Number,
      default: 1
    },
    noClip: {
      type: Boolean,
      default: true
    }
  },
  watch: watchSetter('layer', ['latlngs']),
  methods: {
    create () {
      let opts = this.$props
      return new window.CPolyline(this.latlngs, opts)
    }
  }
}
