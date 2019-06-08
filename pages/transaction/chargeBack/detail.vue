<template>
  <div class="order-detail-wrap">
    <div class="detail">
      <bread-crumb :path="$route.path"/>

      <div class="title">
        <h3>正在查看订单【{{ this.orderNumberTit }}】的详细信息</h3>
      </div>

      <div class="main-content">
        <!--订单进度条-->
        <div class="step-bar" v-if="stepsOptions.length === 0">
          <el-steps :active="0" align-center>
            <el-step :title="item.orderState" :description="item.createdDate" v-for="(item,index) in stepBar" :key="index"></el-step>
          </el-steps>
        </div>

        <div class="step-bar" v-if="stepsOptions.length !== 0">
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
            <div class="charge-back">
              <el-button class="offline-back" @click="chargeBack">线下退单</el-button>
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



        <el-tabs class="detail-tab" v-model="tabActiveName" type="card">
          <el-tab-pane label="处方单详情" name="track">
            <!--跟踪记录-->
            <div class="track-record">
              <h5 class="tit">跟踪记录</h5>
              <d2-crud
                ref="trackCrud"
                :columns="trackColumns"
                :data="trackData"
                :loading="loading"
                :pagination="pagination"
                :options="optionData"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="配置管理" name="prescription">
            <!--如果是处方单购药，可以查看到处方单-->
            <div class="prescription-list">
              <!--查看处方单 切换 tab-->
              <!--<h5 class="tit">查看处方单</h5>-->
              <el-tabs v-model="activeRx" class="rx-tab">
                <el-tab-pane :label="item.rxLabel" :name="item.rxName" v-for="(item,index) in rxOptions" :key="index">
                  <!--begin-->
                  <div class="detail-con">
                    <div class="form-info">
                      <h4>处方单详情</h4>
                      <el-form ref="formInfo" label-width="150px">
                        <el-form-item label="No：">
                          <el-input v-model="item.number" readonly placeholder="暂无"></el-input>
                        </el-form-item>
                        <el-form-item label="处方日期：">
                          <el-date-picker
                            readonly
                            v-model="item.rxDate"
                            type="date"
                            placeholder="处方日期"
                            style="width: 100%">
                          </el-date-picker>
                        </el-form-item>
                        <el-form-item label="姓名：">
                          <el-input v-model="item.accountName" readonly placeholder="暂无"></el-input>
                        </el-form-item>
                        <el-form-item label="性别：">
                          <el-input v-model="item.gender" readonly placeholder="暂无"></el-input>
                        </el-form-item>
                        <el-form-item label="年龄：">
                          <el-input v-model="item.age" readonly placeholder="暂无"></el-input>
                        </el-form-item>
                        <el-form-item label="单位地址：">
                          <el-input v-model="item.place" readonly placeholder="暂无"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话：">
                          <el-input v-model="item.phone" readonly placeholder="暂无"></el-input>
                        </el-form-item>
                        <el-form-item label="医院：">
                          <el-input v-model="item.hospital" readonly placeholder="暂无"></el-input>
                        </el-form-item>
                        <el-form-item label="科室：">
                          <el-input v-model="item.office" readonly placeholder="暂无"></el-input>
                        </el-form-item>
                        <el-form-item label="诊断：">
                          <el-input v-model="item.illness" readonly placeholder="暂无"></el-input>
                        </el-form-item>
                      </el-form>
                    </div>

                    <div class="rp-wrap">
                      <h4>Rp</h4>
                      <d2-crud
                        :columns="rpColumns"
                        :data="item.list"
                        :options="optionData"/>
                    </div>
                  </div>
                  <!--end-->
                </el-tab-pane>
              </el-tabs>

              <!--查看处方单 切换 tab end-->

            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="back">
        <el-button @click="$router.push('/transaction/chargeBack')">返回</el-button>
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
  export default class chargeBackDetail extends Vue {
    tabActiveName = 'track'
    // 进度条 默认为1
    orderStatus = 1
    stepsOptions = [] // 动态判断进度条
    // 静态进度条
    stepBar = [{
      orderState: '待付款'
    }, {
      orderState: '调剂中'
    }, {
      orderState: '待收货'
    }, {
      orderState: '待评价'
    }, {
      orderState: '交易成功'
    }, {
      orderState: '退款中'
    }, {
      orderState: '退款成功'
    }, {
      orderState: '交易关闭'
    }]
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

    // 处方单 tab 详情
    activeRx = 'rx1'
    rxOptions = []

    // 线下退单
    chargeBack () {

    }

    beforeMount () {
      this.getDetail()
    }
    async getDetail () {
      let id = this.$route.query.id
      let {data: detailInfo} = await axios.get(`/api/shop/orders/${id}`)
      console.log(detailInfo)
      this.orderNumberTit = detailInfo.number

      if (detailInfo.orderStates) {
        this.stepsOptions = detailInfo.orderStates
        this.stepsOptions.forEach(item => {
          item.orderState = this.isAbled(item.orderState)
          item.createdDate = item.createdDate === null ? item.createdDate : moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
        })
      }

      // 进度条
      let orderStatus = {
        'TO_PAY': 1, // 待付款
        // 'TO_CHECK': 2, // 待审批
        'TO_DELIVERY': 2, // 调剂中
        'TO_RECEIVED': 3, // 待收货
        'TO_APPRAISE': 4, // 待评价
        'COMPLETED': 5, // 交易成功
        'REFUNDING': 6, // 退款中
        'REFUND_COMPLETE': 7, // 退款成功
        'CLOSED': 8 // 交易关闭
      }
      for (let i in orderStatus) {
        if (i === detailInfo.state) {
          this.orderStatus = orderStatus[i]
        }
      }

      this.consignee = detailInfo.consignee // 收货人
      this.address = detailInfo.address// 收货地址
      this.phone = detailInfo.phone // 联系电话

      this.totalAmount = detailInfo.totalAmount // 总金额
      this.medicaidAmount = detailInfo.medicaidAmount // 医保金额
      this.payAmount = detailInfo.payAmount // 支付金额

      this.remark = detailInfo.remark // 备注

      if (detailInfo.drugInfoAdminDTOList) {
        this.orderDetailData = detailInfo.drugInfoAdminDTOList // 订单详情
        this.orderDetailData.forEach((item, index) => {
          item.index = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
        })
      }

      if (detailInfo.orderLogList) {
        this.trackData = detailInfo.orderLogList
        this.trackData.forEach(e => {
          e.createdDate = moment(e.createdDate).format('YYYY-MM-DD HH:mm:ss')
          e.state = this.isAbled(e.state)
        })
      }

      let rxId = this.$route.query.rxId
      if (rxId !== null) {
        let rxInfo = await axios.get(`/api/shop/orders/${id}/rx/info`)
        // console.log(rxInfo.data)
        this.rxOptions = rxInfo.data
        this.rxOptions.forEach((item, index) => {
          let num = index + 1
          // console.log(item)
          this.$set(item, 'rxLabel', '查看处方单' + num.toString())
          this.$set(item, 'rxName', 'rx' + num.toString())
          // 处方单详情
          item.rxDate = moment(item.rxDate).format('YYYY-MM-DD HH:mm:ss')
          if (item.gender === 'MALE') {
            item.gender = '男'
          } else {
            item.gender = '女'
          }
          item.list.forEach((item2, index) => {
            item2.index = index + 1
          })
        })
        this.payAmount2 = this.DX(this.payAmount) // 大写金额转换
      }
      //
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


  .detail-tab{
    width: 95%;
    margin-top: 30px;
  }

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
            width: 93%;
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

            .charge-back{
              display: flex;
              align-items: center;

              .offline-back{
                color: #fff;
                border: none;
                padding: 15px 30px;
                border-radius: 50px;
                background: #1abc9c;
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

        /deep/.prescription-list{
          .rx-tab{
            margin: 20px;
            .el-tabs__active-bar{
              display: none;
            }
            .el-tabs__item{
              border: 1px solid #339933;
              color: #339933;
              &.is-active{
                background: #339933;
                color: #ffffff;
              }
            }
          }
          .el-tabs__nav-wrap::after{
            background-color: #fff
          }

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
    }
  }
</style>
