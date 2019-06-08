<template>
  <div class="common-wrap">
    <div class="common-list">
      <bread-crumb :path="$route.path"/>
      <div class="common-search">
        <div class="left">
          <el-input v-model="commonNameValue" size="small" placeholder="请输入类型名称" style="width: 200px;"></el-input>
          <el-button type="primary" size="small" @click="search">搜索</el-button>
          <el-button size="small" @click="clear">清空</el-button>
        </div>
        <div class="right">
          <el-button type="primary" style="background: #169bd5;" @click="addRow">新增</el-button>
        </div>
      </div>
      <div>
        <d2-crud
          ref="d2Crud"
          :columns="columns"
          :data="typeChildData"
          :loading="loading"
          :pagination="pagination"
          :options="options"
          :rowHandle="rowHandle"
          :form-options="formOptions"
          @edit-custom="editCustom"
          @row-remove="handleRowRemove"
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
  export default class TypeChild extends Vue {
    commonNameValue = ''
    columns = [
      {
        title: '序号',
        key: 'index',
        width: 80
      },
      {
        title: '类型名称',
        key: 'type'
      },
      {
        title: '父类名称',
        key: 'pname'
      },
      {
        title: '排序',
        key: 'sort'
      },
      {
        title: '是否显示',
        key: 'showed'
      }
    ]
    typeChildData = []
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
      custom: [
        {
          text: '编辑',
          type: 'text',
          emit: 'edit-custom'
        }
      ],
      remove: {
        text: '删除',
        type: 'text',
        confirm: true
      }
    }
    formOptions = {
      labelWidth: '80px',
      labelPosition: 'right',
      saveLoading: false
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
      let id = this.$route.query.id
      let pname = this.$route.query.type
      const params = {
        name,
        pname: pname
        // pageNum: this.pagination.currentPage,
        // pageSize: this.pagination.pageSize
      }
      let data = await axios.get(`/api/supervise/drugTypes/${id}/children`, {params: params})
      this.typeChildData = data.data
      console.log(this.typeChildData)
      this.typeChildData.forEach((item, index) => {
        item.index = index + 1
        if (item.showed.toString() === 'true') {
          item.showed = '是'
        } else {
          item.showed = '否'
        }
        this.$set(item, 'pname', pname)
      })
      this.pagination.total = data.data.length
    }
    clear () {
      this.commonNameValue = ''
      this.fetchData()
    }
    addRow () {
      this.$router.push('/drugCheck/type/typeChild/create')
    }
    editCustom ({index, row}) {
      let query = {
        id: row.id,
        pid: row.pid,
        ptype: row.pname
      }
      this.$router.push({path: '/drugCheck/type/typeChild/edit', query: query})
    }
    async handleRowRemove ({ index, row }, done) {
      await axios.delete(`/api/supervise/drugTypes/${row.id}`)
      setTimeout(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        done()
      }, 300)
    }
    async search () {
      if (this.commonNameValue === '') {
        this.$message({
          message: '请输入类型名称',
          type: 'warning'
        })
      }
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
