<template>
  <div class="role-wrap">
    <div class="role-list">
      <bread-crumb :path="$route.path"/>
      <div class="pharm-search">
        <div class="left">
          <el-input v-model="roleNameValue" size="small" placeholder="请输入角色名称" style="width: 150px;"></el-input>
          <el-button type="primary" size="small" @click="search">搜索</el-button>
          <el-button size="small" @click="clear">清空</el-button>
        </div>
        <div class="right">
          <el-button type="primary" style="background: #169bd5;" @click="addRow">新增</el-button>
        </div>
      </div>
      <d2-crud
        :columns="columns"
        :data="roleData"
        :loading="loading"
        :pagination="pagination"
        :options="options"
        :rowHandle="rowHandle"
        @emit-edit="handleEdit"
        @row-remove="handleRowRemove"
        class="drug-table"
      />
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
  export default class Role extends Vue {
    roleNameValue = ''
    columns = [
      {
        title: '序号',
        key: 'index',
        width: 80
      },
      {
        title: '角色名称',
        key: 'name'
      },
      {
        title: '角色描述',
        key: 'description'
      }
    ]
    roleData = []
    loading= false;
    pagination= {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options= {
      border: true
    }
    rowHandle= {
      custom: [
        {
          text: '编辑',
          type: 'text',
          emit: 'emit-edit'
        }
      ],
      remove: {
        type: 'text',
        confirm: true
      }
    }
    beforeMount () {
      this.initData()
    }
    async initData (name) {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        name
      }
      let data = await axios.get(`/api/supervise/roles`, {params: params})
      console.log(data)
      this.roleData = data.data
      this.pagination.total = data.data.length
      this.roleData.forEach((item, index) => {
        item.index = index + 1
      })
    }

    // 分页
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.initData()
    }

    // 编辑
    handleEdit ({index, row}) {
      this.$router.push({path: '/system/role/edit', query: {id: row.id}})
    }

    // 新增
    addRow () {
      this.$router.push('/system/role/create')
    }

    // 清空
    clear () {
      this.roleNameValue = ''
      this.initData()
    }

    // 删除
    async handleRowRemove ({ index, row }, done) {
      await axios.delete(`/api/supervise/roles/${row.id}`)
      setTimeout(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        done()
      }, 300)
    }

    // 查询
    async search () {
      if (this.roleNameValue === '') {
        this.$message({
          message: '角色名称不能为空',
          type: 'warning'
        })
      }
      this.initData(this.roleNameValue)
    }
  }
</script>

<style scoped lang="scss">
  .role{
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

      .pharm-search{
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e9e9e9;
        padding-bottom: 15px;

        .right{
          padding-right: 10px;
        }

        .el-input{
          margin: 0 10px;
        }
        .el-select{
          width: 150px;
          margin-left: 5px;
          margin-right: 10px;
        }
      }
    }
  }

  /deep/.drug-table{
    margin-top: 15px;
    .d2-crud-body{
      padding: 0 10px!important;
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
