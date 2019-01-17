function mapOf(name, maxZoom, sate, sateLabel) {
  let layers = [new window.CTileLayer(2, maxZoom, sate, null, null)]
  if (sateLabel) layers.push(new window.CTileLayer(2, maxZoom, sateLabel, null, null))
  return new window.CMapType(layers, name)
}

let typesMap = {}

export function initMapTypes() {
  typesMap = {
    HIDDENMAP: mapOf('隐藏', 18, null),
    VECTORMAP: mapOf('矢量', 17, 'mapyn'),
    MIXMAP: mapOf('影像', 17, 'sateyn', 'satelabelyn'),
    CDMIXMAP: mapOf('成都影像', 18, 'satecd', 'satelabelcd'),
    YCMIXMAP: mapOf('延川影像', 18, 'sateyc', 'satelabelyc'),
    YCHMIXMAP: mapOf('延长影像', 18, 'sateych', 'satelabelych')
  }
}

export function mapTypeOf(name) {
  return typesMap[name]
}

export const types = {
  HIDDENMAP: 'HIDDENMAP',
  VECTORMAP: 'VECTORMAP',
  MIXMAP: 'MIXMAP',
  CDMIXMAP: 'CDMIXMAP',
  YCMIXMAP: 'YCMIXMAP',
  YCHMIXMAP: 'YCHMIXMAP'
}

const AreaRefMixMap = {
  // 四川省
  510000000000: types.CDMIXMAP,
  // 云南省
  530000000000: types.MIXMAP,
  // 陕西省
  610000000000: types.YCMIXMAP,
  // 市
  610600000000: types.YCHMIXMAP, // 延安市
  // 县
  610621000000: types.YCHMIXMAP, // 延长县
  610622000000: types.YCMIXMAP // 延川县
}

export function mixMapTypeOfArea(areaIds) {
  if (!areaIds) return types.MIXMAP
  if (Array.isArray(areaIds)) {
    for (let i = 0; i < areaIds.length; i++) {
      let areaId = areaIds[i]
      if (!areaId) continue
      if (areaId.length === 24) areaId = areaId.substr(0, 12)
      let t = AreaRefMixMap[areaId]
      if (t) return t
    }
    return types.MIXMAP
  }
  return AreaRefMixMap[areaIds] || types.MIXMAP
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function watchSetter(targetName, props) {
  return props.reduce((r, prop) => {
    let conf = typeof prop === 'string' ? {
      prop
    } : prop
    r[conf.prop] = {
      handler: function (val) {
        if (!this[targetName]) return
        this[targetName][conf.method || `set${capitalize(conf.prop)}`](val)
      },
      deep: !!conf.deep
    }
    return r
  }, {})
}