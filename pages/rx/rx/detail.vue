<template>
  <div class="rd-detail-wrap">
    <div class="detail">
      <bread-crumb :path="$route.path"/>

      <div class="title">
        <h3>处方单详情</h3>
      </div>

      <div class="detail-con">
        <div class="form-info">
          <el-form ref="formInfo" :model="formInfo" label-width="150px">
            <el-form-item label="No：">
              <el-input v-model="formInfo.number" readonly></el-input>
            </el-form-item>
            <el-form-item label="处方日期：">
              <el-input v-model="formInfo.rxDate" readonly></el-input>
            </el-form-item>
            <el-form-item label="姓名：">
              <el-input v-model="formInfo.accountName" readonly></el-input>
            </el-form-item>
            <el-form-item label="性别：">
              <el-input :value="$t(formInfo.gender)" readonly></el-input>
            </el-form-item>
            <el-form-item label="年龄：">
              <el-input v-model="formInfo.age" readonly></el-input>
            </el-form-item>
            <el-form-item label="单位地址：">
              <el-input v-model="formInfo.place" readonly></el-input>
            </el-form-item>
            <el-form-item label="联系电话：">
              <el-input v-model="formInfo.phone" readonly></el-input>
            </el-form-item>
            <el-form-item label="医院：">
              <el-input v-model="formInfo.hospital" readonly></el-input>
            </el-form-item>
            <el-form-item label="科室：">
              <el-input v-model="formInfo.office" readonly></el-input>
            </el-form-item>
            <el-form-item label="诊断：">
              <el-input v-model="formInfo.illness" readonly></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="rp-wrap">
          <h3>Rp</h3>
          <d2-crud
            :columns="rpColumns"
            :data="rpList"
            :options="options"/>
        </div>

        <div class="track-info">
          <h3>处方单跟踪信息</h3>
          <el-form ref="trackForm" :model="trackInfo" label-width="120px">
            <el-form-item label="订单编号：">
              <el-input v-model="trackInfo.orderNumber" readonly></el-input>
            </el-form-item>
            <el-form-item label="支付方式：">
              <el-input v-model="trackInfo.payMethod" readonly></el-input>
            </el-form-item>
            <el-form-item label="药店：">
              <el-input v-model="trackInfo.pharmacyName" readonly></el-input>
            </el-form-item>
            <el-form-item label="订单状态：">
              <el-input v-model="trackInfo.orderStatus" readonly></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="back">
        <el-button @click="$router.push('/rx/rx')">返回</el-button>
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

    trackInfo = {
      orderNumber: '',
      payMethod: '',
      pharmacyName: '',
      orderStatus: ''
    };

    rpColumns = [
      {
        title: '组号',
        key: 'index',
        width: 100
      },
      {
        title: '药品名',
        key: 'name'
      },
      {
        title: '用量',
        key: 'dosage',
        width: 150
      },
      {
        title: '用量单位',
        key: 'unit',
        width: 100
      },
      {
        title: '频次',
        key: 'frequency',
        width: 100
      },
      {
        title: '天数',
        key: 'days',
        width: 100
      }
    ];

    rpList = [];

    options = {
      border: true
    };

    async getRxDetail (id) {
      let {data: rxDetail} = await axios.get(`/api/supervise/rxs/${id}`)
      console.log(rxDetail)

      this.formInfo = rxDetail
      this.formInfo.rxDate = moment(this.formInfo.rxDate).format('YYYY-MM-DD HH:mm:ss')
      this.rpList = rxDetail.list
      this.rpList.forEach((item, index) => {
        item.index = index + 1
        item.name += `（${item.spec}）`
      })

      console.log(rxDetail.rxOrderStateDTOList[0])
      this.trackInfo.orderNumber = rxDetail.rxOrderStateDTOList[0].number
      this.trackInfo.payMethod = rxDetail.rxOrderStateDTOList[0].type
      this.trackInfo.pharmacyName = rxDetail.rxOrderStateDTOList[0].shopName
      this.trackInfo.orderStatus = this.isAbled(rxDetail.rxOrderStateDTOList[0].state)
    }

    // 转换当前状态
    isAbled (state) {
      if (state === 'TO_PAY') {
        return '待付款'
      } else if (state === 'TO_CHECK') {
        return '待审批'
      } else if (state === 'TO_DELIVERY') {
        return '调剂中'
      } else if (state === 'TO_RECEIVED') {
        return '待收货'
      } else if (state === 'TO_APPRAISE') {
        return '待评价'
      } else if (state === 'COMPLETED') {
        return '交易成功'
      } else if (state === 'REFUNDING') {
        return '退款中'
      } else if (state === 'REFUND_COMPLETE') {
        return '退款成功'
      } else if (state === 'CLOSED') {
        return '交易关闭'
      }
    }

    mounted () {
      let rxId = this.$route.query.rxId
      this.getRxDetail(rxId)
    }
  }
</script>

<style lang="scss">
  .rd-detail-wrap{
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
        padding: 0 15px;
        border-bottom: 1px solid #E9E9E9;

        h3{
          color: #666;
        }
      }

      &-con {
        padding: 0 15px;

        .form-info{
          padding: 20px 150px 0 0;

          .el-form{
            display: grid;

            .el-form-item {
              &:nth-child(2n-1){
                grid-column: 1 / 3;
              }
              &:nth-child(2n){
                grid-column: 3 / 5;
              }
            }
          }
        }

        .track-info{
          padding: 20px 150px 10px 70px;

          .el-form{
            display: grid;

            .el-form-item {
              &:nth-child(2n-1){
                grid-column: 1 / 3;
              }
              &:nth-child(2n){
                grid-column: 3 / 5;
              }
            }
          }
        }

        .rp-wrap{
          padding: 0 70px;

          h3{
            margin-bottom: 0;
          }
        }
      }

      .back{
        text-align: center;
        margin: 30px auto;
      }
    }
  }
</style>
