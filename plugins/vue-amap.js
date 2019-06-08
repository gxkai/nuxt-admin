import Vue from 'vue'
import VueAMap from 'vue-amap'
Vue.use(VueAMap)

VueAMap.initAMapApiLoader({
  // 高德的key
  key: '0614929447d116bfd17ed4c028df88f3',
  // 插件集合
  plugin: ['AMap.Geolocation', 'AMap.Marker', 'AMap.ToolBar', 'AMap.Circle', 'AMap.PolyLine'],
  uiVersion: '1.0',
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.8'
})
