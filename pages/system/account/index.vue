<template>
  <div class="account-wrap">
    <div class="account-list">
      <bread-crumb :path="$route.path"/>
      <div class="pharm-search">
        <!--<el-button type="primary" size="small" icon="el-icon-plus" @click="addRow">新增</el-button>-->
        <el-input v-model="accountNameValue" size="small" placeholder="请输入用户名" style="width: 150px;"></el-input>
        <el-select size="small" v-model="accountState" placeholder="当前状态">
          <el-option
            v-for="item in stateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="small" @click="search">搜索</el-button>
        <el-button size="small" @click="clear">清空</el-button>
      </div>
      <d2-crud
        :columns="columns"
        :data="accountData"
        :loading="loading"
        :pagination="pagination"
        :options="options"
        :rowHandle="rowHandle"
        @emit-detail="handleCustomEvent"
        @emit-stop="handleStop"
        @emit-run="handleRun"
        @pagination-current-change="paginationCurrentChange"
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
  export default class Account extends Vue {
    accountNameValue = ''
    accountState = ''
    columns = [
      {
        title: '序号',
        key: 'index',
        width: 60
      },
      {
        title: '用户名',
        key: 'username'
      },
      {
        title: '姓名',
        key: 'name'
      },
      {
        title: '账号来源',
        key: 'createdBy'
      },
      {
        title: '手机号码',
        key: 'username'
      },
      {
        title: '处方单数',
        key: 'rxCount'
      },
      {
        title: '下单次数',
        key: 'orderCount'
      },
      {
        title: '咨询次数',
        key: 'chatCount'
      },
      {
        title: '最后一次登录时间',
        key: 'loginDate'
      },
      {
        title: '状态',
        key: 'activated'
      }
    ]
    accountData = []
    loading = false;
    pagination = {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options= {
      border: true
    }
    rowHandle = {
      width: 250,
      custom: [
        {
          text: '查看详情',
          type: 'text',
          emit: 'emit-detail'
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
    stateOptions = [
      {
        value: true,
        label: '启用'
      },
      {
        value: false,
        label: '停用'
      }
    ]
    beforeMount () {
      this.initData()
    }
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.initData()
      this.search()
    }
    async initData () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: 15
      }
      let data = await axios.get(`/api/supervise/accounts`, {params: params})
      this.accountData = data.data.list
      console.log(this.accountData)
      this.pagination.total = data.data.total
      this.accountData.forEach((e, i) => {
        e.loginDate = moment(e.loginDate).format('YYYY-MM-DD HH:mm:ss')
        e.index = i + 1
        if (e.activated.toString() === 'true') {
          e.activated = '启用'
        } else {
          e.activated = '停用'
        }
      })
    }
    handleCustomEvent ({index, row}) {
      this.$router.push({path: '/system/account/detail', query: {id: row.id}})
    }
    async handleStop ({index, row}) {
      await axios.post(`/api/supervise/accounts/${row.id}/activated?activated=` + false)
      this.initData()
    }
    async handleRun ({index, row}) {
      await axios.post(`/api/supervise/accounts/${row.id}/activated?activated=` + true)
      this.initData()
    }
    clear () {
      this.accountNameValue = ''
      this.accountState = ''
      this.initData()
    }
    async search () {
      console.log(this.accountState)
      let params = {
        name: this.accountNameValue,
        activated: this.accountState,
        pageNum: this.pagination.currentPage,
        pageSize: 15
      }
      await axios.get(`/api/supervise/accounts`, {params: params}).then(res => {
        this.accountData = res.data.list
        this.pagination.total = res.data.total
        this.accountData.forEach((e, i) => {
          e.loginDate = moment(e.loginDate).format('YYYY-MM-DD HH:mm:ss')
          e.index = i + 1
          if (e.activated.toString() === 'true') {
            e.activated = '启用'
          } else {
            e.activated = '停用'
          }
        })
      })
    }
  }
</script>

<style scoped lang="scss">
  .account{
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
        justify-content: Flex-start;
        align-items: center;
        padding-bottom: 15px;
        margin-bottom: 15px;
        border-bottom: 1px solid #e9e9e9;

        .el-input{
          margin: 0 5px;
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
    margin-top: 10px;
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
