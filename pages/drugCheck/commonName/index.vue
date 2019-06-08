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

        <div class="right">
          <el-button type="primary" @click="addRow" style="background: #169bd5;">新增</el-button>
        </div>
      </div>
      <div>
        <d2-crud
          ref="d2Crud"
          :columns="columns"
          :data="commonNameData"
          :loading="loading"
          :pagination="pagination"
          :options="options"
          :rowHandle="rowHandle"
          :edit-template="editTemplate"
          :form-options="formOptions"
          @row-edit="handleRowEdit"
          @row-remove="handleRowRemove"
          @row-add="handleRowAdd"
          add-title="我的新增"
          :add-template="addTemplate"
          :add-rules="addRules"
          @dialog-cancel="handleDialogCancel"
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
        width: 60
      },
      {
        title: '通用名',
        key: 'name'
      }
    ]
    commonNameData = []
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
      columnHeader: '操作',
      edit: {
        text: '编辑',
        type: 'text'
      },
      remove: {
        text: '删除',
        type: 'text',
        confirm: true
      }
    }
    editTemplate = {
      name: {
        title: '通用名',
        value: ''
      }
    }
    addTemplate = {
      name: {
        title: '通用名',
        value: ''
      }
    }
    formOptions = {
      labelWidth: '80px',
      labelPosition: 'right',
      saveLoading: false
    }
    addRules = {
      name: [ { required: true, message: '请输入通用名', trigger: 'blur' } ]
    }
    beforeMount () {
      this.fetchData()
    }
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.fetchData()
      this.search()
    }
    async fetchData (name) {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        name
      }
      let data = await axios.get(`/api/supervise/commonNames`, {params: params})
      this.commonNameData = data.data.list
      this.pagination.total = data.data.total
      this.commonNameData.forEach((item, index) => {
        item.index = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
      })
    }
    clear () {
      this.commonNameValue = ''
      this.fetchData()
    }
    async handleRowEdit ({ index, row }, done) {
      let getName = await axios.get(`/api/supervise/commonNames/${row.id}/count`, {params: {name: row.name}})
      if (getName.data >= 1) {
        this.$message({
          message: '通用名已存在!',
          type: 'warning'
        })
        return false
      }
      await axios.put(`/api/supervise/commonNames/${row.id}`, {id: row.id, name: row.name})
      this.formOptions.saveLoading = true
      setTimeout(() => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        done()
        this.formOptions.saveLoading = false
      }, 300)
    }
    handleDialogCancel (done) {
      // this.$message({
      //   message: '取消保存',
      //   type: 'warning'
      // })
      done()
    }
    async handleRowRemove ({ index, row }, done) {
      await axios.delete(`/api/supervise/commonNames/${row.id}`)
      setTimeout(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        done()
      }, 300)
      this.fetchData()
    }
    addRow () {
      this.$refs.d2Crud.showDialog({
        mode: 'add'
      })
    }
    async handleRowAdd (row, done) {
      let getName = await axios.get(`/api/supervise/commonNames/count`, {params: {name: row.name}})
      if (getName.data >= 1) {
        this.$message({
          message: '通用名已存在!',
          type: 'warning'
        })
        return false
      }
      await axios.post(`/api/supervise/commonNames`, {name: row.name})
      this.fetchData()
      this.formOptions.saveLoading = true
      setTimeout(() => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        done()
        this.formOptions.saveLoading = false
      }, 300)
    }
    async search () {
      if (this.commonNameValue === '') {
        this.$message({
          message: '请输入通用名名称',
          type: 'warning'
        })
      }
      this.pagination.currentPage = 1
      this.fetchData(this.commonNameValue)
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
