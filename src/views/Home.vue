<template>
  <v-layout text-xs-center
            wrap>
    <v-flex xs12>
      <div class="custtoolbar">
        <v-layout row>
          <v-flex xs1>
            <v-menu offset-y>
              <v-btn fab
                     dark
                     slot="activator"
                     small
                     color="info">
                <v-icon dark>settings</v-icon>
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
                        v-model="selectStatKind"
                        v-bind:items="selectStatKinds"
                        item-text="title"
                        item-value="type"
                        hide-details
                        single-line
                        label="统计类型"></v-combobox>
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
                    ref="mapLayers">
        <c-cartogram>
          <c-cartogram-four-color v-model="fourColor.data"
                                  v-bind="fourColor.props">
            <cc-label v-for="p in fourColor.data"
                      :key="p.code"
                      :latlng="{lat: p.bunds[5], lng: p.bunds[4]}"
                      :label-color="fourColorLabelColor(p.code)"
                      className="cc-label"
                      @label-click="fourColorPolyClick(p.code)"
                      @label-mouseover="fourColorPolyMouseover(p.code)"
                      @label-mouseleave="fourColorPolyMouseleave(p.code)">
              <div>{{ p.name }}</div>
            </cc-label>
          </c-cartogram-four-color>
        </c-cartogram>
        <div class="leaflet-top leaflet-icon leaflet-report leaflet-back-right"
             v-if="!showReport">
          <div class="leaflet-control">
            <a title="图表">
              <v-avatar class="blue"
                        size="25px">
                <v-icon dark
                        @click="showReport = !showReport">list</v-icon>
              </v-avatar>
            </a>
          </div>
        </div>
        <!-- <div class="leaflet-bottom leaflet-icon leaflet-icon  leaflet-back leaflet-back-right">
          <div class="leaflet-control"
               @click="">
            <a title="返回">
              <v-avatar class="blue"
                        size="20px">
                <v-icon dark>arrow_back</v-icon>
              </v-avatar>
            </a>
          </div>
          <div class="leaflet-control"
               @click="">
            <a title="刷新">
              <v-avatar class="blue"
                        size="20px">
                <v-icon dark>autorenew</v-icon>
              </v-avatar>
            </a>
          </div>
        </div> -->
        <div class="leaflet-bottom leaflet-right reportbar">
          <div class="leaflet-control"
               style="margin-top: 1px;">
            <a title="关闭"
               @click="">
              <v-avatar class="blue"
                        size="23px">
                <v-icon dark>close</v-icon>
              </v-avatar>
            </a>
          </div>
          <div style="text-align: center; padding-top: 15px; padding-bottom: 10px; font-size: 16px; font-weight: 600;">企业分布(个)</div>
          <v-divider></v-divider>
          <!-- <div style="text-align: center; font-size: 13px;">企业：100&nbsp;&nbsp;个</div> -->
          <div class="bars leaflet-control">
            <ve-bar :data="chartData"
                    :settings="chartSettings"
                    :legend-visible="false"
                    :width="barContainer.width"
                    :height="barContainer.height"
                    :tooltip-visible="barContainer.tooltipvisible"
                    :grid="barContainer.grid"
                    :xAxis="barContainer.xAxis"
                    ref="bar">
            </ve-bar>
          </div>
        </div>
      </c-map-layers>
    </v-flex>
  </v-layout>
</template>

<script>
import { types } from '@/components/cmap/util'
import CMapLayers from '@/components/cmap/CMapLayers'
import CCartogram from './cartogram/c-cartogram'
import CCartogramFourColor from './cartogram/c-cartogram-four-color'
import CcLabel from './cartogram/cc-label'

const FourColorStyle = {
  // 默认色
  Common: {
    poly: {
      color: '#444444',
      weight: 1,
      opacity: 0.8,
      fillColor: '#fafafa',
      fillOpacity: 0.8,
      labelColor: 'rgb(100,0,0)'
    },
    label: { color: '#000000' }
  },
  // 激活色
  Hover: {
    poly: {
      color: '#444444',
      weight: 1,
      opacity: 1,
      fillColor: 'rgba(255,215,0,1)',
      fillOpacity: 1,
      labelColor: 'rgb(100,0,0)'
    },
    label: { color: '#000000' }
  },
  // 热区色
  Active: {
    poly: [{
      color: '#444444',
      weight: 0,
      opacity: 0,
      // fillColor: '#05abf2',
      fillColor: 'rgba(245,161,0,1)',
      fillOpacity: 1,
      labelColor: '#ffffff'
    }, {
      color: '#444444',
      weight: 0,
      opacity: 0,
      fillColor: 'rgba(247,180,51,1)',
      fillOpacity: 1,
      labelColor: '#ffffff'
    }, {
      color: '#444444',
      weight: 0,
      opacity: 0,
      fillColor: 'rgba(249,199,102,1)',
      fillOpacity: 1,
      labelColor: '#ffffff'
    }, {
      color: '#444444',
      weight: 0,
      opacity: 0,
      fillColor: 'rgba(251,217,153,1)',
      fillOpacity: 1,
      labelColor: '#ffffff'
    }, {
      color: '#444444',
      weight: 0,
      opacity: 0,
      fillColor: 'rgba(253,236,204,1)',
      fillOpacity: 1,
      labelColor: '#ffffff'
    }, {
      color: '#444444',
      weight: 0,
      opacity: 0,
      fillColor: 'rgba(254,245,227,1)',
      fillOpacity: 1,
      labelColor: '#ffffff'
    }],
    label: { color: '#000000' }
  }
}

function simpleCode (code) {
  if (code.length < 12) return code
  return code.substr(6, 6) === '000000' ? code.substr(0, 6) : code.substr(0, 9)
}

export default {
  data () {
    let self = this
    return {
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
      fourColor: {
        provincesPromise: null,
        data: null,
        counts: {
          map: {}
        },
        props: {
          maincode: '100000', // 110000
          params: {
            colors: {},
            fillopacity: 0
          },
          styles: {}, // {code: {count: 0, style: {}}}
          polyClick (e) {
            self.fourColorPolyClick(e.target.code)
          },
          polyMouseover (e) {
            self.fourColorPolyMouseover(e.target.code)
          },
          polyMouseleave (e) {
            self.fourColorPolyMouseleave(e.target.code)
          }
        }
      },
      items: [
        { type: 1, title: '数据管理' },
        { type: 2, title: '用户管理' },
        { type: 3, title: '权限管理' },
        { type: 4, title: '个人设置' }
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
      ],
      selectStatKind: { type: 1, title: '企业分布' },
      selectStatKinds: [
        { type: 1, title: '企业分布' },
        { type: 2, title: '地块分布' },
        { type: 3, title: '物联网分布' },
        { type: 4, title: '气象分布' }
      ],

      showReport: true,
      chartData: null,
      chartSettings: null,
      baremphasis: null,
      barContainer: {
        scale: 30,
        width: '100%',
        grid: {
          show: false,
          left: 10,
          top: 0,
          right: 0,
          bottom: 0,
          width: 200,
          height: 'auto'
        },
        xAxis: {
          show: false
        },
        tooltipvisible: false
      }
    }
  },
  watch: {
    'fourColor.data': function (v) {
      if (!v) return
      this.map.layers.bounds = [
        [
          Math.min.apply(null, v.map(d => d.bunds[1])),
          Math.min.apply(null, v.map(d => d.bunds[0]))
        ],
        [
          Math.max.apply(null, v.map(d => d.bunds[3])),
          Math.max.apply(null, v.map(d => d.bunds[2]))
        ]
      ]
      this.fourColorUpdateCounts(v)
    }
  },
  methods: {
    choiceType: function (item) {
      if (!item) return
      Object.assign(this.curSelected, item)
    },
    sysSettings: function () {
      alert('系统设置')
    },
    fourColorPolyClick (oriCode) {
      // alert(oriCode)
    },
    fourColorPolyMouseover (code) {
      // alert(code)
    },
    fourColorPolyMouseleave (code) {
      // alert(code)
    },
    fourColorLabelColor (code) {
      return this.fourColor.counts.map[simpleCode(code)] ? FourColorStyle.Active.label.color : FourColorStyle.Common.label.color
    },
    fourColorCenterOf (code) {
      let p = this.fourColor.data.find(d => d.code === code + '')
      if (!p) return null
      return { lat: p.bunds[5], lng: p.bunds[4] }
    },
    fourColorUpdateCounts (v) {
      v.forEach((ii) => {
        if (simpleCode(ii.code) === (Object.keys(this.fourColor.counts.map).find(function (value) {
          return value === simpleCode(ii.code)
        }))) {
          this.$set(this.fourColor.props.styles, simpleCode(ii.code), FourColorStyle.Active.poly[0])
        } else {
          this.$set(this.fourColor.props.styles, simpleCode(ii.code), FourColorStyle.Common.poly)
        }
      })
    }
  },
  components: {
    CMapLayers,
    CCartogram,
    CCartogramFourColor,
    CcLabel
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
  height: calc(100vh - 100px);
}
.leaflet-bottom {
  bottom: 1.2rem;
}
.leaflet-right {
  right: 1.6rem;
}
.leaflet-report {
  top: 1.6rem;
}
.leaflet-back {
  bottom: 70px;
}
.leaflet-back-right {
  right: 1.6rem;
}
.reportbar {
  top: 1.6rem;
  background: white;
  opacity: 0.8;
  width: 300px;
  height: 350px;
  .bars {
    width: 300px;
    height: 280px;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
.leaflet-bar {
  border-radius: 0;
  background-color: #575859;
  padding: 0 5px;
  a {
    background-color: rgb(87, 88, 89);
    color: #ffffff;
    border-radius: 0;
    width: 20px;
    height: 30px;
    line-height: 28px;
  }
}
.leaflet-refresh {
  bottom: 98px;
}
.cc-label {
  white-space: nowrap;
}
</style>