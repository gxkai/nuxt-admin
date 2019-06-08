<template>
  <div class="stock--wrap">
    <div class="stock--content">
      <div class="stock--content__search">
        <div class="left">
          <el-input v-model="stockName" size="small" placeholder="通用名称" style="width: 150px;"></el-input>
          <el-button class="select-btn value-btn" size="small" v-if="originNameValue" @click="originDialogVisible = true">{{ originNameValue }}</el-button>
          <el-button class="select-btn" size="small" v-else @click="originDialogVisible = true">厂商名称</el-button>
          <el-button type="primary" size="small" @click="searchDrugs">搜索</el-button>
          <el-button size="small" @click="clearConditions">清空</el-button>
        </div>
      </div>
      <d2-crud
        :columns="columns"
        :data="drugList"
        :pagination="pagination"
        :options="options"
        :rowHandle="rowHandle"
        @current-change="handleCurrentChange"
        @emit-select="handleCurrentChange"
        @pagination-current-change="paginationCurrentChange"
        class="drug-table"
      />
    </div>

    <!--选择厂商-->
    <el-dialog
      title="厂商"
      append-to-body
      :close-on-click-modal='isCloseOnClickModal'
      :visible.sync="originDialogVisible"
      width="50%">
      <drug-origin v-on:listenToChildEvent="getSelectedInfo"></drug-origin>
      <span slot="footer" class="dialog-footer">
        <el-button @click="originDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelectOrigin">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import Origin from '@/components/drugCheck/Origin'
  import axios from 'axios'

  @Component({
    components: {
      BreadCrumb,
      'drug-origin': Origin
    }
  })
  export default class shopDrugs extends Vue {
    stockName = ''
    originNameValue = ''
    isCloseOnClickModal = false
    originDialogVisible = false

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
        title: '厂商简称',
        key: 'originName'
      }
    ]
    drugList = []

    selectedInfo = '' // 子组件传过来的数据
    childData = [] // 暂存已选的数据

    rowHandle = {
      width: 50,
      align: 'center',
      columnHeader: '选择',
      custom: [
        {
          icon: 'el-icon-check',
          emit: 'emit-select'
        }
      ]
    }

    pagination = {
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
    options = {
      border: true,
      highlightCurrentRow: true
    }

    // 获取已选信息
    getSelectedInfo (data) {
      this.selectedInfo = data
    }
    // 选择厂商
    confirmSelectOrigin () {
      if (!this.selectedInfo) {
        this.originDialogVisible = false
        return
      }
      this.childData = this.selectedInfo
      this.originNameValue = this.childData.fullName
      this.originDialogVisible = false
    }

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getDrugs()
    }

    handleCurrentChange (rowData) {
      this.$emit('listenToChildEvent', rowData)
    }

    clearConditions () {
      this.stockName = ''
      this.originNameValue = ''
      this.getDrugs()
    }

    searchDrugs () {
      this.pagination.currentPage = 1
      this.getDrugs()
    }

    async getDrugs () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        name: this.stockName.trim(),
        originName: this.originNameValue.trim()
      }
      let {data: drugRes} = await axios.get(`/api/shop/shopDrugs`, {params})
      console.log(drugRes)
      this.drugList = drugRes.list
      this.pagination.total = drugRes.total
    }

    beforeMount () {
      this.getDrugs()
    }
  }
</script>

<style scoped lang="scss">
  .stock{
    &--wrap{
      padding: 0 10px;
      margin-bottom: 30px;
    }
    &--content{
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      &__search{
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e9e9e9;
        padding-bottom: 15px;

        .select-btn{
          width: 150px;
          padding: 8px 15px 9px;
          margin-right: 10px;
          color: #c0c4cc;
          text-align: left;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .value-btn{
          color: #606266;
        }

        .right{
          padding-right: 10px;
        }

        .el-input{
          margin: 0 10px;
        }
        .el-cascader{
          margin-right: 10px;
        }
      }
    }
  }
  /deep/.drug-table{
    padding: 0 10px;
    .el-table{
      .el-button{
        width: 15px;
        height: 15px;
        line-height: initial;
        padding: 0;
        color: #FFF;
        font-size: 12px;
        border-radius: 2px;

        &:hover, &:focus{
          border-color: #409EFF;
          background-color: #FFF;
        }
      }

      .current-row .el-button{
        background: #409EFF;
        border-color: #409EFF;
      }
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
