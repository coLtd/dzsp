export default {
  name: 'c-marker-cluster',
  inject: ['addLayer', 'removeLayer'],
  props: {
    maxClusterRadius: {
      type: Number,
      default: 80
    },
    iconCreateFunction: Function,
    spiderfyOnMaxZoom: {
      type: Boolean,
      default: true
    },
    showCoverageOnHover: {
      type: Boolean,
      default: true
    },
    zoomToBoundsOnClick: {
      type: Boolean,
      default: true
    },
    singleMarkerMode: {
      type: Boolean,
      default: false
    },
    disableClusteringAtZoom: Number,
    removeOutsideVisibleBounds: {
      type: Boolean,
      default: true
    },
    animateAddingMarkers: {
      type: Boolean,
      default: false
    },
    spiderfyDistanceMultiplier: {
      type: Number,
      default: 1
    },
    chunkedLoading: {
      type: Boolean,
      default: false
    },
    chunkInterval: {
      type: Number,
      default: 200
    },
    chunkDelay: {
      type: Number,
      default: 50
    },
    chunkProgress: Function, // progress callback: function(processed, total, elapsed) (e.g. for a progress indicator)
    polygonOptions: {
      type: Object,
      default: () => ({ stroke: true, color: '#FF0000', weight: 1, opacity: 0.7, fill: true, fillColor: '#0000ff', fillOpacity: 0.1 })
    }
  },
  data () {
    let pr
    let promise = new Promise(resolve => { pr = resolve })
    return {
      cluster: null,
      promise,
      resolve: pr
    }
  },
  mounted () {
    this.createCluster()
  },
  destroyed () {
    this.removeLayer(this.cluster)
  },
  methods: {
    createCluster () {
      this.cluster = new window.CMarkerCluster(this.$props)
      this.addLayer(this.cluster)
      this.resolve(this.cluster)
    },
    getCluster () {
      return this.promise
    },
    async clusterAddLayer (layer) {
      let cluster = await this.getCluster()
      cluster.addLayer(layer)
    },
    clusterRemoveLayer (layer) {
      this.cluster.removeLayer(layer)
    }
  },
  render (h) {
    if (!this.$slots.default) return null
    return h('div', [this.$slots.default])
  },
  provide () {
    return {
      getCluster: this.getCluster,
      addLayer: this.clusterAddLayer,
      removeLayer: this.clusterRemoveLayer
    }
  }
}
