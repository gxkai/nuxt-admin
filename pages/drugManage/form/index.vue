<template>
  <div class="common-wrap">
    <div class="common-list">
      <bread-crumb :path="$route.path"/>
      <div class="common-search">
        <div class="left">
          <el-input v-model="formNameValue" size="small" placeholder="请输入药剂名称" style="width: 200px;"></el-input>
          <el-button type="primary" size="small" @click="searchDosageForm">搜索</el-button>
          <el-button size="small" @click="clear">清空</el-button>
        </div>
      </div>
      <div>
        <d2-crud
          :columns="dosageFormColumns"
          :data="dosageFormList"
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
  export default class Form extends Vue {
    formNameValue = ''
    dosageFormColumns = [
      {
        title: '序号',
        key: 'index',
        width: 100,
        align: 'center'
      },
      {
        title: '编码',
        key: 'code'
      },
      {
        title: '剂型名称',
        key: 'name'
      }
    ]
    dosageFormList = []
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
      this.getAllForms()
    }
    async getAllForms () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        name: this.formNameValue.trim(),
        code: ''
      }
      let {data: formData} = await axios.get(`/api/shop/forms`, {params})
      // console.log(formData)
      this.dosageFormList = formData.list
      this.pagination.total = formData.total
      this.dosageFormList.forEach((item, index) => {
        item.index = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
      })
    }
    beforeMount () {
      this.getAllForms()
    }
    // 搜索
    searchDosageForm () {
      this.pagination.currentPage = 1
      this.getAllForms()
    }
    // 清除
    clear () {
      this.formNameValue = ''
      this.getAllForms()
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
