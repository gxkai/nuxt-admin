<template>
  <div class="user-wrap">
    <div class="user-list">
      <bread-crumb :path="$route.path"/>
      <div class="pharm-search">
        <h3>用户管理</h3>
        <el-button type="primary" @click="addRow" style="background: #169bd5;">新增</el-button>
      </div>
      <d2-crud
        ref="d2Crud"
        :columns="columns"
        :data="userList"
        :pagination="pagination"
        :options="options"
        :rowHandle="rowHandle"
        @emit-view="viewDetail"
        @emit-stop="stopUser"
        @emit-start="startUser"
        @emit-reset="reset"
        @pagination-current-change="paginationCurrentChange"
        class="drug-table"/>
    </div>

    <!--查看-->
    <el-dialog
      title="查看"
      :visible.sync="viewDialogVisible"
      width="30%">
      <el-form ref="viewForm" :model="viewData" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="viewData.username" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="viewData.name" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="viewData.username" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="viewData.roleName" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="viewData.jobStatus" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="最后操作日期">
          <el-input v-model="viewData.lastModifiedDate" readonly placeholder="暂无"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!--新增-->
    <el-dialog
      title="新增"
      :visible.sync="addDialogVisible"
      width="30%">
      <el-form ref="viewForm" :model="addData" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="addData.username" placeholder="用户名只能是手机号码"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="addData.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="addData.username" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="addData.roleName"
            style="width: 100%;"
            placeholder="请选择用户类型">
            <el-option
              v-for="(item, index) in typeOption"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="addData.jobStatus"
            style="width: 100%;"
            placeholder="请选择用户状态">
            <el-option
              v-for="(item, index) in statusOption"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-success="uploadIcon">
            <img v-if="iconURL" :src="iconURL" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
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
  export default class User extends Vue {
    viewDialogVisible = false
    addDialogVisible = false
    viewData = {}
    userList = []
    uploadFile = {}

    columns= [
      {
        title: '用户名',
        key: 'username'
      },
      {
        title: '姓名',
        key: 'name'
      },
      {
        title: '手机',
        key: 'username'
      },
      {
        title: '类型',
        key: 'roleName'
      },
      {
        title: '状态',
        key: 'jobStatus'
      },
      {
        title: '最后操作日期',
        key: 'lastModifiedDate'
      }
    ]
    pagination= {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }

    options= {
      border: true
    }
    iconURL = ''
    addData = {
      username: '',
      name: '',
      roleName: '',
      jobStatus: ''
    }

    // 用户状态
    statusOption = [
      {
        label: '在职',
        value: true
      },
      {
        label: '离职',
        value: false
      }
    ]

    // 用户类型
    typeOption = [
      {
        label: '配送员',
        value: 'ROLE_CIRCULATE_COURIER'
      },
      {
        label: '营业员',
        value: 'ROLE_CIRCULATE_SHOP'
      }
    ]

    rowHandle= {
      custom: [
        {
          text: '查看',
          type: 'text',
          emit: 'emit-view'
        },
        {
          text: '停用',
          type: 'text',
          emit: 'emit-stop',
          show (index, row) {
            if (row.jobStatus === '在职') {
              return true
            }
          }
        },
        {
          text: '启用',
          type: 'text',
          emit: 'emit-start',
          show (index, row) {
            if (row.jobStatus === '离职') {
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

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.initData()
    }

    // 打开新增弹框
    addRow () {
      this.addDialogVisible = true
    }

    uploadIcon (res, file) {
      this.iconURL = URL.createObjectURL(file.raw)
      this.uploadFile = file.raw
    }

    // 新增用户
    async confirmAdd () {
      // 上传用户头像
      let fileParams = new FormData()
      fileParams.append('fileType', 'LOGO')
      fileParams.append('file', this.uploadFile)
      let {data: fileId} = await axios.post(`/api/shop/files`, fileParams)
      console.log(fileId)

      // let shopId = 'y7P-oo_CSMalqzo1yGxncF'
      let params = {
        username: this.addData.username,
        name: this.addData.name,
        // password: '123456',
        fileId,
        roleId: this.addData.roleName,
        activated: this.addData.jobStatus
      }
      await axios.post(`/api/shop/users`, params)
      this.$message({
        message: '添加成功',
        type: 'success'
      })
      this.addDialogVisible = false
      this.initData()
    }

    // 查看
    viewDetail ({row}) {
      this.viewDialogVisible = true
      this.viewData = row
    }

    // 启用
    async startUser ({row}) {
      let userAct = this.rowHandle.custom
      userAct.forEach(item => {
        if (item.text === '启用') {
          row.jobStatus = '在职'
          row.activated = true
        }
      })

      let params = new FormData()
      params.append('activated', row.activated)
      await axios.put(`/api/shop/users/${row.id}`, params)

      this.$message({
        message: '该账户已启用',
        type: 'success'
      })
    }

    // 停用
    async stopUser ({row}) {
      let userAct = this.rowHandle.custom
      userAct.forEach(item => {
        if (item.text === '停用') {
          row.jobStatus = '离职'
          row.activated = false
        }
      })

      let params = new FormData()
      params.append('activated', row.activated)
      await axios.put(`/api/shop/users/${row.id}`, params)

      this.$message({
        message: '该账户已停用',
        type: 'success'
      })
    }

    // 重置密码
    reset ({row}) {
      this.$confirm('默认密码：000000，确定重置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post(`/api/shop/users/${row.id}/reset`)
        this.$message({
          type: 'success',
          message: '重置成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '已取消重置'
        })
      })
    }

    async initData () {
      let params = new FormData()
      params.append('pageNum', this.pagination.currentPage)
      params.append('pageSize', this.pagination.pageSize)
      // params.append('shopId', 'Vwwy8nJYQJCQ4wqkCZDgyA')

      let {data: user} = await axios.get(`/api/shop/users`, {params})
      console.log(user)
      this.pagination.total = user.total
      this.userList = user.list

      this.userList.forEach(item => {
        if (item.lastModifiedDate) {
          item.lastModifiedDate = moment(item.lastModifiedDate).format('YY-MM-DD HH:ss:mm')
        }
        if (item.activated) {
          item.jobStatus = '在职'
        } else {
          item.jobStatus = '离职'
        }

        if (item.roleId === 'ROLE_CIRCULATE_COURIER') {
          item.roleName = '配送员'
        }
        if (item.roleId === 'ROLE_CIRCULATE_SHOP') {
          item.roleName = '营业员'
        }
      })
    }

    beforeMount () {
      this.initData()
    }
  }
</script>

<style scoped lang="scss">
  .user{
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

  /deep/.avatar-uploader{
    .el-upload{
      height: 130px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      img{
        width: 130px;
        height: 130px;
      }

      .avatar-uploader-icon{
        font-size: 28px;
        color: #8c939d;
        width: 130px;
        height: 130px;
        line-height: 130px;
        text-align: center;
      }
    }
  }
</style>
