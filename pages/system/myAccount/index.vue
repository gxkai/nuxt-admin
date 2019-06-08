<template>
  <div class="account-wrap">
    <div class="account-list">
      <bread-crumb :path="$route.path"/>
      <div class="title">
        <h3>我的账户</h3>
      </div>
      <div class="income">
        <div>
          <strong>七天收入（截至今日0点）：</strong>
          {{ income ? income : '0'}}元
        </div>
        <div>
          <strong>待结算：</strong>
          {{ forIncome ? forIncome : '0'}}元
        </div>
        <!--<div>-->
          <!--<strong>账户总金额：</strong>-->
          <!--{{ totalAmount }}元-->
        <!--</div>-->
      </div>
      <div class="transaction-record">
        <div class="title">
          <h4>近期交易记录</h4>
          <el-button type="primary" size="small" @click="$router.push('/system/myAccount/record')">更多</el-button>
        </div>
        <d2-crud
          ref="d2Crud"
          :options="options"
          :columns="columns"
          :data="recordList"
          :pagination="pagination"
          @pagination-current-change="paginationCurrentChange"
          class="drug-table"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import axios from 'axios'
  import moment from 'moment'

  @Component({
    components: {
      BreadCrumb
    }
  })
  export default class Account extends Vue {
    recordList = []
    income = '' // 七天收入
    forIncome = '' // 待结算
    totalAmount = '' // 账户总金额

    columns= [
      {
        title: '序号',
        key: 'index'
      },
      {
        title: '日期',
        key: 'createdDate'
      },
      {
        title: '金额',
        key: 'price'
      },
      {
        title: '状态',
        key: 'stateName'
      },
      {
        title: '账户余额',
        key: 'number'
      },
      {
        title: '备注/说明',
        key: 'remark'
      }
    ]

    pagination= {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }

    options= {
      border: true
    }

    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.initData()
    }

    // 转换状态
    convertState (state) {
      switch (state) {
        case 'WAIT':
          return '待入账'
        case 'SUCCESS':
          return '成功'
        case 'FAIL':
          return '失败'
      }
    }

    async initData () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      let {data: bill} = await axios.get(`/api/shop/bill`, {params})
      console.log(bill)
      this.pagination.total = bill.shopBillList.total
      this.recordList = bill.shopBillList.list
      this.recordList.forEach((item, index) => {
        item.index = index + 1
        item.stateName = this.convertState(item.state)
        item.createdDate = moment(item.createdDate).format('YY-MM-DD HH:ss:mm')
      })

      // 账户信息
      this.income = bill.income
      this.forIncome = bill.forIncome
      this.totalAmount = bill.totalAmount
    }

    beforeMount () {
      this.initData()
    }
  }
</script>

<style scoped lang="scss">
  .account{
    &-wrap{
      padding: 0 10px;
      margin-bottom: 30px;
    }

    &-list{
      min-height: 850px;
      padding: 10px;
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e9e9e9;
        padding: 0 15px;
      }

      .income{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30px 15px 20px;
        margin-bottom: 20px;

        div{
          flex: 1;
        }
      }
    }
  }

  /deep/.drug-table{
    margin-top: 15px;
    .d2-crud-body{
      padding: 0  15px !important;
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
  }
</style>
