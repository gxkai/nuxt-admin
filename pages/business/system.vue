<template>
  <div class="system-wrap">
    <div class="system">
      <bread-crumb :path="$route.path"/>
      <div class="filter">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input
              placeholder="请输入标题"
              v-model="nameValue"
              size="small"
              clearable>
            </el-input>

            <el-button size="small" type="primary" @click="searchMsg">搜索</el-button>
            <el-button size="small" @click="nameValue = ''">清空</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="list">
        <d2-crud
          :columns="columns"
          :data="msgList"
          :loading="loading"
          :pagination="pagination"
          @pagination-current-change="paginationCurrentChange"
          :options="options"
          :rowHandle="rowHandle"
          @row-remove="removeMsg"
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
  import moment from 'moment'

  @Component({
    components: {
      BreadCrumb
    }
  })

  export default class System extends Vue {
    nameValue = '';

    columns= [
      {
        title: '消息类型',
        key: 'type'
      },
      {
        title: '标题',
        key: 'title'
      },
      {
        title: '创建时间',
        key: 'createdDate'
      }
    ];

    msgList = [];

    loading= false;
    pagination= {
      currentPage: 1,
      pageSize: 15,
      total: 0
    };
    options= {
      border: true
    };
    rowHandle= {
      remove: {
        text: '删除',
        type: 'text',
        confirm: true
      }
    };

    async removeMsg ({row}, done) {
      await axios.delete(`/api/supervise/messages/${row.id}`)

      this.$message({
        message: '删除成功',
        type: 'success'
      })
      done()
      this.getMessage()
    }

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getMessage()
    }

    searchMsg () {
      this.getMessage()
    }

    async getMessage () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        title: this.nameValue.trim()
      }
      let {data: message} = await axios.get('/api/supervise/messages', {params})
      console.log(message)
      this.msgList = message.list
      this.msgList.forEach(e => {
        e.createdDate = moment(e.createdDate).format('YYYY-MM-DD HH:mm:ss')
      })
      this.pagination.total = message.total
    }

    mounted () {
      this.getMessage()
    }
  }
</script>

<style lang="scss">
  .system-wrap{
    padding: 0 10px;
    margin-bottom: 30px;

    .system{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .filter{
        padding: 15px;
        border-bottom: 1px solid #E9E9E9;

        .el-input{
          width: 50%;
          margin-right: 20px;
        }
      }

      .list {
        padding: 0 15px;

        .el-table{
          th{
            background-color: #F4F4F4;
            color: #555;
          }
        }
      }
    }
  }

</style>
