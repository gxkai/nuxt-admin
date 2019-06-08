<template>
  <div class="detail-wrap">
    <div class="detail">
      <bread-crumb :path="$route.path"/>

      <div class="title">
        <h3>评价详情</h3>
        <el-button type="primary" size="small" @click="$router.push('/order/appraise')">返回</el-button>
      </div>

      <div class="detail-con">
        <div class="form-info">
          <el-form ref="formInfo" :model="formInfo" label-width="150px">
            <el-form-item label="药房名称：">
              <el-input v-model="formInfo.shopName" readonly placeholder="暂无"></el-input>
            </el-form-item>
            <el-form-item label="药品名称：">
              <el-input v-model="formInfo.drugName" readonly placeholder="暂无"></el-input>
            </el-form-item>
            <el-form-item label="药品规格：">
              <el-input v-model="formInfo.spec" readonly placeholder="暂无"></el-input>
            </el-form-item>
            <el-form-item label="买家名称：">
              <el-input v-model="formInfo.buyerName" readonly placeholder="暂无"></el-input>
            </el-form-item>
            <el-form-item label="评价内容：">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="暂无"
                v-model="formInfo.content">
              </el-input>
            </el-form-item>
            <el-form-item label="评价等级：">
              <el-input v-model="formInfo.score" readonly placeholder="暂无"></el-input>
            </el-form-item>
            <el-form-item label="评价时间：">
              <el-input v-model="formInfo.appraiseDate" readonly placeholder="暂无"></el-input>
            </el-form-item>
          </el-form>
        </div>
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
  export default class Rx extends Vue {
    formInfo = {};

    async getDetail (id) {
      let {data: detail} = await axios.get(`/api/supervise/drugAppraises/${id}`)
      this.formInfo = detail
      this.formInfo.appraiseDate = moment(this.formInfo.appraiseDate).format('YYYY-MM-DD HH:mm:ss')
    }

    mounted () {
      let id = this.$route.query.id
      this.getDetail(id)
    }
  }
</script>

<style lang="scss">
  .detail-wrap{
    padding: 0 10px;
    margin-bottom: 30px;

    .el-table{
      th{
        background: #F4F4F4;
      }
    }

    .detail{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        border-bottom: 1px solid #E9E9E9;

        h3{
          color: #666;
          font-size: 18px;
        }
      }

      &-con {
        padding: 15px;

        .form-info{
          padding: 20px 300px 0 0;

          .el-form{
            display: grid;

            .el-form-item {
              &:nth-child(2n-1){
                grid-column: 1 / 3;
              }
              &:nth-child(2n){
                grid-column: 3 / 5;
              }

              &:nth-child(5) {
                grid-row: 3 / 4;
                grid-column: 1 / 5;
              }

              &:nth-child(7) {
                grid-column: 1 / 3;
                grid-row: 4 / 4;
              }
            }
          }
        }
      }
    }
  }
</style>
