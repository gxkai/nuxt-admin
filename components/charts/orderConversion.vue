<template>
  <div>
    <div ref="conversion" style="width: 100%; height:80px;"></div>
  </div>
</template>

<script>
  import ECharts from 'echarts'
  import Component from 'class-component'

  @Component
  export default class Conversion {
    seriesData = [100, 70, 50, 60, 40, 45, 60, 110, 40, 60, 80, 120]

    option = {
      // 调整图表位置
      grid: {
        left: 0,
        right: 0,
        top: 20,
        bottom: 20
      },
      tooltip: {},

      // X轴配置项
      xAxis: {
        show: false,
        type: 'category'
      },

      // Y轴配置项
      yAxis: {
        show: false
      },

      series: [{
        name: '用户下单数',
        type: 'bar',
        barGap: 5,
        barWidth: 10, // 柱条宽度
        itemStyle: { // 柱条样式
          color: '#3BA1FF'
        },
        data: this.seriesData
      }]
    }

    initConversion (ele) {
      let conversion = ECharts.init(ele)

      conversion.setOption(this.option)

      // 自适应大小
      window.addEventListener('resize', () => {
        conversion.resize()
      })
    }

    mounted () {
      this.$nextTick(() => {
        this.initConversion(this.$refs.conversion)
      })
    }
  }
</script>
