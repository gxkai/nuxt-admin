<template>
  <div>
    <div ref="average" style="width: 100%; height: 100px;"></div>
  </div>
</template>

<script>
  import ECharts from 'echarts'
  import Component from 'class-component'

  @Component
  export default class Access {
    seriesData = [80, 40, 30, 150, 90, 150, 100, 90, 120, 50, 80, 60, 148, 66]

    option = {
      tooltip: {
        show: false
      },
      grid: {
        left: -25,
        right: 5,
        top: 20,
        bottom: 0,
        containLabel: true
      },
      color: ['#7EDAE4'], // 折线颜色
      xAxis: [
        {
          show: false,
          boundaryGap: false,
          data: ['崇左市', '来宾市', '河池市', '贺州市', '百色市', '玉林市', '贵港市', '钦州市', '防城港市', '北海市', '梧州市', '桂林市', '柳州市', '南宁市']
        }
      ],
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'line',
          symbol: 'none',
          smooth: true, // 是否平滑曲线显示
          itemStyle: {
            normal: {
              areaStyle: {
                color: '#DFF6F8'
              }
            }
          },
          data: this.seriesData
        }
      ]
    };

    initConversion (ele) {
      let average = ECharts.init(ele)
      average.setOption(this.option)

      // 自适应大小
      window.addEventListener('resize', () => {
        average.resize()
      })
    }

    mounted () {
      this.$nextTick(() => {
        this.initConversion(this.$refs.average)
      })
    }
  }
</script>
