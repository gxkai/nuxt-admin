<template>
  <div class="sale-wrap">
    <el-row>
      <div class="search">
        <el-select v-model="value8" filterable placeholder="请选择">
          <el-option
            v-for="item in list"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary">搜索</el-button>
        <el-button>清空</el-button>
      </div>
    </el-row>

    <el-row>
      <div class="filter">
        <el-button size="small" type="primary">近一周</el-button>
        <el-button size="small" type="primary">近一月</el-button>
        <el-button size="small" type="primary">近一年</el-button>
      </div>
      <div class="sales-pillar">
        <ve-histogram :data="pillarData"></ve-histogram>
      </div>
    </el-row>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'class-component'

  @Component
  export default class Order extends Vue {
    list = [{
      value: '选项1',
      label: '黄金糕'
    }, {
      value: '选项2',
      label: '双皮奶'
    }, {
      value: '选项3',
      label: '蚵仔煎'
    }, {
      value: '选项4',
      label: '龙须面'
    }, {
      value: '选项5',
      label: '北京烤鸭'
    }];

    value8 = '';

    chartSettings = {
      xAxisType: 'time'
    };

    pillarData = {
      columns: ['日期', '访问用户', '下单用户', '下单率'],
      rows: [
        { '日期': '2018-01-01', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
        { '日期': '2018-01-02', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
        { '日期': '2018-01-03', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
        { '日期': '2018-01-05', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
        { '日期': '2018-01-10', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
        { '日期': '2018-01-20', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
      ]
    };

    mounted () {

    }
  }
</script>

<style lang="scss" scoped>

  .sale-wrap{
    padding: 20px;

    .filter{
      text-align: center;
      margin: 30px 0;

      .el-button+.el-button {
        margin-left: 0;
      }
    }
  }

</style>
