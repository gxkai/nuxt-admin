<template>
  <div class="common-wrap">
    <div class="common-list">
      <bread-crumb :path="$route.path"/>
      <div class="common-search">
        <div class="left">
          <el-input v-model="specNameValue" size="small" placeholder="请输入规格名称" style="width: 200px;"></el-input>
          <el-button type="primary" size="small" @click="searchSpec">搜索</el-button>
          <el-button size="small" @click="clear">清空</el-button>
        </div>
      </div>
      <div>
        <d2-crud
          :columns="columns"
          :data="specList"
          :loading="loading"
          :pagination="pagination"
          @pagination-current-change="paginationCurrentChange"
          :options="options"
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
  export default class Spec extends Vue {
    specNameValue = ''
    columns = [
      {
        title: '序号',
        key: 'index',
        width: 100,
        align: 'center'
      },
      {
        title: '规格名称',
        key: 'name'
      }
    ]
    specList = []
    loading = false;
    pagination = {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options = {
      border: true
    }
    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getAllSpecs()
    }
    async getAllSpecs () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        name: this.specNameValue.trim()
      }
      let {data: specs} = await axios.get(`/api/shop/specs`, {params})
      this.specList = specs.list
      this.pagination.total = specs.total
      this.specList.forEach((item, index) => {
        item.index = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
      })
    }
    mounted () {
      this.getAllSpecs()
    }
    // 搜索
    searchSpec () {
      this.getAllSpecs()
    }
    clear () {
      this.specNameValue = ''
      this.getAllSpecs()
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
