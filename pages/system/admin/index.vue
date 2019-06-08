<template>
  <div class="admin-wrap">
    <div class="admin-list">
      <bread-crumb :path="$route.path"/>
      <div class="pharm-search">
        <h3>监管用户管理</h3>
        <el-button type="primary" @click="addRow" style="background: #169bd5;">新增</el-button>
      </div>
      <d2-crud
        :columns="columns"
        :data="adminData"
        :loading="loading"
        :pagination="pagination"
        :options="options"
        :rowHandle="rowHandle"
        @emit-edit="handleEditEvent"
        @emit-stop="handleStop"
        @emit-run="handleRun"
        @emit-reset="handleReset"
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
  export default class AdminIndex extends Vue {
    columns= [
      {
        title: '序号',
        key: 'index',
        width: 60
      },
      {
        title: '名字',
        key: 'name'
      },
      {
        title: '账号',
        key: 'username'
      },
      {
        title: '角色',
        key: 'roleId'
      },
      {
        title: '最后一次登录时间',
        key: 'lastLoginDate'
      },
      {
        title: '状态',
        key: 'activated'
      }
    ]
    adminData= []
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
      width: 250,
      custom: [
        {
          text: '修改',
          type: 'text',
          emit: 'emit-edit'
        },
        {
          text: '停用',
          type: 'text',
          emit: 'emit-stop',
          show (index, row) {
            if (row.activated === '启用') {
              return true
            }
          }
        },
        {
          text: '启用',
          type: 'text',
          emit: 'emit-run',
          show (index, row) {
            if (row.activated === '停用') {
              return true
            }
          }
        },
        {
          text: '重置密码',
          type: 'text',
          emit: 'emit-reset'
        }
      ]
    }
    beforeMount () {
      this.initData()
    }
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.initData()
    }
    async initData () {
      let params = {
        activated: '',
        name: '',
        roleId: '',
        username: '',
        pageNum: this.pagination.currentPage,
        pageSize: 15
      }
      let data = await axios.get(`/api/supervise/admins`, {params: params})
      this.adminData = data.data.list
      console.log(this.adminData)
      this.pagination.total = data.data.total
      this.adminData.forEach((item, index) => {
        item.index = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
        // if (item.activated.toString() === 'true') {
        //   item.activated = '启用'
        // } else {
        //   item.activated = '停用'
        // }
        // if (item.roleId === 'ROLE_ADMIN_PHARMACIST') {
        //   item.roleId = '客服'
        // } else if (item.roleId === 'ROLE_ADMIN_PHARMACIST') {
        //   item.roleId = '药师'
        // } else {
        //   item.roleId = '监管用户'
        // }
      })
    }
    handleEditEvent ({index, row}) {
      this.$router.push({path: '/system/admin/edit', query: {id: row.id}})
    }
    async handleStop ({index, row}) {
      await axios.post(`/api/supervise/admins/${row.id}/activated?activated=` + false)
      this.initData()
    }
    async handleRun ({index, row}) {
      await axios.post(`/api/supervise/admins/${row.id}/activated?activated=` + true)
      this.initData()
    }
    async handleReset ({index, row}) {
      await axios.put(`/api/supervise/admins/${row.id}/reset`)
      this.initData()
    }
    addRow () {
      this.$router.push('/system/admin/create')
    }
  }
</script>

<style scoped lang="scss">
  .admin{
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
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e9e9e9;
        padding: 0 15px;
      }
    }
  }

  /deep/.drug-table{
    margin-top: 15px;
    .d2-crud-body{
      padding: 0  15px !important;
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
