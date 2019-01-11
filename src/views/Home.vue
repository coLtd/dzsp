<template>
  <v-layout text-xs-center
            wrap>
    <v-flex xs12>
      <div class="custtoolbar">
        <v-layout row>
          <v-flex xs3>
            <v-menu offset-y>
              <v-btn slot="activator"
                     color="info"
                     dark>
                {{ curSelected.title }}
              </v-btn>
              <v-list>
                <v-list-tile v-for="(item, index) in items"
                             :key="index"
                             @click="choiceType(item)">
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-flex>
          <v-flex xs4
                  mx-1>
            <v-combobox class="comboxselected"
                        v-model="selectArea"
                        :items="areas"
                        hide-details
                        single-line
                        label="选择省份"></v-combobox>
          </v-flex>
          <v-flex xs4>
            <v-combobox class="comboxselected"
                        v-model="selectCategorys"
                        :items="categorys"
                        hide-details
                        single-line
                        label="选择类别"></v-combobox>
          </v-flex>
          <v-flex xs4
                  mx-1>
            <v-text-field class="comboxselected"
                          label="输入关键词搜索"
                          hide-details
                          single-line
                          append-icon="search"></v-text-field>
          </v-flex>
        </v-layout>
      </div>
    </v-flex>
    <v-flex xs12>
      <c-map-layers v-bind="map.layers"
                    ref="mapLayers"></c-map-layers>
    </v-flex>
  </v-layout>
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
        zoom: 15,
        // zoomControl: { position: 'topright' },
        scaleControl: true,
        overviewControl: false,
        largeMapControl: { position: 'bottomright', styleNS: 'leaflet-control-zoomslider' },
        mapTypeControl: false,
        latLngControl: false
      }
    },
    items: [
      { type: 1, title: '企业分布' },
      { type: 2, title: '地块分布' },
      { type: 3, title: '物联网分布' },
      { type: 4, title: '气象分布' }
    ],
    curSelected: {
      type: 1,
      title: '企业分布'
    },
    selectArea: '云南省',
    areas: [
      '云南省',
      '四川省',
      '贵州省'
    ],
    selectCategorys: '企业',
    categorys: [
      '企业',
      '个人'
    ]
  }),
  methods: {
    choiceType: function (item) {
      if (!item) return
      Object.assign(this.curSelected, item)
    }
  },
  components: {
    CMapLayers
  }
}
</script>

<style lang="scss">
.custtoolbar {
  // border: 1px solid red;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  .comboxselected {
    background-color: #ffffff;
    padding-top: 0;
    margin-top: 10px;
    padding-left: 5px;
  }
}
.cmap-container {
  width: 100%;
  height: calc(100vh - 170px);
}
</style>