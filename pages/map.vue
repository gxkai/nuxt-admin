<template>
  <div>
    <baidu-map
      class="map"
      :center="center"
      :mapStyle="mapStyle"
      style="display: flex; flex-direction: column"
      :map-type="mapType"
      :scroll-wheel-zoom="true"
      fillColor="red"
      :fillOpacity="0"
      :zoom="zoom"
    >
      <bm-panorama></bm-panorama>
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
      <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_LEFT" :isOpen="true"></bm-overview-map>
      <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
      <bm-boundary
        name="江苏省昆山市"
        :strokeWeight="0.5"
        strokeColor="blue"
        strokeStyle="dashed"
      ></bm-boundary>
      <bm-view style="width: 100%; flex: 1"></bm-view>
      <bm-marker
        v-for="(marker, index) in markers"
        :key="index"
        :position="marker.point"
        @click="infoWindowOpen(marker)"
      >
        <bm-info-window
          :position="marker.point"
          :title="marker.title"
          :show="marker.show"
          @close="infoWindowClose(marker)"
          @open="infoWindowOpen(marker)"
        >
          <p>{{ marker.introduction }}</p>
        </bm-info-window>
      </bm-marker>
    </baidu-map>
  </div>
</template>

<script>
import Component from 'class-component'

@Component({
  components: {}
})
export default class Home {
  /**
   * 1.BMAP_NORMAL_MAP 2.BMAP_PERSPECTIVE_MAP 3.BMAP_SATELLITE_MAP 4.BMAP_HYBRID_MAP
   * @type {string}
   */
  mapType = 'BMAP_NORMAL_MAP';
  zoom = 11
  center = '昆山';
  mapStyle = {
    styleJson: [
      {
        featureType: 'all',
        elementType: 'geometry',
        stylers: {
          hue: '#007fff',
          saturation: 89
        }
      },
      {
        featureType: 'water',
        elementType: 'all',
        stylers: {
          color: '#ffffff'
        }
      }
    ]
  };
  markers = [];
  mounted () {
    this.addPoints()
  }
  infoWindowClose (e) {
    e.show = false
  }
  infoWindowOpen (e) {
    e.show = true
  }
  addZoom (level) {
    this.zoom = level
  }
  addPoints () {
    this.markers = [
      {
        show: false,
        title: '百家惠大药房',
        introduction: '百家惠大药房',
        point: { lng: '120.897189', lat: '31.404902' }
      },
      {
        show: false,
        title: '同德堂大药房',
        introduction: '同德堂大药房',
        point: { lng: '120.956095', lat: '31.397078' }
      }
    ]
  }
}
</script>

<style scoped lang="scss" type="text/scss">
.map {
  height: calc(100vh - 60px);
}
</style>
