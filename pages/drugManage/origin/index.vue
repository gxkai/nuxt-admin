<template>
  <div class="origin-wrap">
    <div class="origin-list">
      <bread-crumb :path="$route.path"/>
      <div class="origin-search">
        <el-input v-model.trim="originSimpleNameValue" size="small" placeholder="请输入厂商简称" style="width: 200px;"></el-input>
        <el-input v-model.trim="originFullNameValue" size="small" placeholder="请输入厂商全称" style="width: 200px;"></el-input>
        <el-button type="primary" size="small" @click="searchSpec">搜索</el-button>
        <el-button size="small" @click="clear">清空</el-button>
      </div>
      <div>
        <d2-crud
          ref="d2Crud"
          :columns="columns"
          :data="OriginList"
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

  export default class Origin extends Vue {
    originSimpleNameValue = ''
    originFullNameValue = ''
    columns = [
      {
        title: '序号',
        key: 'index',
        width: 80,
        align: 'center'
      },
      {
        title: '厂商简称',
        key: 'name'
      },
      {
        title: '厂商全称',
        key: 'fullName'
      }
    ]
    OriginList = []
    pagination = {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options = {
      border: true,
      highlightCurrentRow: true
    }

    clear () {
      this.originSimpleNameValue = ''
      this.originFullNameValue = ''
      this.getAllSpecs()
    }

    searchSpec () {
      this.pagination.currentPage = 1
      this.getAllSpecs()
    }

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getAllSpecs()
    }

    async getAllSpecs () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        name: this.originSimpleNameValue,
        fullName: this.originFullNameValue
      }
      let {data: originData} = await axios.get(`/api/shop/origins`, {params})
      this.OriginList = originData.list
      this.pagination.total = originData.total
      this.OriginList.forEach((item, index) => {
        item.index = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
      })
    }

    beforeMount () {
      this.getAllSpecs()
    }
  }
</script>

<style lang="scss" scoped>
  .origin{
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

    &-search{
      /*display: flex;*/
      /*align-items: center;*/
      /*justify-content: space-between;*/
      border-bottom: 1px solid #e9e9e9;
      padding-bottom: 15px;

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
