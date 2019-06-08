<template>
  <div>
    <div ref="completion" style="width: 100%; height: 80px;"></div>
  </div>
</template>

<script>
  import ECharts from 'echarts'
  import Component from 'class-component'

  @Component
  export default class Access {
    seriesData = [78]

    option = {
      tooltip: {
        formatter: params => {
          return `订单完成率：${params.value}%`
        }
      },
      grid: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 20,
        containLabel: true
      },
      xAxis: {
        show: false
      },
      yAxis: {
        type: 'category',
        show: false
      },
      series: [
        {
          show: true,
          type: 'bar',
          barGap: '-100%', // 重叠
          silent: true, // 取消hover
          barWidth: 15,
          data: [100],
          itemStyle: {
            normal: {
              color: '#f0f2f5'
            }
          }
        },

        // 亮色条 百分比
        {
          show: true,
          type: 'bar',
          barWidth: 15,
          data: this.seriesData,
          itemStyle: {
            normal: {
              color: '#1890ff'
            }
          }
        }
      ]
    };

    initConversion (ele) {
      let completion = ECharts.init(ele)
      completion.setOption(this.option)

      // 自适应大小
      window.addEventListener('resize', () => {
        completion.resize()
      })
    }

    mounted () {
      this.$nextTick(() => {
        this.initConversion(this.$refs.completion)
      })
    }
  }
</script>
