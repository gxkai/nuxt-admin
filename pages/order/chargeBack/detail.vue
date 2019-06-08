<template>
  <div class="order-detail-wrap">
    <div class="detail">
      <bread-crumb :path="$route.path"/>

      <div class="title">
        <h3>正在查看订单【{{ this.orderNumberTit }}】的详细信息</h3>
      </div>

      <div class="main-content">
        <!--订单进度条-->
        <div class="step-bar">
          <el-steps :active="orderStatus" align-center>
            <el-step :title="item.orderState" :description="item.createdDate" v-for="(item,index) in stepsOptions" :key="index"></el-step>
          </el-steps>
        </div>

        <!--订单基本信息-->
        <div class="base-info">
          <h5 class="tit">订单基本信息</h5>

          <div class="info-con">
            <div class="left-info">
              <ul>
                <li>
                  <h4>商品总价：{{ totalAmount }}</h4>
                </li>
                <li>
                  <h4>订单总价：{{ payAmount }}</h4>
                </li>
                <li>
                  <p>商品成本：0.00</p>
                </li>
                <li>
                  <p>付费方式：农商行</p>
                </li>
                <li>
                  <p>医保扣除：{{ medicaidAmount }}</p>
                </li>
                <li>
                  <p>线上付款：0.00</p>
                </li>
                <li>
                  <p>折扣扣除：0.00</p>
                </li>
              </ul>
            </div>
            <div class="right-info">
              <ul>
                <li>
                  <p>收货人：{{ consignee }}</p>
                </li>
                <li>
                  <p>收货地址：{{ address }}</p>
                </li>
                <li>
                  <p>联系电话：{{ phone }}</p>
                </li>
              </ul>
            </div>
          </div>

          <div class="remark">
            <span>备注：</span>
            <span>{{ remark }}</span>
          </div>
        </div>

        <!--订单详情-->
        <div class="order-detail">
          <h4>订单详情：</h4>
          <d2-crud
            ref="orderDetailCrud"
            :columns="orderDetailColumns"
            :data="orderDetailData"
            :options="optionData"/>
          <div class="total">
            <span>合计</span>
            <span>大写金额：{{ payAmount2 }}</span>
            <span>小写金额：{{ payAmount }}</span>
          </div>
        </div>

        <el-tabs class="detail-tab" v-model="tabActive" type="card">
          <el-tab-pane label="跟踪记录" name="first">
            <!--跟踪记录-->
            <div class="track-record">
              <!--<h5 class="tit">跟踪记录</h5>-->
              <d2-crud
                ref="trackCrud"
                :columns="trackColumns"
                :data="trackData"
                :loading="loading"
                :pagination="pagination"
                :options="optionData"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="查看处方单" name="second">
            <!--如果是处方单购药，可以查看到处方单-->
            <div class="prescription-list">
              <!--<h5 class="tit">查看处方单</h5>-->
              <div class="detail-con">
                <div class="form-info">
                  <h4>处方单详情</h4>
                  <el-form ref="formInfo" :model="formInfo" label-width="150px">
                    <el-form-item label="No：">
                      <el-input v-model="formInfo.idNumber" readonly placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="处方日期：">
                      <el-date-picker
                        readonly
                        v-model="formInfo.rxDate"
                        type="date"
                        placeholder="选择日期"
                        style="width: 100%">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="姓名：">
                      <el-input v-model="formInfo.name" readonly placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="性别：">
                      <el-input v-model="formInfo.sex" readonly placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="年龄：">
                      <el-input v-model="formInfo.age" readonly placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="单位地址：">
                      <el-input v-model="formInfo.address" readonly placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话：">
                      <el-input v-model="formInfo.telNumber" readonly placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="医院：">
                      <el-input v-model="formInfo.hospital" readonly placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="科室：">
                      <el-input v-model="formInfo.department" readonly placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="诊断：">
                      <el-input v-model="formInfo.diagnosis" readonly placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-form>
                </div>

                <div class="rp-wrap">
                  <h4>Rp</h4>
                  <d2-crud
                    :columns="rpColumns"
                    :data="rpData"
                    :options="optionData"/>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="back">
        <el-button @click="$router.push('/order/order')">返回</el-button>
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
  export default class Order extends Vue {
    tabActive = 'first'
    // 进度条 默认为1
    orderStatus = 1
    stepsOptions = []
    orderNumberTit = ''
    orderDetailColumns = [
      {
        title: '序号',
        key: 'index',
        width: 60
      },
      {
        title: '商品名称',
        key: 'name'
      },
      {
        title: '规格',
        key: 'spec'
      },
      {
        title: '单价(元)',
        key: 'price'
      },
      {
        title: '数量',
        key: 'quantity'
      },
      {
        title: '金额(元)',
        key: 'total'
      }
    ]
    orderDetailData = []

    trackColumns = [
      {
        title: '处理时间',
        key: 'createdDate'
      },
      {
        title: '处理信息',
        key: 'state'
      },
      {
        title: '处理明细',
        key: 'message'
      },
      {
        title: '操作人',
        key: 'operator'
      }
    ]

    trackData = []

    // 处方单详情
    formInfo = {
      idNumber: '',
      rxDate: '',
      name: '',
      sex: '',
      age: '',
      address: '',
      telNumber: '',
      hospital: '',
      department: '',
      diagnosis: ''
    }

    rpColumns = [
      {
        title: '组号',
        key: 'index',
        width: 60
      },
      {
        title: '药品名',
        key: 'name'
      },
      {
        title: '规格',
        key: 'spec'
      },
      {
        title: '用量',
        key: 'dosage'
      },
      {
        title: '用量单位',
        key: 'unit'
      },
      {
        title: '频次',
        key: 'frequency'
      },
      {
        title: '天数',
        key: 'days'
      }
    ]

    rpData = []

    optionData = {
      border: true
    }

    loading = false;
    pagination = {
      currentPage: 1,
      pageSize: 5,
      total: 0
    }

    consignee = '' // 收货人
    address = ''// 收货地址
    phone = '' // 联系电话

    totalAmount = '' // 总金额
    medicaidAmount = '' // 医保金额
    payAmount = '' // 支付金额
    payAmount2 = '' // 大写金额

    remark = '' // 备注

    beforeMount () {
      this.getDetail()
    }
    async getDetail () {
      let id = this.$route.query.id
      let orderInfo = await axios.get(`/api/supervise/orders/${id}`)
      console.log(orderInfo.data)
      this.orderNumberTit = orderInfo.data.number

      this.stepsOptions = orderInfo.data.orderStates
      this.stepsOptions.forEach(item => {
        item.orderState = this.isAbled(item.orderState)
        item.createdDate = item.createdDate === null ? item.createdDate : moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
      })

      // 进度条
      let orderStatus = {
        'TO_PAY': 1, // 待付款
        'TO_CHECK': 2, // 待审批
        'TO_DELIVERY': 3, // 调剂中
        'TO_RECEIVED': 4, // 待收货
        'TO_APPRAISE': 5, // 待评价
        'COMPLETED': 6, // 交易成功
        'REFUNDING': 7, // 退款中
        'REFUND_COMPLETE': 8, // 退款成功
        'CLOSED': 9 // 交易关闭
      }
      for (let i in orderStatus) {
        if (i === orderInfo.data.state) {
          this.orderStatus = orderStatus[i]
        }
      }

      this.consignee = orderInfo.data.consignee // 收货人
      this.address = orderInfo.data.address// 收货地址
      this.phone = orderInfo.data.phone // 联系电话

      this.totalAmount = orderInfo.data.totalAmount // 总金额
      this.medicaidAmount = orderInfo.data.medicaidAmount // 医保金额
      this.payAmount = orderInfo.data.payAmount // 支付金额

      this.remark = orderInfo.data.remark // 备注

      this.orderDetailData = orderInfo.data.drugInfoAdminDTOList // 订单详情
      this.orderDetailData.forEach((item, index) => {
        item.index = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
      })

      this.trackData = orderInfo.data.orderLogList
      console.log('跟踪记录')
      console.log(this.trackData)
      this.trackData.forEach(e => {
        e.createdDate = moment(e.createdDate).format('YYYY-MM-DD HH:mm:ss')
        e.state = this.isAbled(e.state)
      })

      if (orderInfo.data.rxId !== null) {
        let rxInfo = await axios.get(`/api/supervise/rxs/KCgfjEXqQRi1SOIC_JQvdw/info`)
        console.log(rxInfo)
      }
      // rxId 是 KCgfjEXqQRi1SOIC_JQvdw --- 假数据
      let rxInfo = await axios.get(`/api/supervise/rxs/KCgfjEXqQRi1SOIC_JQvdw/info`)
      // console.log(rxInfo.data)
      this.formInfo.idNumber = rxInfo.data.number
      this.formInfo.rxDate = moment(rxInfo.data.rxDate).format('YYYY-MM-DD HH:mm:ss')
      this.formInfo.name = rxInfo.data.accountName
      if (rxInfo.data.gender === 'MALE') {
        this.formInfo.sex = '男'
      } else {
        this.formInfo.sex = '女'
      }
      this.formInfo.age = rxInfo.data.age
      this.formInfo.address = rxInfo.data.place
      this.formInfo.telNumber = rxInfo.data.phone
      this.formInfo.hospital = rxInfo.data.hospital
      this.formInfo.department = rxInfo.data.office
      this.formInfo.diagnosis = rxInfo.data.illness
      // list
      this.rpData = rxInfo.data.list
      this.rpData.forEach((item, index) => {
        item.index = index + 1
      })
      this.payAmount2 = this.DX(this.payAmount) // 大写金额转换
    }
    // 大写金额
    DX (n) {
      if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) { return '数据非法' }
      let unit = '千百拾亿千百拾万千百拾元角分'
      let str = ''
      n += '00'
      let p = n.indexOf('.')
      if (p >= 0) { n = n.substring(0, p) + n.substr(p + 1, 2) }
      unit = unit.substr(unit.length - n.length)
      for (let i = 0; i < n.length; i++) { str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i) }
      return str.replace(/零(千|百|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(万|亿|元)/g, '$1').replace(/(亿)万|壹(拾)/g, '$1$2').replace(/^元零?|零分/g, '').replace(/元$/g, '元整')
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
  }
</script>

<style lang="scss">

  .order-detail-wrap{
    padding: 0 10px;
    margin-bottom: 30px;

    h2, h3, h4, h5{
      margin: 0;
    }

    .detail{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .el-table{
        th{
          background-color: #F4F4F4;
          color: #555;
        }
      }

      .title{
        margin-top: 20px;
        padding: 0 10px 15px;
        border-bottom: 1px solid #E9E9E9;
      }

      .main-content{
        padding: 10px 20px;

        .step-bar{
          padding: 30px 0;

          .is-finish{
            color: #F00;
            border-color: #F00;
          }

          .is-process{
            color: #1abc9c;
            border-color: #1abc9c;
          }
        }

        .tit{
          width: 100px;
          padding: 12px;
          margin-top: 30px;
          color: #FFF;
          text-align: center;
          background: #339933;
        }

        .base-info{
          border-bottom: 2px dotted #1abca9;
          padding-bottom: 20px;

          .info-con{
            width: 80%;
            display: flex;

            ul{
              overflow: hidden;
              padding: 0;

              li{

                list-style: none;
                line-height: 30px;

                h4{
                  color: #1abc9c;
                  padding-bottom: 10px;
                }

                h4, p{
                  margin: 0;
                  font-size: 15px;
                }
              }
            }

            .left-info{
              flex: 1;
              li{
                float: left;
                width: 50%;
              }
            }

            .right-info{
              flex: 1;
              padding-top: 10px;
              position: relative;

              &:before{
                content: '';
                width: 2px;
                height: 100%;
                background: linear-gradient(#FFF, #1abc9c, #FFF);
                position: absolute;
                left: 0;
                top: 0;
              }

              ul{
                padding-left: 50px;
              }

              span{
                text-align: right;
              }
            }
          }

          .remark{
            font-size: 15px;
            line-height: 25px;

            span{
              display: inline-block;
              &:first-child{
                width: 50px;
              }

              &:last-child{
                width: 90%;
                border-bottom: 1px solid #000;
              }
            }
          }
        }

        .order-detail{
          width: 95%;

          h4{
            margin-top: 30px;
          }

          .total{
            width: 100%;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            border: 1px solid #ebeef5;

            span{
              font-size: 15px;
              text-align: right;

              &:nth-child(1){
                flex: 2.2;
              }

              &:nth-child(2){
                flex: 1;
              }

              &:nth-child(3){
                flex: 1;
                padding-right: 50px;
              }
            }
          }
        }

        .track-record{
          width: 95%;
        }

        .prescription-list{
          .form-info{
            padding: 20px 300px 0 0;

            h4{
              color: #6c6c6c;
              padding-bottom: 30px;
              padding-left: 20px;
            }

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
            width: 88%;
            margin: 20px auto;
          }
        }
      }

      .back{
        text-align: center;
        margin: 20px auto 30px;
      }

      &-tab{
        margin-top: 30px;
        .el-tabs{
          &__header{
            border-bottom: none;
          }

          &__nav{
            border: none;
            border-radius: 4px
          }

          &__item{
            color: #303133;
            border: 1px solid #e4e7ed;

            &:hover{
              color: #339933;
            }

            &:first-child{
              border-radius: 4px 0 0 4px;
              border-left: 1px solid #e4e7ed;
              border-right-color: transparent;
            }

            &:last-child{
              border-radius: 0 4px 4px 0;
              border-left-color: transparent;
            }

            &.is-active{
              color: #FFF;
              border-color: #339933;
              background: #339933;
            }
          }
        }
      }
    }
  }
</style>
