<template>
  <div>
    <div ref="conversion" style="width: 100%; height: 430px;"></div>
  </div>
</template>

<script>
  import ECharts from 'echarts'
  import Component from 'class-component'

  @Component
  export default class Conversion {
    seriesData = [300, 750, 1000, 500, 100, 500, 250, 300, 750, 500, 250, 300]
    xAxisData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

    option = {
      title: {
        text: '用户下单数趋势',
        padding: [30, 0, 0, 0]
      },
      // 调整图表位置
      grid: {
        x: 55,
        y: 80,
        x2: 20,
        y2: 30
      },
      tooltip: {},
      // X轴配置项
      xAxis: [
        {
          data: this.xAxisData,
          axisLine: {
            lineStyle: {
              color: '#D9D9D9',
              width: 1.5
            }
          },
          axisTick: { // X轴刻度线
            alignWithLabel: true, // 刻度在柱条下方
            lineStyle: {
              color: '#D9D9D9',
              width: 1.5
            }
          },
          axisLabel: { // 刻度标签样式
            color: '#333',
            fontSize: '14',
            margin: '15'
          }
        }
      ],
      // Y轴配置项
      yAxis: [
        {
          type: 'value',
          axisLine: { // Y轴
            show: false
          },
          axisTick: { // Y轴刻度线
            show: false
          },
          splitLine: { // 网格线
            show: true,
            lineStyle: { // 分隔线样式
              type: 'dashed',
              color: '#E8E8E8',
              width: 1.5
            }
          },
          axisLabel: { // Y轴刻度标签样式
            color: '#333',
            fontSize: '13',
            margin: '15'
          }
        }
      ],
      series: [{
        name: '用户下单数',
        type: 'bar',
        barWidth: 25, // 柱条宽度
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
