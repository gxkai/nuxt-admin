<template>
  <div class="recommend">
    <div class="recommend-wrap">
      <bread-crumb :path="$route.path"/>

      <div class="title">
        <h3>再次提交</h3>
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
            size="small"
            v-model="timeDate"
            format = "yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="convertDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="recommendSubmit">提交</el-button>
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
  export default class RecommendEdit extends Vue {
    // table列表
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

    timeDate = []
    startDate = '' // 起始日期
    endDate = '' // 截止日期

    shopOptions = [] // 药店信息
    shopId = '' // 药店id

    shopDrugId = ''

    convertDate () {
      if (this.timeDate) {
        for (let i = 0, len = this.timeDate.length; i < len; i++) {
          this.timeDate[i] = moment(this.timeDate[i]).format('YYYY-MM-DD')
        }
        this.startDate = this.timeDate[0]
        this.endDate = this.timeDate[1]
      }
    }

    beforeMount () {
      this.getRecommendDetail()
    }
    async getRecommendDetail () {
      let id = this.$route.query.id
      let resDetail = await axios.get(`/api/shop/drugRecommendApplies/${id}`)
      this.drugData.push(resDetail.data)
      this.startDate = moment(resDetail.data.startDate).format('YYYY-MM-DD')
      this.endDate = moment(resDetail.data.endDate).format('YYYY-MM-DD')
      this.timeDate.push(this.startDate)
      this.timeDate.push(this.endDate)
      // 获取药店id
      let shop = await axios.get(`/api/shop/shops`)
      this.shopOptions = shop.data.list
      this.shopOptions.forEach(item => {
        if (this.$route.query.shopName === item.shopName) {
          this.shopId = item.id
        }
      })
      // shopDrugId
      this.shopDrugId = resDetail.data.shopDrugId
    }

    async recommendSubmit () {
      let params = {
        shopDrugId: this.shopDrugId,
        startDate: this.startDate,
        endDate: this.endDate,
        userId: 'kDw85WlUSDGX99dvWyQ5pi',
        shopId: this.shopId
      }
      let applyRes = await axios.post(`/api/shop/drugRecommendApplies/apply`, params)
      if (applyRes) {
        this.$message({
          message: '提交成功！',
          type: 'success'
        })
      }
      this.$router.push('/business/recommend')
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
