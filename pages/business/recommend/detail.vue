<template>
  <div class="recommend">
    <div class="recommend-wrap">
      <bread-crumb :path="$route.path"/>

      <div class="title">
        <h3>查看详情</h3>
      </div>

      <d2-crud
        :columns="columns"
        :data="drugData"
        :loading="loading"
        :options="options"
        class="drug-table"
      />

      <el-form ref="form" label-width="100px" class="recommend-form">
        <el-form-item label="活动时间：">
          <el-date-picker
            readonly
            size="small"
            v-model="timeDate"
            format = "yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import Drug from '@/components/drugCheck/drugRadio/index'
  import axios from 'axios'
  import moment from 'moment'
  @Component({
    components: {
      BreadCrumb,
      Drug
    }
  })
  export default class RecommendDetail extends Vue {
    columns = [
      {
        title: '药品名称',
        key: 'drugName'
      },
      {
        title: '药品规格',
        key: 'specName'
      },
      {
        title: '生产厂商',
        key: 'originName'
      },
      {
        title: '销量',
        key: 'sales'
      },
      {
        title: '销售价',
        key: 'price'
      }
    ]
    drugData = [] // push药品信息
    loading = false
    options = {
      border: true
    }

    startDate = ''
    endDate = ''

    timeDate = []

    beforeMount () {
      this.getRecommendDetail()
    }

    async getRecommendDetail () {
      let id = this.$route.query.id
      let resDetail = await axios.get(`/api/shop/drugRecommendApplies/${id}`)
      this.drugData.push(resDetail.data)
      this.startDate = moment(resDetail.data.startDate).format('YYYY-MM-DD HH:mm:ss')
      this.endDate = moment(resDetail.data.endDate).format('YYYY-MM-DD HH:mm:ss')
      this.timeDate.push(this.startDate)
      this.timeDate.push(this.endDate)
    }
  }
</script>

<style lang="scss" scoped>
  .recommend {
    padding: 0 10px;
    margin-bottom: 30px;
    &-wrap {
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;
      .title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        margin-bottom: 15px;
        border-bottom: 1px solid #E9E9E9;
        .select-btn{
          width: 200px;
          height: 32px;
          line-height: inherit;
          color: #c0c4cc;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .value-btn{
          color: #606266;
        }
      }
      .recommend-form{
        margin-top: 15px;
      }
    }
  }
  /deep/.drug-table {
    padding: 0 10px;
    .el-table {
      th {
        background-color: #F4F4F4 !important;
        color: #555 !important;
      }
    }
  }

</style>
