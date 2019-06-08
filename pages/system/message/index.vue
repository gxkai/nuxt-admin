<template>
  <div class="message-wrap">
    <div class="message-list">
      <bread-crumb :path="$route.path"/>
      <div class="pharm-search">
        <h3>我的消息</h3>
      </div>
      <d2-crud
        :columns="columns"
        :data="messageList"
        :pagination="pagination"
        :options="options"
        :rowHandle="rowHandle"
        @emit-view="viewDetail"
        @pagination-current-change="paginationCurrentChange"
        class="drug-table"
      />
    </div>

    <!--查看-->
    <el-dialog
      title="查看"
      :visible.sync="viewDialogVisible"
      width="30%">
      <el-form ref="viewForm" :model="viewData" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="viewData.title" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="viewData.content" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="是否已读">
          <el-input v-model="viewData.isRead" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-input v-model="viewData.createdDate" readonly placeholder="暂无"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialogVisible = false">关 闭</el-button>
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
  export default class Message extends Vue {
    viewDialogVisible = false
    viewData = {}
    messageList = []
    columns= [
      {
        title: '标题',
        key: 'title'
      },
      {
        title: '内容',
        key: 'content'
      },
      {
        title: '是否已读',
        key: 'isRead',
        width: 100
      },
      {
        title: '时间',
        key: 'createdDate'
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
    rowHandle= {
      width: 120,
      custom: [
        {
          text: '查看',
          type: 'text',
          emit: 'emit-view'
        }
      ]
    }

    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.initData()
    }

    viewDetail ({row}) {
      this.viewDialogVisible = true
      this.viewData = row
    }

    // 删除
    // removeMessage ({row}) {
    //   console.log(row)
    //   this.$confirm('确定删除吗？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     axios.delete(`/api/shop/messages/${row.messageId}`)
    //     this.$message({
    //       message: '删除成功！',
    //       type: 'success'
    //     })
    //     this.initData()
    //   }).catch(() => {
    //     this.$message({
    //       message: '取消删除！',
    //       type: 'warning'
    //     })
    //   })
    // }

    async initData () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        userId: 'ZqYK4IFhQ6KmYKAEEN8g8Q'
      }

      let {data: message} = await axios.get(`/api/shop/messages`, {params})
      // console.log(message)
      this.pagination.total = message.total
      this.messageList = message.list
      this.messageList.forEach(item => {
        item.createdDate = moment(item.createdDate).format('YY-MM-DD HH:ss:mm')
        if (item.read) {
          item.isRead = '已读'
        } else {
          item.isRead = '未读'
        }
      })
    }

    beforeMount () {
      this.initData()
    }
  }
</script>

<style scoped lang="scss">
  .message{
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
