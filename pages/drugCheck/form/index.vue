<template>
  <div class="common-wrap">
    <div class="common-list">
      <bread-crumb :path="$route.path"/>
      <div class="common-search">
        <div class="left">
          <el-input v-model="commonNameValue" size="small" placeholder="请输入药剂名称" style="width: 200px;"></el-input>
          <el-button type="primary" size="small" @click="searchDosageForm">搜索</el-button>
          <el-button size="small" @click="clear">清空</el-button>
        </div>

        <div class="right">
          <el-button type="primary" style="background: #169bd5;" @click="addRow">新增</el-button>
        </div>
      </div>
      <div>
        <d2-crud
          ref="d2Crud"
          :columns="dosageFormColumns"
          :data="dosageFormList"
          :loading="loading"
          :pagination="pagination"
          @pagination-current-change="paginationCurrentChange"
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
    commonNameValue = ''
    dosageFormColumns = [
      {
        title: '序号',
        key: 'index',
        width: 60
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
      code: {
        title: '编码',
        value: ''
      },
      name: {
        title: '剂型名称',
        value: ''
      }
    }
    addTemplate = {
      code: {
        title: '编码',
        value: ''
      },
      name: {
        title: '剂型名称',
        value: ''
      }
    }
    formOptions = {
      labelWidth: '80px',
      labelPosition: 'right',
      saveLoading: false
    }
    addRules = {
      code: [ { required: true, message: '请输入编码', trigger: 'blur' } ],
      name: [ { required: true, message: '请输入剂型名称', trigger: 'blur' } ]
    }

    clear () {
      this.commonNameValue = ''
    }

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getAllForms()
    }

    handleDialogCancel (done) {
      this.$message({
        message: '取消保存',
        type: 'warning'
      })
      done()
    }

    // 编辑
    async handleRowEdit ({ index, row }, done) {
      this.formOptions.saveLoading = true
      await axios.put(`/api/supervise/forms/${row.id}`, row)
      setTimeout(() => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        done()
        this.formOptions.saveLoading = false
      }, 300)
    }

    // 删除
    async handleRowRemove ({ index, row }, done) {
      await axios.delete(`/api/supervise/forms/${row.id}`)
      setTimeout(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        done()
      }, 300)
      this.getAllForms()
    }

    // 新增
    addRow () {
      this.$refs.d2Crud.showDialog({
        mode: 'add'
      })
    }

    async handleRowAdd (row, done) {
      this.formOptions.saveLoading = true
      await axios.post(`/api/supervise/forms`, row)
      setTimeout(() => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        done()
        this.formOptions.saveLoading = false
      }, 300)
      this.getAllForms()
    }

    // 搜索
    searchDosageForm () {
      this.getAllForms(this.commonNameValue.trim())
    }

    async getAllForms (name) {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        name
      }
      let {data: formData} = await axios.get(`/api/supervise/forms`, {params})
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
