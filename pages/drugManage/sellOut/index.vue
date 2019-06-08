<template>
  <div class="soldOut-wrap">
    <div class="soldOut-list">
      <bread-crumb :path="$route.path"/>
      <div class="title">
        <h3>售磬列表</h3>
      </div>
      <d2-crud
        ref="d2Crud"
        :columns="columns"
        :data="sellOutList"
        :loading="loading"
        :pagination="pagination"
        :options="options"
        :rowHandle="rowHandle"
        @dialog-cancel="handleDialogCancel"
        @pagination-current-change="paginationCurrentChange"
        @emit-view="viewDetail"
        @emit-storage="storageDrug"
        class="drug-table"
      />
    </div>

    <!--查看-->
    <el-dialog
      title="查看"
      :visible.sync="viewDialogVisible"
      width="30%">
      <div class="main">
        <el-form :model="viewData" label-width="100px">
          <el-form-item label="药品名称">
            <el-input v-model="viewData.drugName" readonly placeholder="暂无"></el-input>
          </el-form-item>
          <el-form-item label="通用名称">
            <el-input v-model="viewData.commonName" readonly placeholder="暂无"></el-input>
          </el-form-item>
          <el-form-item label="规格">
            <el-input v-model="viewData.specName" readonly placeholder="暂无"></el-input>
          </el-form-item>
          <el-form-item label="厂商简介">
            <el-input v-model="viewData.originName" readonly placeholder="暂无"></el-input>
          </el-form-item>
          <el-form-item label="当前状态">
            <el-input v-model="viewData.status" readonly placeholder="暂无"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!--入库-->
    <el-dialog
      title="入库"
      :visible.sync="storageDialogVisible"
      width="30%">
      <div class="storage">
        库存：
        <el-input-number size="small" v-model="storageNum" placeholder="请输入库存数量"
                         controls-position="right" :min="0" :max="100000"
                         style="width: 200px;"></el-input-number>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="storageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import axios from 'axios'

  @Component({
    components: {
      BreadCrumb
    }
  })
  export default class SoldOUt extends Vue {
    sellOutList = [] // 预警列表
    rowData = {}
    viewData = []
    viewDialogVisible = false
    storageNum = '' // 库存量
    storageDialogVisible = false

    columns = [
      {
        title: '药品名称',
        key: 'drugName'
      },
      {
        title: '通用名称',
        key: 'commonName'
      },
      {
        title: '规格',
        key: 'specName'
      },
      {
        title: '厂商简介',
        key: 'originName'
      },
      {
        title: '当前状态',
        key: 'status'
      }
    ]
    loading = false;
    pagination = {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options = {
      border: true
    }
    rowHandle = {
      custom: [
        {
          text: '查看',
          type: 'text',
          emit: 'emit-view'
        },
        {
          text: '入库',
          type: 'text',
          emit: 'emit-storage'
        }
      ]
    }

    handleDialogCancel (done) {
      this.$message({
        message: '取消保存',
        type: 'warning'
      })
      done()
    }

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.fetchData()
    }

    // 查看
    viewDetail ({row}) {
      this.viewDialogVisible = true
      this.viewData = row
    }

    // 入库
    storageDrug ({row}) {
      this.rowData = row
      this.storageDialogVisible = true
    }

    // 提交
    async submit () {
      let params = new FormData()
      params.append('number', this.storageNum)

      await axios.put(`/api/shop/stocks/${this.rowData.id}`, params)
      this.fetchData()
      this.$message({
        message: '入库成功',
        type: 'success'
      })
      this.storageDialogVisible = false
    }

    async fetchData () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
        // shopId: 'BKDKbvDHTjKclO0Lu4sAQA'
      }
      let {data: sell} = await axios.get(`/api/shop/stocks/sellOut`, {params})
      console.log(sell)
      this.sellOutList = sell.list
      this.pagination.total = sell.total

      this.sellOutList.forEach(item => {
        item.status = '售磬'
      })
    }

    beforeMount () {
      this.fetchData()
    }
  }
</script>

<style lang="scss" scoped>
  .soldOut{
    &-wrap{
      padding: 0 10px;
      margin-bottom: 30px;

      .storage{
        padding-left: 20px;
        font-size: 15px;
      }
    }

    &-list{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .title{
        padding: 0 15px;
        border-bottom: 1px solid #E9E9E9;
      }
    }

    &-search {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e9e9e9;
      padding-bottom: 15px;

      .right{
        padding-right: 10px;
      }

      .el-input {
        margin: 0 10px;
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
