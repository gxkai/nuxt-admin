<template>
  <div>
    <div ref="channel" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script>
  import ECharts from 'echarts'
  import Component from 'class-component'

  @Component
  export default class channel {
    colorData = ['#3BA0FF', '#36CBCB', '#4DCB73', '#FAD337', '#F2637B', '#975FE4', '#748BFA']
    legendData = ['家庭常用', '呼吸系统', '肝胆用药', '营养滋补', '男科用药', '其他']

    // value中只能是Number类型
    seriesData = [
      {
        name: '家庭常用',
        value: 120000
      },
      {
        name: '呼吸系统',
        value: 230000
      },
      {
        name: '肝胆用药',
        value: 450000
      },
      {
        name: '营养滋补',
        value: 800000
      },
      {
        name: '男科用药',
        value: 520000
      },
      {
        name: '其他',
        value: 200000
      }
    ];

    option = {
      color: this.colorData,
      title: {
        text: '在售药品总数',
        textStyle: {
          fontSize: 15,
          color: '#929292',
          fontWeight: 100
        },
        subtext: '122356',
        subtextStyle: {
          fontSize: 25,
          color: '#272727'
        },
        left: '24%',
        top: '44%',
        textAlign: 'center'
      },
      legend: {
        icon: 'circle',
        orient: 'vertical', // 布局朝向 vertical：列向，horizontal：横向
        x: 'right',
        top: 'middle',
        left: '55%',
        data: this.legendData,
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 15,
        formatter: name => {
          let data = this.seriesData
          let target = ''
          let total = 0
          for (let i = 0; i < data.length; i++) {
            total += data[i].value
            if (this.seriesData[i].name === name) {
              target = this.seriesData[i].value
            }
          }
          let arr = ['{a|' + name + '(' + ((target / total) * 100).toFixed(2) + '%)' + '}', '{b|' + target + '}']
          return arr
        },
        textStyle: {
          rich: {
            a: {
              fontSize: 15,
              padding: [0, 5, 0, 15]
            },
            b: {
              fontSize: 15,
              padding: [0, 0, 0, 10]
            }
          }
        }
      },
      // hover提示
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      series: [{
        name: '在售药品',
        type: 'pie',
        clockwise: false, // 饼图的扇区是否是顺时针排布
        minAngle: 20, // 最小的扇区角度（0 ~ 360）
        radius: ['40%', '58%'],
        center: ['25%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { // 图形样式
          normal: {
            borderColor: '#FFF',
            borderWidth: 5
          }
        },
        label: {
          normal: {
            show: false,
            formatter: '{d}%'
          },
          emphasis: {
            show: false
          }
        },
        data: this.seriesData
      }]
    }

    initConversion (ele) {
      let channel = ECharts.init(ele)

      channel.setOption(this.option)

      setTimeout(() => {
        channel.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 0
        })

        channel.on('mouseover', params => {
          if (params.name === this.seriesData[0].name) {
            channel.dispatchAction({
              type: 'highlight',
              seriesIndex: 0,
              dataIndex: 0
            })
          } else {
            channel.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
              dataIndex: 0
            })
          }
        })

        channel.on('mouseout', params => {
          channel.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: 0
          })
        })
      }, 1000)

      // 自适应大小
      window.addEventListener('resize', () => {
        channel.resize()
      })
    }

    mounted () {
      this.$nextTick(() => {
        this.initConversion(this.$refs.channel)
      })
    }
  }
</script>
