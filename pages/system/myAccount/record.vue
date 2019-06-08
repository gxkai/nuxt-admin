<template>
  <div class="record-wrap">
    <div class="record-list">
      <bread-crumb :path="$route.path"/>
      <div class="title">
        <h3>交易记录</h3>
        <el-button type="primary" size="small" @click="$router.push('/system/myAccount')">返回</el-button>
      </div>
      <div class="record-search">
        <div class="item item1">
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编号：
            <el-input
              size="small"
              style="width: 260px;"
              placeholder="请输入编号"
              v-model="orderNumber">
            </el-input>
          </div>
          <div>
            药品名称：
            <el-input
              size="small"
              style="width: 260px;"
              placeholder="请输入药品名称"
              v-model="drugNameValue">
            </el-input>
          </div>
          <div>
            当前状态：
            <el-select size="small" v-model="orderStateValue" style="width: 260px;" placeholder="请选择">
              <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="item item2">
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;时间：
            <el-date-picker
              size="small"
              style="width: 260px;"
              :clearable="isClearable"
              v-model="orderDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="convertDate">
            </el-date-picker>
          </div>
          <div></div>
          <div class="action-btns">
            <el-button type="primary" size="small" @click="searchOrder">搜 索</el-button>
            <el-button size="small" @click="clearCondition">清 空</el-button>
          </div>
        </div>
      </div>
      <div class="trans-list">
        <d2-crud
          ref="d2Crud"
          :columns="columns"
          :data="recordList"
          :pagination="pagination"
          @pagination-current-change="paginationCurrentChange"
          :options="options"
          :rowHandle="rowHandle"
          @emit-view="viewRecord"
          @row-remove="removeRecord"
          class="drug-table"
        />
      </div>
    </div>

    <!--查看-->
    <el-dialog
      title="查看"
      :visible.sync="viewDialogVisible"
      width="30%">
      <el-form ref="viewForm" :model="viewData" label-width="120px">
        <el-form-item label="序号">
          <el-input v-model="viewData.index" readonly></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-input v-model="viewData.createdDate" readonly></el-input>
        </el-form-item>
        <el-form-item label="药品名称">
          <el-input v-model="viewData.drugName" readonly></el-input>
        </el-form-item>
        <el-form-item label="订单编号/退单号">
          <el-input v-model="viewData.number" readonly></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="viewData.stateName" readonly></el-input>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="viewData.price" readonly></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
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
  export default class Record extends Vue {
    viewDialogVisible = false
    isClearable = false
    viewData = {}
    orderNumber = ''
    orderDate = ''
    startDate = ''
    endDate = ''
    drugNameValue = ''
    orderStateValue = ''
    // 订单状态
    stateOptions = [
      {
        label: '待入账',
        value: 'WAIT'
      },
      {
        label: '成功',
        value: 'SUCCESS'
      },
      {
        label: '失败',
        value: 'FAIL'
      }
    ]

    recordList = []
    columns= [
      {
        title: '序号',
        key: 'index'
      },
      {
        title: '时间',
        key: 'createdDate'
      },
      {
        title: '药品名称',
        key: 'drugName'
      },
      {
        title: '订单编号/退单号',
        key: 'number'
      },
      {
        title: '状态',
        key: 'stateName'
      },
      {
        title: '金额',
        key: 'price'
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

    rowHandle = {
      custom: [
        {
          text: '查看',
          type: 'text',
          emit: 'emit-view'
        }
      ]
    }

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.initData()
    }

    viewRecord ({row}) {
      this.viewDialogVisible = true
      this.viewData = row
    }

    removeRecord ({index, row}, done) {
      console.log(row)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      done()
    }

    clearCondition () {
      this.orderNumber = ''
      this.orderDate = ''
      this.drugNameValue = ''
      this.orderStateValue = ''
      this.initData()
    }

    convertDate () {
      if (this.orderDate) {
        for (let i = 0, len = this.orderDate.length; i < len; i++) {
          this.orderDate[i] = moment(this.orderDate[i]).format('YYYY-MM-DD')
        }
        this.startDate = `${this.orderDate[0]} 00:00:00`
        this.endDate = `${this.orderDate[1]} 23:59:59`
      }
    }

    searchOrder () {
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
        pageSize: this.pagination.pageSize,
        startDate: this.startDate,
        endDate: this.endDate,
        drugName: this.drugNameValue,
        state: this.orderStateValue,
        number: this.orderNumber
      }
      let {data: bill} = await axios.get(`/api/shop/bill`, {params})
      this.pagination.total = bill.total
      this.recordList = bill.list
      this.recordList.forEach((item, index) => {
        item.index = index + 1
        item.stateName = this.convertState(item.state)
        item.createdDate = moment(item.createdDate).format('YY-MM-DD HH:ss:mm')
      })
    }

    beforeMount () {
      this.initData()
    }
  }
</script>

<style scoped lang="scss">
  .record{
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
    }

    &-search{
      margin: 15px;
      padding: 15px 30px 15px 0;
      font-size: 15px;
      background: #f4f4f4;

      .item{
        display: flex;
        align-items: center;
        justify-content: space-between;

        &1{
          padding-bottom: 20px;

          div{
            &:first-child{
              text-align: left;
            }
            &:nth-child(2){
              text-align: center;
            }
            &:last-child{
              text-align: right;
            }
          }
        }

        div{
          flex: 1;
        }

        .action-btns{
          text-align: right;
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
