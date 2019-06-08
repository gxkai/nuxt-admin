<template>
  <div class="common-wrap">
    <div class="common-list">
      <bread-crumb :path="$route.path"/>
      <h3 class="h3-title">日汇总</h3>

      <div style="margin-left: 10px;">
        <el-select v-model="dayValue" placeholder="请选择" size="small">
          <el-option
            v-for="item in dayOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <d2-crud
        :columns="columns"
        :data="dayData"
        :loading="loading"
        :pagination="pagination"
        :options="options"
        @pagination-current-change="paginationCurrentChange"

        :rowHandle="rowHandle"
        @emit-detail="handleDetail"

        class="drug-table"
      />

    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  // import axios from 'axios'
  @Component({
    components: {
      BreadCrumb
    }
  })
  export default class DaySummary extends Vue {
    dayValue = ''
    dayOptions = [
      {
        value: '2019年4月1日汇总',
        label: '2019年4月1日汇总'
      }
    ]

    columns = [
      {
        title: '序号',
        key: 'index',
        width: 100,
        align: 'center'
      },
      {
        title: '结算日期',
        key: 'settlement'
      },
      {
        title: '收入',
        key: 'income'
      },
      {
        title: '支出',
        key: 'expend'
      },
      {
        title: '余额',
        key: 'balance'
      }
    ]
    dayData = [
      {
        index: 1,
        settlement: '2019-04-01',
        income: 1000,
        expend: 100,
        balance: 2000
      },
      {
        index: 2,
        settlement: '2019-04-01',
        income: 1000,
        expend: 100,
        balance: 2000
      }
    ]
    loading = false
    pagination = {
      currentPage: 1,
      pageSize: 15,
      total: this.dayData.length
    }
    options = {
      border: true
    }

    rowHandle = {
      custom: [
        {
          text: '查看明细',
          type: 'text',
          size: 'small',
          emit: 'emit-detail'
        }
      ]
    }

    // 查看明细
    handleDetail ({index, row}) {
      console.log(row)
      this.$router.push('/system/statement/day/detail')
    }

    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
    }
  }
</script>

<style lang="scss" scoped>
  .common {
    &-wrap {
      padding: 0 10px;
      margin-bottom: 30px;
    }
    &-list{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .h3-title{
        border-bottom: 1px solid #E9E9E9;
        padding: 0 15px 15px 15px;
        margin: 15px 0;
      }
    }
  }
  /deep/.drug-table{
    padding: 0 10px;
    .el-table{
      th{
        background-color: #F4F4F4 !important;
        color: #555 !important;
      }
      td{
        .cell{
          /deep/.el-button+.el-button{
            margin-left: 5px;
            &::before{
              content: '|';
              padding-right: 5px;
              color: #eee;
            }
          }
        }
      }
    }
  }
</style>
