<template>
  <div class="recommend">
    <div class="recommend-wrap">
      <bread-crumb :path="$route.path"/>

      <div class="title">
        <h3>新增推荐</h3>
        <div class="action">
          <el-button class="select-btn value-btn" v-if="drugValue.drugName" size="small" @click="drugDialog = true">{{ drugValue.drugName }}</el-button>
          <el-button class="select-btn" v-else size="small" @click="drugDialog = true">请选择药品</el-button>
          <el-button type="primary" size="small" @click="getDrugInfo">确定</el-button>
        </div>
      </div>

      <!--选择药品弹窗-->
      <el-dialog
        title="请选择药品"
        :close-on-click-modal='isCloseOnClickModal'
        :visible.sync="drugDialog"
        width="50%">
        <Drug v-on:listenToChildEvent="getSelectedInfo"></Drug>
        <span slot="footer" class="dialog-footer">
          <el-button @click="drugDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmSelect">确 定</el-button>
        </span>
      </el-dialog>

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
            type="daterange"
            format = "yyyy-MM-dd"
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
  import Drug from '@/components/business/shopDrugs'
  import axios from 'axios'
  import moment from 'moment'
  @Component({
    components: {
      BreadCrumb,
      Drug
    }
  })
  export default class RecommendCreate extends Vue {
    drugName = ''
    drugValue = '' // 药品信息
    selectedInfo = '' // 子组件传过来的数据
    childData = [] // 暂存已选的数据

    isCloseOnClickModal = false
    drugDialog = false

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

    convertDate () {
      if (this.timeDate) {
        for (let i = 0, len = this.timeDate.length; i < len; i++) {
          this.timeDate[i] = moment(this.timeDate[i]).format('YYYY-MM-DD')
        }
        this.startDate = this.timeDate[0]
        this.endDate = this.timeDate[1]
      }
    }

    getSelectedInfo (data) {
      this.selectedInfo = data
    }

    confirmSelect () {
      if (!this.selectedInfo) {
        this.shopNameDialog = false
        return
      }
      this.childData = this.selectedInfo
      this.drugValue = this.childData
      this.drugDialog = false
    }

    getDrugInfo () {
      console.log(this.drugValue)
      this.drugData = []
      if (this.drugValue) {
        this.drugData.push(this.drugValue)
      }
    }

    async recommendSubmit () {
      let repeat = {
        shopDrugId: this.drugValue.shopDrugId,
        startDate: this.startDate,
        endDate: this.endDate
      }
      await axios.get(`/api/shop/drugRecommendApplies/apply/exists`, {params: repeat})
        .then(res => {
          return Promise.resolve(res)
        })
        .catch(error => {
          if (error.response.status === 400) {
            this.$message({
              message: error.response.data.message,
              type: 'warning'
            })
            return Promise.reject(error)
          }
        })

      let params = {
        shopDrugId: this.drugValue.shopDrugId,
        startDate: this.startDate,
        endDate: this.endDate
        // userId: 'kDw85WlUSDGX99dvWyQ5pi',
        // shopId: 'y7P-oo_CSMalqzo1yGxncF'// this.shopId
      }
      let applyRes = await axios.post(`/api/shop/drugRecommendApplies`, params)
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
