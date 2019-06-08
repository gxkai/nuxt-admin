<template>
  <div class="chat--wrap">
    <div class="chat--con">
      <bread-crumb :path="$route.path"/>
      <d2-crud
        :columns="columns"
        :data="chatList"
        :loading="loading"
        :pagination="pagination"
        @pagination-current-change="paginationCurrentChange"
        :options="options"
        :rowHandle="rowHandle"
        @emit-detail="handleDetail"
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
  export default class Chat extends Vue {
    columns= [
      {
        title: '序号',
        key: 'index',
        width: 60
      },
      {
        title: '用户名',
        key: 'accountName'
      },
      {
        title: '最后一次发送时间',
        key: 'accountLastDate'
      },
      {
        title: '发送内容',
        key: 'accountMessage'
      },
      {
        title: '最后一次回复时间',
        key: 'userLastDate'
      },
      {
        title: '回复内容',
        key: 'userMessage'
      }
    ]
    chatList = []
    uId = ''
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
          text: '查看聊天',
          type: 'text',
          emit: 'emit-detail'
        }
      ]
    }

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getChatList(this.uId)
    }

    handleDetail ({index, row}) {
      this.$router.push({
        path: '/system/pharmacist/chat/detail',
        query: {
          id: row.id
        }
      })
    }

    async getChatList (id) {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      let {data: chat} = await axios.get(`/api/supervise/chats/users/${id}`, {params})
      console.log(chat)
      this.chatList = chat.list
      this.pagination.total = chat.total
      this.chatList.forEach((item, index) => {
        item.index = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
        item.userLastDate = item.userLastDate ? moment(item.userLastDate).format('YYYY-MM-DD HH:mm:ss') : ''
        item.accountLastDate = item.accountLastDate ? moment(item.accountLastDate).format('YYYY-MM-DD HH:mm:ss') : ''
      })
    }

    mounted () {
      if (this.$route.query.id) {
        this.uId = this.$route.query.id
        localStorage.setItem('chatID', this.uId)
      } else {
        this.uId = localStorage.getItem('chatID')
      }

      console.log(this.uId)

      this.getChatList(this.uId)
    }
  }
</script>

<style scoped lang="scss">
  .chat{
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
    }
  }
  /deep/.drug-table{
    .d2-crud-body{
      padding: 0 !important;
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
