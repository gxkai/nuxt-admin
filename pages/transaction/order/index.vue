<template>
  <div class="order-wrap">
    <div class="order">
      <bread-crumb :path="$route.path"/>
      <div class="filter">
        <el-row :gutter="20">
          <el-col :span="24" class="filter-top">
            <el-col :span="8">
              <span>订单编号：</span>
              <el-input v-model="orderID" placeholder="请输入" size="small"></el-input>
            </el-col>
            <el-col :span="8">
              <span>订单类型：</span>
              <el-select v-model="orderType" clearable filterable placeholder="请选择" size="small">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <span>订单状态：</span>
              <el-select v-model="orderState" clearable filterable placeholder="请选择" size="small">
                <el-option
                  v-for="item in stateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-col>

          <el-col :span="24" class="filter-bottom">
            <!--<el-col :span="8">-->
              <!--<span>药店名称：</span>-->
              <!--&lt;!&ndash;请选择药房名称&ndash;&gt;-->
              <!--<el-button class="select-btn" v-if="shopNameValue" type="small" @click="shopNameDialog = true">{{ shopNameValue }}</el-button>-->
              <!--<el-button class="select-btn" v-else type="small" @click="shopNameDialog = true" style="color: #C0C4CC">药房名称</el-button>-->
            <!--</el-col>-->

            <el-col :span="8">
              <span>用户信息：</span>
              <el-select v-model="userValue" clearable filterable placeholder="请选择" size="small">
                <el-option
                  v-for="item in userList"
                  :key="item.username"
                  :label="item.username"
                  :value="item.username">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;时间：</span>
              <el-date-picker
                size="small"
                v-model="dateValue"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="convertDate">
              </el-date-picker>
            </el-col>

            <el-col :span="8" class="action-col">
              <el-button size="small" type="primary" @click="search">搜索</el-button>
              <el-button size="small" @click="reset">重置</el-button>
            </el-col>


          </el-col>

          <!--<el-col :span="23" class="action-col">-->
            <!--<el-button size="small" type="primary" @click="search">搜索</el-button>-->
            <!--<el-button size="small" @click="reset">重置</el-button>-->
          <!--</el-col>-->
        </el-row>
      </div>

      <!--选择药房名称-->
      <!--<el-dialog-->
        <!--title="药房名称"-->
        <!--:close-on-click-modal='isCloseOnClickModal'-->
        <!--:visible.sync="shopNameDialog"-->
        <!--width="50%">-->
        <!--<ShopName v-on:listenToChildEvent="getSelectedInfo"></ShopName>-->
        <!--<span slot="footer" class="dialog-footer">-->
          <!--<el-button @click="shopNameDialog = false">取 消</el-button>-->
          <!--<el-button type="primary" @click="confirmSelect">确 定</el-button>-->
        <!--</span>-->
      <!--</el-dialog>-->

      <div class="order-list">
        <div class="container" v-for="(item, index) in perPageData" :key="index">
          <div class="wrapper wrapper1">
            <div class="item item1 item-bg">
              <span>商品信息</span>
            </div>
            <div class="item item2">
              <p>
                订单编号：{{ item.number }}，下单时间：{{ item.createdDate }}，<span>备注：{{ item.accountRemark }}</span>
              </p>
            </div>
            <div class="item item3">
              <table>
                <tr class="tits">
                  <td></td>
                  <td>药品名称</td>
                  <td>单价</td>
                  <td>件数</td>
                  <td>12位条形码</td>
                </tr>
                <tr class="item-info" v-for="item2 in item.orderItemDrugInfoDTOList" :key="item2.drugId">
                  <td>
                    <img class="drug-icon" :src="item2.srcUrl">
                  </td>
                  <td class="text-over">{{ item2.drugName }}</td>
                  <td>{{ item2.price }}</td>
                  <td>{{ item2.quantity }}</td>
                  <td class="text-over">{{ item2.barCode }}</td>
                </tr>
              </table>
            </div>

            <div class="item item4 item-bg">
              <span>备货门店</span>
            </div>
            <div class="item item5 item-bg">
              <span>用户信息</span>
            </div>
            <div class="item item6 item-bg">
              <span>提货方式</span>
            </div>
            <div class="item item7 item-bg">
              <span>提货人信息</span>
            </div>
            <div class="item item8 item-bg">
              <span>订单类型</span>
            </div>
            <div class="item item9">
              <span class="text-over">{{ item.shopName }}</span>
            </div>
            <div class="item item10">
              <span>{{ item.buyerName }}</span>
            </div>
            <div class="item item11">
              <span>{{ item.deliveryType }}</span>
            </div>
            <div class="item item12">
              <p>姓名：{{ item.consignee }}</p>
              <p class="text-over" :title="item.buyerPhone">电话：{{ item.buyerPhone }}</p>
              <p class="text-over" :title="item.address">地址：{{ item.address }}</p>
            </div>
            <div class="item item13">
              <span>{{$t(item.type)}}</span>
            </div>
          </div>

          <div class="wrapper wrapper2">
            <div class="item item1 item-bg">
              <span>是否医保结算</span>
            </div>
            <div class="item item2 item-bg">
              <span>订单金额</span>
            </div>
            <div class="item item3 item-bg">
              <span>当前状态</span>
            </div>
            <div class="item item4 item-bg">
              <span>操作</span>
            </div>
            <div class="item item5">
              <span>{{item.medicaid}}</span>
            </div>
            <div class="item item6">
              <p>{{item.totalAmount}}</p>
              <p>(含医保: {{item.medicaidAmount}} )</p>
              <p>{{item.totalAmount}}</p>
            </div>
            <div class="item item7">
              <span>{{item.state}}</span>
            </div>
            <div class="item item8">
              <el-button type="text" size="medium" @click="viewDetail(index, item)">查看详情</el-button>
              <el-button type="text" size="medium" @click="finishedAdjust(index, item.id)">调剂完成</el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPageNum"
          :page-size="pageNum"
          layout="prev, pager, next, jumper, total"
          :total="orderListData.length">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  // import ShopName from '@/components/shop/ShopName'
  import axios from 'axios'
  import moment from 'moment'
  @Component({
    components: {
      BreadCrumb
      // ShopName
    }
  })
  export default class Order extends Vue {
    // 弹窗
    selectedInfo = '' // 子组件传过来的数据
    childData = [] // 暂存已选的数据
    // 药房
    isCloseOnClickModal = false
    // shopNameDialog = false
    // shopNameValue = ''
    shopId = ''

    orderID = ''
    orderType = ''
    typeList = [
      {
        value: 'SIMPLE',
        label: '普通订单'
      },
      {
        value: 'RX',
        label: '处方订单'
      },
      {
        value: 'HOSPITAL',
        label: '医院订单'
      }
    ]
    orderState = ''
    stateList = [
      {
        value: 'TO_PAY',
        label: '待付款'
      },
      // {
      //   value: 'TO_CHECK',
      //   label: '待审批'
      // },
      {
        value: 'TO_DELIVERY',
        label: '调剂中'
      },
      {
        value: 'TO_RECEIVED',
        label: '待收货'
      },
      {
        value: 'TO_APPRAISE',
        label: '待评价'
      },
      {
        value: 'COMPLETED',
        label: '交易成功'
      },
      {
        value: 'REFUNDING',
        label: '退款中'
      },
      {
        value: 'REFUND_COMPLETE',
        label: '退款成功'
      },
      {
        value: 'CLOSED',
        label: '交易关闭'
      }
    ]

    // shopNameValue = ''
    // shopId = ''
    // shopNameList = []
    userValue = ''
    userList = []

    dateValue = '' // 日期区间
    startDate = '' // 起始日期
    endDate = '' // 截止日期

    // 分页
    currentPageNum = 1
    pageNum = 15

    // 所有订单列表数据
    orderListData = []

    perPageData = [] // 存储每页显示的数据

    convertDate () {
      if (this.dateValue) {
        for (let i = 0, len = this.dateValue.length; i < len; i++) {
          this.dateValue[i] = moment(this.dateValue[i]).format('YYYY-MM-DD')
        }
        this.startDate = this.dateValue[0] + ' 00:00:00'
        this.endDate = this.dateValue[1] + ' 23:59:59'
      }
    }

    // 获取已选信息
    // getSelectedInfo (data) {
    //   this.selectedInfo = data
    // }

    // 获取药店名称
    // confirmSelect () {
    //   if (!this.selectedInfo) {
    //     this.shopNameDialog = false
    //     return
    //   }
    //   this.childData = this.selectedInfo
    //   this.shopId = this.childData.id
    //   this.shopNameValue = this.childData.shopName
    //   this.shopNameDialog = false
    //   this.selectedInfo = ''
    // }

    handleCurrentChange (page) {
      this.currentPageNum = page
      this.getOrderList()
    }

    // 查看详情
    viewDetail (index, row) {
      this.$router.push({
        path: '/transaction/order/detail',
        query: {
          id: row.id,
          rxId: row.rxId
        }
      })
    }

    // 调剂完成
    async finishedAdjust (index, id) {
      await axios.get(`/api/shop/order/regulate`, {params: {id: id}})
      this.$message({
        message: '调剂完成',
        type: 'success'
      })
    }

    messageNotice () {
      this.$notify.info({
        message: '您有一笔新订单，请及时确认！',
        position: 'bottom-right',
        customClass: 'notice-msg'
      })
    }

    // 重置
    reset () {
      this.orderID = ''
      this.orderType = ''
      this.orderState = ''
      this.shopNameValue = ''
      this.userValue = ''
      this.dateValue = ''
      this.getOrderList()
    }

    // 搜索查询
    async search () {
      this.getOrderList()
    }

    async getOrderList () {
      let params = {
        pageNum: this.currentPageNum,
        pageSize: this.pageNum,
        number: this.orderID,
        type: this.orderType,
        state: this.orderState,
        shopId: this.shopId,
        buyerName: this.userValue,
        startDate: this.startDate,
        endDate: this.endDate
      }
      let orderData = await axios.get(`/api/shop/orders`, {params})
      console.log(orderData)
      this.orderListData = orderData.data.list

      this.perPageData = this.orderListData
      this.perPageData = this.perPageData.slice((this.currentPageNum - 1) * this.pageNum, this.currentPageNum * this.pageNum)
      this.perPageData.forEach((item) => {
        if (item.consignee !== null) {
          this.userList.push({
            name: item.consignee.trim()
          })
        }
        item.createdDate = item.createdDate === null ? item.createdDate : moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
        // 获取药品图片
        item.orderItemDrugInfoDTOList.forEach(e => {
          axios.get(`/api/shop/files/${e.fileId}`, {params: {local: '', resolution: ''}}).then(res => {
            item.orderItemDrugInfoDTOList.map(i => {
              this.$set(i, 'srcUrl', res.data.replace('redirect:', ''))
              return i
            })
          })
        })
        // 转换
        if (item.deliveryType === 'SELF') {
          item.deliveryType = '自提'
        } else {
          item.deliveryType = '配送'
        }
        if (item.medicaid.toString() === 'false') {
          item.medicaid = '否'
        } else {
          item.medicaid = '是'
        }
        if (item.type === 'SIMPLE') {
          item.type = '普通订单'
        } else if (item.type === 'RX') {
          item.type = '处方订单'
        } else if (item.type === 'HOSPITAL') {
          item.type = '医院订单'
        }
      })
    }

    beforeMount () {
      this.getOrderList()
      this.messageNotice()
    }
  }
</script>

<style lang="scss" scoped>
  $tableBorder: 1px solid #EBEEF5;

  .select-btn{
    width: 65%;
    text-align: left;
    font-size: 14px;
  }

  .order-wrap{
    padding: 0 10px;
    margin-bottom: 30px;

    .order{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .filter{
        margin: 20px 0;
        padding-bottom: 20px;
        border-bottom: 1px solid #E9E9E9;

        span{
          font-size: 15px;
        }

        .el-col-8{
          text-align: center;
        }

        .action-col{
          text-align: right;
          line-height: 40px;
        }

        &-bottom{
          margin: 20px 0;
        }

        .el-input,.el-select,.el-date-editor{
          width: 65%;
        }

        .el-select{
          .el-input{
            width: 100%;
          }
        }
      }

      &-list{
        padding: 0 15px;
        .container {
          font-size: 14px;
          margin-top: 30px;
          display: grid;
          background: #EBEEF5;
          border: $tableBorder;
          grid-column-gap: 1px;
          grid-template-columns: 65% 35%;

          p{
            margin: 0;
            padding: 5px 0;
          }

          .wrapper {
            display: grid;
            grid-template-rows: 50px 70px auto;
            grid-template-columns: repeat(9, 1fr);
            background: #FFF;

            .text-over{
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 100px;
            }

            .item{
              display: flex;
              flex-flow: column;
              justify-content: center;
              padding: 10px;

              &-bg{
                color: #555;
                font-weight: bold;
                background-color: #F4F4F4;
              }

              &-info{
                img{
                  width: 50px;
                  height: 50px;
                }
              }
            }
          }

          .wrapper1 {
            .item{
              &1{
                grid-area: 1 / 1 / 1 / 6;
              }

              &2{
                grid-column: 1 / 11;
                border-bottom: $tableBorder;
              }

              &3{
                grid-area: 3 / 1 / 3 / 6;
                justify-content: normal;

                td{
                  width: 25%;
                  text-align: center;
                  &:first-child{
                    width: 15%;
                  }
                }

                .tits{
                  display: flex;
                  justify-content: space-between;
                  text-align: right;

                  td{
                    font-weight: 600;
                  }
                }
                .item-info{
                  display: flex;
                  flex-flow: nowrap;
                  align-items: center;
                  padding: 10px 0;
                  .drug-info{
                    flex: 2;
                  }
                }
              }

              &4{
                grid-area: 1 / 6 / 1 / 6;
              }

              &5{
                grid-area: 1 / 7 / 2 / 7;
              }

              &6{
                grid-area: 1 / 8 / 2 / 8;
              }

              &7{
                grid-area: 1 / 9 / 1 / 9;
              }

              &8{
                grid-area: 1 / 10 / 1 / 10;
                border-bottom: $tableBorder;
              }

              &9{
                grid-area: 3 / 6 / 3 / 6;
              }

              &10{
                grid-area: 3 / 7 / 3 / 7;
              }

              &11{
                grid-area: 3 / 8 / 3 / 8;
              }

              &12{
                grid-area: 3 / 9 / 3 / 9;
              }

              &13{
                grid-area: 3 / 10 / 3 / 10;
              }

              &3, &9, &10, &11, &12{
                border-right: $tableBorder;
              }

              &1, &4, &5, &6, &7{
                border-right: $tableBorder;
                border-bottom: $tableBorder;
              }

              &4, &5, &6, &7, &8, &9, &10, &11, &13{
                text-align: center;
              }
            }
          }

          .wrapper2 {
            display: grid;
            grid-template-rows: 50px auto;
            grid-template-columns: repeat(4, 1fr);

            .item{
              text-align: center;
            }
            .item1{
              grid-area: 1/1/2/2;
            }
            .item2{
              grid-area: 1/2/2/3;
            }
            .item3{
              grid-area: 1/3/2/4;
            }
            .item4{
              grid-area: 1/4/2/5;
            }

            .item1, .item2, .item3, .item4{
              border:{
                bottom: $tableBorder;
                right: $tableBorder;
              }
            }

            .item5, .item6, .item7, .item8{
              border-right: $tableBorder;
            }

            .el-button+.el-button {
              margin-left: 0;
            }
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  .pagination{
    margin: 30px 0;
    .el-pagination__total{
      float: right;
    }
  }

  /*消息提醒样式*/
  .el-notification{
    & .el-icon-info{
      color: #e6a23c;
    }

    &__content{
      margin-top: 3px;
    }
  }
</style>
