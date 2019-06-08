<template>
  <div class="sale-wrap">
    <el-row>
      <div class="filter">
        <el-button size="small" type="primary">近一周</el-button>
        <el-button size="small" type="primary">近一月</el-button>
        <el-button size="small" type="primary">近一年</el-button>
      </div>
      <div class="sales-pie">
        <ve-pie :data="pieData"></ve-pie>
      </div>
    </el-row>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'class-component'

  @Component
  export default class Rx extends Vue {
    pieData = {
      columns: ['名称', '数量'],
      rows: [
        { '名称': '非处方', '数量': 1393 },
        { '名称': '处方', '数量': 3530 }
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
