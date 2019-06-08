<template>
  <div class="common-wrap">
    <div class="common-list">
      <bread-crumb :path="$route.path"/>
      <div class="common-search">
        <div class="left">
          <el-input v-model="commonNameValue" size="small" placeholder="请输入通用名" style="width: 200px;"></el-input>
          <el-button type="primary" size="small" @click="search">搜索</el-button>
          <el-button size="small" @click="clear">清空</el-button>
        </div>
      </div>
      <div>
        <d2-crud
          :columns="columns"
          :data="commonNameData"
          :loading="loading"
          :pagination="pagination"
          :options="options"
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
  @Component({
    components: {
      BreadCrumb
    }
  })
  export default class CommonName extends Vue {
    commonNameValue = ''
    columns = [
      {
        title: '序号',
        key: 'index',
        width: 100,
        align: 'center'
      },
      {
        title: '通用名',
        key: 'name'
      }
    ]
    commonNameData = []
    loading = false
    pagination = {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options = {
      border: true
    }
    beforeMount () {
      this.getData()
    }
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getData()
    }
    async getData () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: 15,
        name: this.commonNameValue.trim()
      }
      let data = await axios.get(`/api/shop/commonNames`, {params: params})
      this.commonNameData = data.data.list
      this.pagination.total = data.data.total
      this.commonNameData.forEach((item, index) => {
        item.index = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
      })
    }
    // 清空
    clear () {
      this.commonNameValue = ''
      this.getData()
    }
    // 查询
    search () {
      this.pagination.currentPage = 1
      this.getData()
    }
  }
</script>

<style lang="scss" scoped>
  .common{
    &-wrap{
      padding: 0 10px;
      margin-bottom: 30px;
    }

    &-list{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;
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
