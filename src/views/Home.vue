<template>
  <v-container>
    <v-layout
      text-xs-center
      wrap
    >
      <v-flex xs12> 
         <c-map-layers v-bind="map.layers" ref="mapLayers"></c-map-layers>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { types } from '@/components/cmap/util'
import CMapLayers from '@/components/cmap/CMapLayers'
export default {
  data: () => ({
      map: {
        layers: {
          mapTypes: [types.YCMIXMAP, types.VECTORMAP],
          mapType: types.YCMIXMAP,
          center: { lat: 36.87817, lng: 110.19415 },
          zoom: 18,
          // zoomControl: { position: 'topright' },
          scaleControl: true,
          overviewControl: false,
          largeMapControl: { position: 'bottomright', styleNS: 'leaflet-control-zoomslider' },
          mapTypeControl: false,
          latLngControl: false
        }
      }
  }),
  components: {
    CMapLayers
  }
}
</script>

<style lang="scss">
.cmap-container {
  width: 100%;
  height: 100vh;
}
</style>