<template>
  <div class="shop-sale">
    <div class="filter">
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

    <div class="list">
      <d2-crud
        :columns="columnData"
        :data="data"
        :options="optionData"
        :pagination="pagination"/>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'class-component'

  @Component
  export default class ShopSale extends Vue {
    list = [
      {
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
      }
    ];

    value8 = '';

    columnData = [
      {
        title: '排序',
        key: 'sort',
        width: '300'
      },
      {
        title: '药店名称',
        key: 'pharmacyName'
      },
      {
        title: '销售额',
        key: 'sales',
        width: '300'
      }
    ];
    data = [
      {
        sort: 1,
        pharmacyName: '百佳惠',
        sales: 207060.8
      },
      {
        sort: 2,
        pharmacyName: '天顺药房',
        sales: 79472.4
      }
    ];
    pagination = {
      currentPage: 1,
      pageSize: 1,
      total: this.data.length
    };
    optionData = {
      border: true
    };
    mounted () {
    }
  }
</script>
