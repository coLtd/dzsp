<template>
  <div class="cmap-container">
    <div class="cmap"
         style="width: 100%; height: 100%;">
    </div>
    <template v-if="layers">
      <slot></slot>
    </template>
  </div>
</template>

<script>
import { types, initMapTypes, mapTypeOf, capitalize, watchSetter } from './util'

const controls = ['scale', 'overview', 'zoom', 'largeMap', 'mapType', 'latLng']

export default {
  name: 'c-map-layers',
  props: {
    // 地图支持的类型列表
    mapTypes: {
      type: Array,
      default: () => [types.VECTORMAP, types.MIXMAP]
    },
    // 当前类型，如果为空，默认为types[0]
    mapType: String,
    // 中心点
    center: {
      type: Object, // {lat: Number, lng: Number}
      required: true
    },
    // 缩放
    zoom: {
      type: Number,
      default: 6
    },
    // 最大范围 // [LatLng | LatLngBounds]
    maxBounds: {
      type: Array
    },
    // 地图显示范围
    bounds: {
      type: Array
    },
    // 比例尺控制 { position: "bottomleft", maxWidth: 100, metric: true, imperial: true, updateWhenIdle: false }
    scaleControl: {
      type: [Boolean, Object]
    },
    // 鹰眼控制 { position: "bottomright" }
    overviewControl: {
      type: [Boolean, Object]
    },
    // 小缩放控制 { position: "topleft", zoomInText: "+", zoomInTitle: "Zoom in", zoomOutText: "-", zoomOutTitle: "Zoom out" }
    zoomControl: {
      type: [Boolean, Object]
    },
    // 大缩放控制 { position: "topleft", stepHeight: 6, knobHeight: 6, styleNS: "leaflet-control-zoomslider" }
    largeMapControl: {
      type: [Boolean, Object]
    },
    // 地图类型切换控件 { position: "topright" }
    mapTypeControl: {
      type: [Boolean, Object]
    },
    // 鼠标移动显示经纬度坐标控件 { position: "topright" }
    latLngControl: {
      type: [Boolean, Object]
    }
  },
  data () {
    let pr
    let promise = new Promise(resolve => { pr = resolve })
    return {
      layers: null,
      control: {},
      promise,
      resolve: pr
    }
  },
  mounted () {
    this.createMap()
  },
  destroyed () {
    this.getLayers().then(layers => layers.remove())
  },
  watch: Object.assign(
    {},
    (controls.reduce((r, name) => {
      r[`${name}Control`] = function () { this.updateControl(name) }
      return r
    }, {})),
    {
      maxBounds (v) {
        if (!v) return
        this.delaySet(() => this.layers.setMaxBounds(v))
      },
      mapType (v) {
        if (!v) return
        this.delaySet(() => this.layers.setMapType(mapTypeOf(v)))
      },
      bounds (v) {
        if (!v) return
        this.delaySet(() => this.layers.setBounds(v))
      },
      center () {
        this.setCenter()
      },
      zoom () {
        this.setCenter()
      }
    }
  ),
  methods: {
    loadCMap () {
      return new Promise((resolve, reject) => {
        let intervalId = setInterval(() => {
          if (!window.CMapLayers) return
          clearInterval(intervalId)
          initMapTypes()
          resolve()
        }, 100)
      })
    },
    createMap () {
      this.loadCMap().then(() => {
        let opts = {
          mapTypes: this.mapTypes.map(t => mapTypeOf(t)),
          center: this.center,
          zoom: this.zoom,
          maxBounds: this.maxBounds
        }
        this.layers = new window.CMapLayers(this.$el.children[0], opts)
        this.layers.setMapType(mapTypeOf(this.mapType || this.mapTypes[0]))
        this.resolve(this.layers)
        controls.forEach(this.updateControl)
      })
    },
    updateControl (name) {
      if (!this.layers) return

      let val = this[`${name}Control`]

      if (!val) {
        if (this.control[name]) {
          this.layers.removeControl(this.control[name])
          this.control[name] = null
        }
        return
      }
      let Ctl = window[`C${capitalize(name)}Control`] || window.L.Control[capitalize(name)]
      this.control[name] = new Ctl(typeof val === 'object' ? val : null)
      this.layers.addControl(this.control[name])
      if (this.control[name].load) this.control[name].load()
    },
    setCenter () {
      this.delaySet(() =>
        this.layers.setCenter(this.center, this.zoom)
      )
    },
    delaySet (fn) {
      let self = this
      let intervalId = setInterval(function () {
        if (self.layers._sizeTimer) return
        clearInterval(intervalId)
        setTimeout(fn, 250)
      }, 100)
    },
    getLayers () {
      return this.promise
    },
    async addLayer (layer) {
      let layers = await this.getLayers()
      layers.addOverlay(layer)
    },
    removeLayer (layer) {
      this.$nextTick(() => {
        this.layers.removeOverlay(layer)
      })
    },
    clearOverlays () {
      this.layers.clearOverlays()
    }
  },
  provide () {
    return {
      getLayers: this.getLayers,
      addLayer: this.addLayer,
      removeLayer: this.removeLayer
    }
  }
}
</script>
