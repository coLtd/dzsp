import Path from './mixins/path'
import { watchSetter } from '../util'

export default {
  name: 'c-polygon',
  mixins: [Path],
  props: {
    latlngs: {
      type: Array,
      required: true
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  watch: Object.assign(
    {},
    watchSetter('layer', ['latlngs']),
    {
      editing (val, ov) {
        if (val === ov) return
        if (this.layer) this.removeLayer(this.layer)
        if (this.dragDraw.instance) {
          this.dragDraw.instance.dispose()
          this.dragDraw.instance = null
        }
        this.createLayer()
      }
    }
  ),
  data () {
    return {
      dragDraw: {
        instance: null,
        inited: false
      }
    }
  },
  methods: {
    create () {
      if (!this.editing) {
        let opts = this.$props
        let polygon = new window.CPolygon(this.latlngs, opts)
        if (this.$listeners['polygon-click']) this.addListener(polygon, 'click', this.$listeners['polygon-click'])
        if (this.$listeners['polygon-mouseover']) this.addListener(polygon, 'mouseover', this.$listeners['polygon-mouseover'])
        if (this.$listeners['polygon-mouseleave']) this.addListener(polygon, 'mouseleave', this.$listeners['polygon-mouseleave'])
        return polygon
      }
      this.getLayers().then(layers => {
        this.dragDraw.instance = layers.dragDrawPolygon({
          shapeOptions: this.$props,
          dragcallback: this.dragCallback
        })
        this.latlngs.forEach(latlng => this.dragDraw.instance._onClick({ latlng }))
        this.dragDraw.inited = true
      })
    },
    dragCallback (feature) {
      if (!this.dragDraw.inited) return
      this.$emit('update:latlngs', feature.getLatLngs())
    }
  }
}
