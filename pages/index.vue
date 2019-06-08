<template>
  <div>
    <!--<div class="container">
      <div class="wrapper1 wrapper">
        <el-card style="height: 100%">
          <div slot="header">
            <span>评价指数</span>
          </div>
          <el-row>
            <el-col>
              <ve-radar :data="radarData" :settings="radarSettings"></ve-radar>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div class="wrapper2 wrapper">
        <el-card style="height: 100%">
          <div slot="header">
            <span>各类目占比</span>
          </div>
          <el-tabs v-model="activeName">
            <el-tab-pane label="处方流出" name="first">
              <el-row>
                <el-col>
                  <ve-ring :data="ringData11"></ve-ring>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="处方" name="second">
              <el-row>
                <el-col>
                  <ve-ring :data="ringData12"></ve-ring>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="医保" name="third">
              <el-row>
                <el-col>
                  <ve-ring :data="ringData13"></ve-ring>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
      <div class="wrapper3 wrapper">
        <el-card style="height: 100%">
          <div slot="header">
            <span>用户群体</span>
          </div>
          <el-row>
            <el-col>
              <ve-scatter :data="scatterData"></ve-scatter>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div class="wrapper4 wrapper">
        <el-card style="height: 100%">
          <div slot="header">
            <span>药品品类占比</span>
          </div>
          <el-row>
            <el-col>
              <ve-ring :data="ringData2" :settings="ringSettings2"></ve-ring>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div class="wrapper5 wrapper">
        &lt;!&ndash;<baidu-map&ndash;&gt;
          &lt;!&ndash;class="map"&ndash;&gt;
          &lt;!&ndash;:center="center"&ndash;&gt;
          &lt;!&ndash;:mapStyle="mapStyle"&ndash;&gt;
          &lt;!&ndash;style="display: flex; flex-direction: column"&ndash;&gt;
          &lt;!&ndash;:map-type="mapType"&ndash;&gt;
        &lt;!&ndash;&gt;&ndash;&gt;
          &lt;!&ndash;<bm-boundary&ndash;&gt;
            &lt;!&ndash;name="江苏省昆山市"&ndash;&gt;
            &lt;!&ndash;:strokeWeight="1"&ndash;&gt;
            &lt;!&ndash;strokeColor="#007fff"&ndash;&gt;
          &lt;!&ndash;&gt;</bm-boundary>&ndash;&gt;
          &lt;!&ndash;<bm-view style="width: 100%; flex: 1"></bm-view>&ndash;&gt;
          &lt;!&ndash;<bm-marker&ndash;&gt;
            &lt;!&ndash;v-for="(marker, index) in markers"&ndash;&gt;
            &lt;!&ndash;:key="index"&ndash;&gt;
            &lt;!&ndash;:position="marker.point"&ndash;&gt;
            &lt;!&ndash;@click="infoWindowOpen(marker)"&ndash;&gt;
          &lt;!&ndash;&gt;&ndash;&gt;
            &lt;!&ndash;<bm-info-window&ndash;&gt;
              &lt;!&ndash;:position="marker.point"&ndash;&gt;
              &lt;!&ndash;:title="marker.title"&ndash;&gt;
              &lt;!&ndash;:show="marker.show"&ndash;&gt;
              &lt;!&ndash;@close="infoWindowClose(marker)"&ndash;&gt;
              &lt;!&ndash;@open="infoWindowOpen(marker)"&ndash;&gt;
            &lt;!&ndash;&gt;&ndash;&gt;
              &lt;!&ndash;<p>{{ marker.introduction }}</p>&ndash;&gt;
            &lt;!&ndash;</bm-info-window>&ndash;&gt;
          &lt;!&ndash;</bm-marker>&ndash;&gt;
        &lt;!&ndash;</baidu-map>&ndash;&gt;
        <el-card style="height: 100%">
          <div slot="header">
            <span>药品监管服务平台</span>
          </div>
          <el-row>
            <el-col>
              <div class="plat">
                <div
                  class="wrapper"
                  v-for="(item, index) in platData"
                  :key="index"
                >
                  <div class="item item1">
                    <span :class="[index < 3 ? 'top' : 'bottom']">
                      {{ index }}
                    </span>
                  </div>
                  <div class="item item2">
                    <span class="ellipsis">
                      {{ item.name }}
                    </span>
                  </div>
                  <div class="item item3">
                    <span>
                      {{ item.count }}
                    </span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div class="wrapper6 wrapper">
        <el-card style="height: 100%">
          <div slot="header">
            <span>平台热销排行</span>
          </div>
          <el-tabs v-model="activeName">
            <el-tab-pane label="全部" name="first">
              <div class="plat">
                <div
                  class="wrapper"
                  v-for="(item, index) in platData"
                  :key="index"
                >
                  <div class="item item1">
                        <span :class="[index < 3 ? 'top' : 'bottom']">
                          {{ index }}
                        </span>
                  </div>
                  <div class="item item2">
                        <span class="ellipsis">
                          {{ item.name }}
                        </span>
                  </div>
                  <div class="item item3">
                        <span>
                          {{ item.count }}
                        </span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="医院" name="second">
              <div class="plat">
                <div
                  class="wrapper"
                  v-for="(item, index) in platHotDataHospital"
                  :key="index"
                >
                  <div class="item item1">
                        <span :class="[index < 3 ? 'top' : 'bottom']">
                          {{ index }}
                        </span>
                  </div>
                  <div class="item item2">
                        <span class="ellipsis">
                          {{ item.name }}
                        </span>
                  </div>
                  <div class="item item3">
                        <span>
                          {{ item.count }}
                        </span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="药店" name="third">
              <div class="plat">
                <div
                  class="wrapper"
                  v-for="(item, index) in platHotDataShop"
                  :key="index"
                >
                  <div class="item item1">
                        <span :class="[index < 3 ? 'top' : 'bottom']">
                          {{ index }}
                        </span>
                  </div>
                  <div class="item item2">
                        <span class="ellipsis">
                          {{ item.name }}
                        </span>
                  </div>
                  <div class="item item3">
                        <span>
                          {{ item.count }}
                        </span>
                  </div>
                </div>
                </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
      <div class="wrapper7 wrapper">
        <el-card>
          <div slot="header">
            <span>用户来源</span>
          </div>
          <ve-histogram :data="histogramData" :settings="histogramSettings"></ve-histogram>
        </el-card>
      </div>
      <div class="wrapper8 wrapper"></div>
    </div>-->
  </div>
</template>

<script>
import Component from 'class-component'
import axios from 'axios'

@Component({
  components: {}
})
export default class Home {
  /**
   * 1.BMAP_NORMAL_MAP 2.BMAP_PERSPECTIVE_MAP 3.BMAP_SATELLITE_MAP 4.BMAP_HYBRID_MAP
   * @type {string}
   */
  mapType = 'BMAP_NORMAL_MAP';
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
  radarData = {
    columns: ['对象', '咨询', '包装', '描述', '服务', '配送'],
    rows: [
      { 对象: '药房(33)', 咨询: 5, 包装: 5, 描述: 5, 服务: 5, 配送: 5 },
      { 对象: '药店(22)', 咨询: 3, 包装: 3, 描述: 3, 服务: 3, 配送: 3 },
      { 对象: '全部(55)', 咨询: 4, 包装: 4, 描述: 4, 服务: 4, 配送: 4 }
    ]
  };
  radarSettings = {
    dimension: ['对象'],
    metrics: ['咨询', '包装', '描述', '服务', '配送']
  };
  scatterData = {
    columns: ['年龄', '全部', '医院', '药店'],
    rows: [
      { 年龄: '19-30', 全部: 123, 医院: 3, 药店: 1244 },
      { 年龄: '30-40', 全部: 1223, 医院: 6, 药店: 2344 },
      { 年龄: '41-60', 全部: 7123, 医院: 9, 药店: 3245 },
      { 年龄: '60+', 全部: 4123, 医院: 12, 药店: 4355 }
    ]
  };
  ringData11 = {
    columns: ['渠道', '数量'],
    rows: [
      { 渠道: '处方流出(26%, 1393)', 数量: 1393 },
      { 渠道: '其他(26%, 2530)', 数量: 3530 }
    ]
  };
  ringData12 = {
    columns: ['渠道', '数量'],
    rows: [
      { 渠道: '处方(26%, 1393)', 数量: 1393 },
      { 渠道: '其他(26%, 2530)', 数量: 3530 }
    ]
  };
  ringData13 = {
    columns: ['渠道', '数量'],
    rows: [
      { 渠道: '医保(26%, 1393)', 数量: 1393 },
      { 渠道: '其他(26%, 2530)', 数量: 3530 }
    ]
  };
  ringData2 = {
    columns: ['药品类别', '数量'],
    rows: [
      { 药品类别: '家庭常用(17% 3530)', 数量: 3530 },
      { 药品类别: '心脑血管(17%, 3530)', 数量: 3530 },
      { 药品类别: '抗肿瘤药(17%, 3530)', 数量: 3530 },
      { 药品类别: '五官科药(17%, 3530)', 数量: 3530 },
      { 药品类别: '妇科用品(17%, 3530)', 数量: 3530 },
      { 药品类别: '其他(17%, 3530)', 数量: 3530 }
    ]
  };
  ringSettings2 = {
    radius: [10, 100]
  }
  platData = [
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    }
  ]
  activeName = 'first'
  activeName3 = 'first'
  platHotData = [
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    }
  ]
  platHotDataHospital = [
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    }
  ]
  platHotDataShop = [
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    },
    {
      name: '999感冒灵',
      count: 323234
    }
  ]
  histogramSettings = {
    metrics: ['智慧昆山', '农商行', '其他'],
    dimension: ['日期']
  }
  histogramData = {
    columns: ['日期', '智慧昆山', '农商行', '其他'],
    rows: [
      { '日期': '1月', '智慧昆山': 1393, '农商行': 1093, '其他': 1000 },
      { '日期': '2月', '智慧昆山': 3530, '农商行': 3230, '其他': 1000 },
      { '日期': '3月', '智慧昆山': 2923, '农商行': 2623, '其他': 1000 },
      { '日期': '4月', '智慧昆山': 1723, '农商行': 1423, '其他': 1000 },
      { '日期': '5月', '智慧昆山': 3792, '农商行': 3492, '其他': 1000 },
      { '日期': '6月', '智慧昆山': 4593, '农商行': 4293, '其他': 1000 },
      { '日期': '7月', '智慧昆山': 4593, '农商行': 4293, '其他': 1000 },
      { '日期': '8月', '智慧昆山': 4593, '农商行': 4293, '其他': 1000 },
      { '日期': '9月', '智慧昆山': 4593, '农商行': 4293, '其他': 1000 },
      { '日期': '10月', '智慧昆山': 4593, '农商行': 4293, '其他': 1000 },
      { '日期': '11月', '智慧昆山': 4593, '农商行': 4293, '其他': 1000 },
      { '日期': '12月', '智慧昆山': 4593, '农商行': 4293, '其他': 1000 }
    ]
  }
  async beforeMount () {
  }
  mounted () {
    this.addPoints()
  }
  infoWindowClose (e) {
    e.show = false
  }
  infoWindowOpen (e) {
    e.show = true
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
  height: 100%;
}
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px 10px;
  .wrapper1 {
    grid-area: 1/1/2/2;
  }
  .wrapper3 {
    grid-area: 2/1/3/2;
  }
  .wrapper {
    background-color: white;
    z-index: 1;
    opacity: 0.9;
  }
  .wrapper7 {
    grid-area: 3/1/4/4;
  }
}
.plat {
  display: grid;
  grid-row-gap: 10px;
  .wrapper {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    grid-gap: 10px;
    .item {
      display: flex;
      overflow: hidden;
      align-items: center;
    }
    .item1 {
      span {
        border-radius: 50%;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
      }
      .top {
        background-color: rgb(43, 61, 79);
        color: white;
      }
      .bottom {
        background-color: rgb(238, 240, 244);
        color: black;
      }
    }
  }
}
</style>
