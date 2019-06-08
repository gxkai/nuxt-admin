<template>
  <div class="feedback-wrap">
    <div class="feedback">
      <bread-crumb :path="$route.path"/>
      <div class="title">
        <h3>用户反馈</h3>
      </div>

      <div class="list">
        <d2-crud
          :columns="columns"
          :data="feedbackList"
          :loading="loading"
          :pagination="pagination"
          @pagination-current-change="paginationCurrentChange"
          :options="options"
          :rowHandle="rowHandle"
          @view-emit='viewEvent'
          @feedback-emit="feedBackDialog"
          @view-image-emit='viewImage'/>
      </div>

      <!-- 回复模态框 -->
      <el-dialog
        title="回复"
        :visible.sync="isShowFeedBackDialog"
        width="30%"
        :close-on-click-modal='isClickModal'>
        <div class="feedCon">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入回复内容"
            v-model="feedbackData">
          </el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShowFeedBackDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 查看模态框 -->
      <el-dialog
        title="查看"
        :visible.sync="isShowViewDialog"
        width="30%"
        :close-on-click-modal = 'isClickModal'>
        <div class="main">
          <el-form :model="viewData" label-width="100px">
            <el-form-item label="序号">
              <el-input v-model="viewData.index" readonly></el-input>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="viewData.name" readonly></el-input>
            </el-form-item>
            <el-form-item label="提交时间">
              <el-input v-model="viewData.createdDate" readonly></el-input>
            </el-form-item>
            <el-form-item label="内容">
              <el-input v-model="viewData.content" readonly></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-input v-model="viewData.processed ? '已处理' : '未处理'" readonly></el-input>
            </el-form-item>
            <el-form-item label="处理人">
              <el-input v-model="viewData.adminName" readonly></el-input>
            </el-form-item>
            <el-form-item label="回复内容">
              <el-input v-model="viewData.remark" readonly></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShowViewDialog = false" type="primary">关 闭</el-button>
        </div>
      </el-dialog>
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
  export default class Feedback extends Vue {
    feedbackData = ''
    rowData = {}
    columns= [
      {
        title: '序号',
        key: 'index'
      },
      {
        title: '用户名',
        key: 'name'
      },
      {
        title: '提交时间',
        key: 'createdDate'
      },
      {
        title: '内容',
        key: 'content'
      },
      {
        title: '状态',
        key: 'processed'
      },
      {
        title: '处理人',
        key: 'adminName'
      },
      {
        title: '回复内容',
        key: 'remark'
      }
    ];

    feedbackList = [];

    loading = false;

    pagination = {
      currentPage: 1,
      pageSize: 15,
      total: 0
    };

    options = {
      border: true
    };

    rowHandle = {
      custom: [
        {
          text: '查看',
          type: 'text',
          emit: 'view-emit'
        },
        {
          text: '回复',
          type: 'text',
          emit: 'feedback-emit'
        },
        {
          text: '图片',
          type: 'text',
          emit: 'view-image-emit',
          class: 'viewImg-btn'
        }
      ]
    }

    viewData = {}
    isClickModal = false
    isShowViewDialog = false

    // 查看
    viewEvent (data) {
      this.isShowViewDialog = true
      this.viewData.index = data.index + 1
      this.viewData.id = data.row.id
      this.viewData.name = data.row.name
      this.viewData.createdDate = data.row.createdDate
      this.viewData.content = data.row.content
      this.viewData.processed = data.row.processed
      this.viewData.adminName = data.row.adminName
      this.viewData.remark = data.row.remark
    }

    // 模态框参数
    isShowFeedBackDialog = false; // 模态框开启状态
    feedBackDialog ({row}) {
      this.isShowFeedBackDialog = true
      // console.log(row.id)
      this.rowData = row
    }

    // 回复
    async confirm () {
      let params = {
        adminId: '2',
        processed: true,
        remark: this.feedbackData
      }
      await axios.post(`/api/supervise/feedbacks/${this.rowData.id}`, params)
      this.$message({
        message: '回复成功',
        type: 'success'
      })
      this.isShowFeedBackDialog = false
      this.feedbackData = ''
      this.getFeedbacks()
    }

    viewImage ({index, row}) {

    }

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getFeedbacks()
    }

    async getFeedbacks () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }

      let {data: feedbacks} = await axios.get(`/api/supervise/feedbacks`, {params})
      console.log(feedbacks)

      this.feedbackList = feedbacks.list
      this.pagination.total = feedbacks.total

      this.feedbackList.forEach((item, index) => {
        item.index = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
        item.createdDate = moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
        item.processed = item.remark ? '已处理' : '未处理'
      })
    }

    mounted () {
      this.getFeedbacks()
    }
  }
</script>

<style lang="scss">
  .feedback-wrap{
    padding: 0 10px;
    margin-bottom: 30px;

    .feedCon{
      textarea{
        border: none;
        outline: none;
        resize: none;
        font-size: 15px;
        color: #949494;
      }
    }

    .feedback{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .el-dialog__body{
        padding: 20px;
        border:{
          top: 1px solid #e9e9e9;
          bottom: 1px solid #e9e9e9;
        }
      }

      .title{
        padding: 0 15px;
        border-bottom: 1px solid #E9E9E9;
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

      .cell{
        button:nth-child(2):before{
          content: '|';
          color: #EEE;
          position: relative;
          left: -4px;
          top: -1px;
        }

        .hide{
          display: none;
        }
      }
    }
  }

</style>
