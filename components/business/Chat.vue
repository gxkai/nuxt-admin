<template>
  <div class="advisory--wrap">
    <div class="advisory--con">
      <bread-crumb :path="$route.path"/>
      <div class="title">
        <h3>药师管理</h3>
      </div>
      <d2-crud
        :columns="pharmacistColumns"
        :data="pharmacistList"
        :loading="loading"
        :pagination="pagination"
        @pagination-current-change="paginationCurrentChange"
        :options="options"
        :rowHandle="rowHandle"
        @emit-detail="handleDetail"
        @emit-run="handleRun"
        @emit-stop="handleStop"
        @emit-reset="resetPassword"
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
  import moment from 'moment'

  @Component({
    components: {
      BreadCrumb
    }
  })
  export default class Pharmacist extends Vue {
    pharmNameValue = ''
    pharmState = ''
    pharmacistColumns = [
      {
        title: '序号',
        key: 'index',
        width: 60
      },
      {
        title: '账号',
        key: 'username'
      },
      {
        title: '药师名',
        key: 'name'
      },
      {
        title: '角色',
        key: 'roleName'
      },
      {
        title: '状态',
        key: 'activated'
      },
      {
        title: '最后一次登录时间',
        key: 'lastLoginDate'
      },
      {
        title: '咨询次数',
        key: 'chatTimes'
      },
      {
        title: '评分',
        key: 'score'
      }
    ]
    pharmacistList = []

    loading = false;
    pagination = {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options= {
      border: true
    }
    rowHandle= {
      width: 300,
      custom: [
        {
          text: '查看聊天',
          type: 'text',
          emit: 'emit-detail'
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
          text: '重置密码',
          type: 'text',
          emit: 'emit-reset'
        }
      ]
    }

    stateOptions = [
      {
        value: '启用',
        label: '启用'
      },
      {
        value: '停用',
        label: '停用'
      }
    ]

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getPharmacist()
    }

    handleDetail ({index, row}) {
      this.$router.push({
        path: '/business/chat/list',
        query: {
          id: row.id
        }
      })
    }

    clear () {
      this.pharmNameValue = ''
      this.pharmState = ''
    }

    // 停用
    handleStop ({index, row}) {
      let stop = this.rowHandle.custom
      for (let i = 0; i < stop.length; i++) {
        if (stop[i].text === '停用') {
          row.activated = '停用'
          row.curState = false
          this.saveStatus(row)
        }
      }
    }

    // 启用
    handleRun ({index, row}) {
      let run = this.rowHandle.custom
      for (let i = 0; i < run.length; i++) {
        if (run[i].text === '启用') {
          row.activated = '启用'
          row.curState = true
          this.saveStatus(row)
        }
      }
    }

    async saveStatus (row) {
      let params = {
        activated: row.curState
      }
      let save = await axios.put(`/api/supervise/admins/${row.id}`, params)
      console.log(save)
    }

    // 新增
    addRow () {
      this.$router.push('/system/pharmacist/create')
    }

    // 重置密码
    resetPassword ({row}) {
      this.$confirm('确定重置密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.put(`/api/supervise/admins/${row.id}/reset`)
        this.$message({
          message: '密码重置成功！',
          type: 'success'
        })
      }).catch(() => {})
    }

    // 搜索
    searchPharm () {
      let activated = true

      if (this.pharmState) {
        if (this.pharmState === '启用') {
          activated = true
        } else {
          activated = false
        }
      }

      this.getPharmacist(this.pharmNameValue.trim(), activated)
    }

    async getPharmacist (name, activated) {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        name,
        activated
      }
      let {data: res} = await axios.get(`/api/supervise/admins?roleId=ROLE_ADMIN_PHARMACIST`, {params})
      console.log(res)

      this.pharmacistList = res.list
      this.pagination.total = res.total

      this.pharmacistList.forEach((item, index) => {
        item.index = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
        item.activated = this.isAvaliable(item.activated)
        item.roleName = '药师'
        item.lastLoginDate = item.lastLoginDate ? moment(item.lastLoginDate).format('YYYY-MM-DD HH:mm:ss') : ''
      })
    }

    isAvaliable (status) {
      if (status) {
        return '启用'
      }
      return '停用'
    }

    mounted () {
      this.getPharmacist()
      if (localStorage.getItem('chatID')) {
        localStorage.removeItem('chatID')
      }
    }
  }
</script>

<style scoped lang="scss">
  .advisory{
    &--wrap{
      padding: 0 10px;
      margin-bottom: 30px;
    }

    &--con{
      min-height: 850px;
      padding: 10px;
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .title{
        border-bottom: 1px solid #e9e9e9;

        h3{
          padding-left: 15px;
        }
      }
    }
  }

  /deep/.drug-table{
    margin-top: 10px;
    .d2-crud-body{
      padding: 0 15px;
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
