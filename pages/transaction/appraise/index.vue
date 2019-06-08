<template>
  <div class="feedback-wrap">
    <div class="feedback">
      <bread-crumb :path="$route.path"/>
      <div class="title">
        <h3>评价管理</h3>
      </div>

      <div class="list">
        <d2-crud
          :columns="columns"
          :data="appraiseList"
          :options="options"
          :rowHandle="rowHandle"
          :pagination="pagination"
          @view-emit='viewEvent'
          @feedback-emit="feedBack"
          @pagination-current-change="paginationCurrentChange"/>
      </div>

      <!-- 回复模态框 -->
      <el-dialog
        title="回复"
        :visible.sync="isShowFeedBackDialog"
        width="50%"
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
          <el-button type="primary" @click="confirmFeedBack">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 查看模态框 -->
      <el-dialog
        title="查看"
        :visible.sync="isShowViewDialog"
        width="50%"
        :close-on-click-modal='isClickModal'>
        <div class="appraise-info">
          <div class="wrap1">
            <span>
              <strong>用户姓名：</strong>
              {{ viewData.accountName }}
            </span>
            <span>
              <strong>评价时间：</strong>
              {{ viewData.appraiseDate }}
            </span>
          </div>
          <div class="wrap2">
            <strong>店铺评价：</strong>
            <d2-crud
              :columns="shopAppraiseColumns"
              :data="shopAppraiseData"
              :options="options"/>
          </div>
          <div class="wrap3">
            <strong>药品评价：</strong>
            <div class="container">
              <div class="title">
                <div class="item item1">药品名称</div>
                <div class="item item2">评分</div>
                <div class="item item3">描述相符</div>
                <div class="item item4">图片</div>
              </div>
              <div class="detail" v-if="drugAppraiseData.length" v-for="(item, index) in drugAppraiseData" :key="index">
                <div class="item item1">{{ item.drugName }}</div>
                <div class="item item2">{{ item.drugScore }}</div>
                <div class="item item3">{{ item.describeScore }}</div>
                <div class="item item4">{{ item.imgURL }}</div>
              </div>
              <div class="empty" v-if="!drugAppraiseData.length">
                <span>暂无数据</span>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShowViewDialog = false">关 闭</el-button>
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
  export default class Appraise extends Vue {
    appraiseList = []
    appraiseId = ''
    feedbackData = ''
    columns= [
      {
        title: '序号',
        key: 'index'
      },
      {
        title: '用户姓名',
        key: 'accountName'
      },
      {
        title: '订单类型',
        key: 'orderType'
      },
      {
        title: '配送/自取评分',
        key: 'deliveryScore'
      },
      {
        title: '服务状态',
        key: 'serviceScore'
      },
      {
        title: '描述相符',
        key: 'describeScore'
      },
      {
        title: '包装评分',
        key: 'packageScore'
      },
      {
        title: '评价时间',
        key: 'appraiseDate'
      }
    ];
    shopAppraiseColumns = [
      {
        title: '药品质量',
        key: 'quality',
        align: 'center'
      },
      {
        title: '服务状态',
        key: 'serviceScore',
        align: 'center'
      },
      {
        title: '包装评分',
        key: 'packageScore',
        align: 'center'
      },
      {
        title: '配送速度',
        key: 'deliveryScore',
        align: 'center'
      }
    ]
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
        }
      ]
    }

    viewData = []
    shopAppraiseData = []
    drugAppraiseData = []
    isClickModal = false
    isShowViewDialog = false

    async getAppraise () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      // let shopId = '-a4bnUwmQNKxRgsZOs0J2A'
      let {data: appraiseData} = await axios.get(`/api/shop/shopAppraises`, {params})
      console.log(appraiseData)
      this.pagination.total = appraiseData.total
      this.appraiseList = appraiseData.list

      this.appraiseList.forEach((item, index) => {
        item.index = index + 1
        item.orderType = this.convertOrderType(item.type)
        item.appraiseDate = moment(item.appraiseDate).format('YY-MM-DD HH:ss:mm')
      })
    }

    beforeMount () {
      this.getAppraise()
    }

    // 查看
    async viewEvent ({row}) {
      console.log(row.id)
      this.shopAppraiseData = []
      this.isShowViewDialog = true
      let {data: detail} = await axios.get(`/api/shop/shopAppraises/${row.id}`)
      console.log(detail)
      this.viewData = detail
      this.viewData.appraiseDate = moment(this.viewData.appraiseDate).format('YY-MM-DD HH:mm:ss')
      this.shopAppraiseData.push({
        deliveryScore: detail.deliveryScore,
        packageScore: detail.packageScore,
        qualityScore: detail.qualityScore,
        serviceScore: detail.serviceScore
      })
      if (detail.shopAppraiseViewDrugListDTOList) {
        this.drugAppraiseData = detail.shopAppraiseViewDrugListDTOList
        this.drugAppraiseData.forEach(item => {
          this.getImgURL(item.fileId, data => {
            if (data.substring(data.lastIndexOf('/') + 1, data.length) !== 'null') {
              item.imgURL = data
            }
          })
        })
      }
    }

    // 获取图片路径
    async getImgURL (fileId, callback) {
      let params = {
        resolution: 'SMALL_LOGO'
      }
      let {data: imgRes} = await axios.get(`/api/shop/files/${fileId}`, {params})
      let url = imgRes.replace('redirect:', '')
      callback(url)
    }

    // 模态框参数
    isShowFeedBackDialog = false; // 模态框开启状态
    feedBack ({row}) {
      this.isShowFeedBackDialog = true
      this.appraiseId = row.id
    }

    // 回复
    async confirmFeedBack () {
      let params = new FormData()
      params.append('remark', this.feedbackData)
      await axios.put(`/api/shop/shopAppraises/${this.appraiseId}`, params)
      this.$message({
        message: '回复成功',
        type: 'success'
      })
      this.feedbackData = ''
      this.isShowFeedBackDialog = false
    }

    viewImage ({index, row}) {

    }

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getAppraise()
    }

    // 转换订单类型
    convertOrderType (type) {
      switch (type) {
        case 'SIMPLE':
          return '普通订单'

        case 'RX':
          return '处方订单'

        case 'HOSPITAL':
          return '医院订单'
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/.feedback-wrap{
    padding: 0 10px;
    margin-bottom: 30px;

    .feedCon{
      margin-top: 20px;
      textarea{
        border: none;
        outline: none;
        resize: none;
        font-size: 15px;
        color: #949494;
      }
    }

    .appraise-info{
      strong{
        font-size: 15px;
      }
      .wrap1{
        display: flex;
        align-items: center;
        padding-bottom: 25px;

        span{
          flex: .3;
        }
      }
      .wrap3{
        padding-top: 15px;
        .container{
          padding: 15px 0;

          .title{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            padding: 0;
            color: #555;
            background-color: #F4F4F4;
            border: 1px solid #E9E9E9;

            .item{
              font-weight: 600;
              padding: 12px 10px;
              text-align: center;

              &:not(:last-child){
                border-right: 1px solid #E9E9E9;
              }
            }
          }

          .detail{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            border: 1px solid #E9E9E9;
            border-top: none;
            text-align: center;

            .item{
              padding: 12px 10px;
              text-align: center;

              &:not(:last-child){
                border-right: 1px solid #E9E9E9;
              }
            }
          }

          .empty{
            color: #909399;
            line-height: 60px;
            text-align: center;
            border: 1px solid #e9e9e9;
            border-top: none;
          }
        }
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
      }

      .el-table{
        th{
          background-color: #F4F4F4;
          color: #555;
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
