import Vue from 'vue'
import VueBaiduMap from 'vue-baidu-map'

// After plugin: i18n.js
export default () => {
  Vue.use(VueBaiduMap, {
    ak: 'FG7wxr1VUj0k2NwoO3yXzymd&services=&t=20170517145936'
  })
}
