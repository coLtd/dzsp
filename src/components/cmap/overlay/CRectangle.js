import Path from './mixins/path'
import { watchSetter } from '../util'

export default {
  name: 'c-rectangle',
  mixins: [Path],
  props: {
    bounds: {
      type: Array,
      required: true
    },
    fill: {
      type: Boolean,
      default: true
    }
  },
  watch: watchSetter('layer', ['bounds']),
  methods: {
    create () {
      let opts = this.$props
      return new window.CRectangle(this.bounds, opts)
    }
  }
}
