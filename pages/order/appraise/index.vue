<template>
  <div class="appraise-wrap">
    <div class="appraise">
      <bread-crumb :path="$route.path"/>

      <!--药店评价--选择药房名称-->
      <el-dialog
        title="药房名称"
        :close-on-click-modal='isCloseOnClickModal'
        :visible.sync="shopNameDialog"
        width="50%">
        <ShopName v-on:listenToChildEvent="getSelectedInfo"></ShopName>
        <span slot="footer" class="dialog-footer">
          <el-button @click="shopNameDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmSelect">确 定</el-button>
        </span>
      </el-dialog>


      <!--药品评价---选择药房名称-->
      <el-dialog
        title="药房名称"
        :close-on-click-modal='isCloseOnClickModal'
        :visible.sync="shopNameDialog2"
        width="50%">
        <ShopName v-on:listenToChildEvent="getSelectedInfo2"></ShopName>
        <span slot="footer" class="dialog-footer">
          <el-button @click="shopNameDialog2 = false">取 消</el-button>
          <el-button type="primary" @click="confirmSelect2">确 定</el-button>
        </span>
      </el-dialog>

      <div class="appraise-con">
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="药店评价" name="first" class="shop-appraise">
            <div class="filter">
              <el-row :gutter="20">
                <el-col :span="4">
                  <!--请选择药房名称-->
                  <el-button class="select-btn" v-if="shopNameValue" size="small" @click="shopNameDialog = true">{{ shopNameValue }}</el-button>
                  <el-button class="select-btn" v-else type="small" @click="shopNameDialog = true" style="color: #C0C4CC">药房名称</el-button>
                </el-col>
                <el-col :span="4">
                  <el-input v-model="buyerNameOfShopAppraise" size="small" placeholder="买家姓名"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-date-picker
                    style="width: 100%;"
                    size="small"
                    :clearable="isClearable"
                    v-model="dateOfShopAppraise"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-col>
                <el-col :span="4" class="action-col">
                  <el-button size="small" type="primary" @click="searchShopAppraise">搜索</el-button>
                  <el-button size="small" @click="clearShopCondition">清空</el-button>
                </el-col>
              </el-row>
            </div>

            <div class="shop-appraise__list">
              <d2-crud
                :columns="shopAppraiseColumn"
                :data="shopAppraiseList"
                :pagination="shopAppraisePagination"
                @pagination-current-change="pageChangeOfShopAppraise"
                :options="optionData"
                :rowHandle="shopRowHandle"
                @row-remove="removeShopAppraise"/>
            </div>
          </el-tab-pane>

          <el-tab-pane label="药品评价" name="second" class="drug-appraise">
            <div class="filter">
              <el-row :gutter="20">
                <el-col :span="4">
                  <!--请选择药房名称-->
                  <el-button class="select-btn" v-if="shopNameValue2" size="small" @click="shopNameDialog2 = true">{{ shopNameValue2 }}</el-button>
                  <el-button class="select-btn" v-else type="small" @click="shopNameDialog2 = true" style="color: #C0C4CC">药房名称</el-button>
                </el-col>
                <el-col :span="4">
                  <el-input v-model="drugNameValue" size="small" placeholder="药品名称"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-input v-model="buyerNameOfDrugAppraise" size="small" placeholder="买家姓名"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-date-picker
                    style="width: 100%;"
                    size="small"
                    :clearable="isClearable"
                    v-model="dateOfDrugAppraise"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-col>
                <el-col :span="5" class="action-col">
                  <el-button size="small" type="primary" @click="searchDrugAppraise">搜索</el-button>
                  <el-button size="small" @click="clearDrugCondition">清空</el-button>
                </el-col>
              </el-row>
            </div>

            <div class="drug-appraise__list">
              <d2-crud
                :columns="drugAppraiseColumn"
                :data="drugAppraiseList"
                :pagination="drugAppraisePagination"
                @pagination-current-change="pageChangeOfDrugAppraise"
                :loading="loading"
                :options="optionData"

                :rowHandle="drugRowHandle"
                @row-remove="removeDrugAppraise"
                @viewDetail-emit="viewDetail"/>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import ShopName from '@/components/shop/ShopName'
  import axios from 'axios'
  import moment from 'moment'

  @Component({
    components: {
      BreadCrumb,
      ShopName
    }
  })
  export default class Appraise extends Vue {
    // 药店评价--药房弹窗
    isCloseOnClickModal = false
    shopNameDialog = false
    shopNameValue = ''
    shopId = ''

    // 下拉弹框
    selectedInfo = '' // 子组件传过来的数据
    childData = [] // 暂存已选的数据

    // 药品评价 药房弹窗
    shopNameDialog2 = false
    shopNameValue2 = ''
    shopId2 = ''
    selectedInfo2 = ''
    childData2 = []

    activeTab = 'first';
    isClearable = false

    // 获取已选信息
    getSelectedInfo (data) {
      this.selectedInfo = data
      console.log(this.selectedInfo)
    }
    // 获取药店名称---药店评价
    confirmSelect () {
      if (!this.selectedInfo) {
        this.shopNameDialog = false
        return
      }
      this.childData = this.selectedInfo
      this.shopId = this.childData.id
      this.shopNameValue = this.childData.shopName
      this.shopNameDialog = false
      this.selectedInfo = ''
    }

    // 获取已选信息
    getSelectedInfo2 (data) {
      this.selectedInfo2 = data
      console.log(this.selectedInfo2)
    }
    // 获取药店名称---药品评价
    confirmSelect2 () {
      if (!this.selectedInfo2) {
        this.shopNameDialog2 = false
        return
      }
      this.childData2 = this.selectedInfo2
      this.shopId2 = this.childData2.id
      this.shopNameValue2 = this.childData2.shopName
      this.shopNameDialog2 = false
      this.selectedInfo2 = ''
    }

    /**
     * 药店评价信息
     */
    shopIdOfShopAppraise = ''
    buyerNameOfShopAppraise = ''
    dateOfShopAppraise = ''
    shopAppraiseStartDate = ''
    shopAppraiseEndDate = ''

    optionData= {
      border: true
    }

    shopAppraiseColumn = [
      {
        title: '药店名称',
        key: 'shopName',
        width: 200
      },
      {
        title: '买家姓名',
        key: 'accountName'
      },
      {
        title: '配送评分',
        key: 'deliveryScore'
      },
      {
        title: '服务态度',
        key: 'serviceScore'
      },
      {
        title: '描述相符',
        key: 'content'
      },
      {
        title: '包装评分',
        key: 'packageScore'
      },
      {
        title: '评价时间',
        key: 'appraiseDate',
        width: 200
      }
    ];

    shopAppraiseList = [];

    shopAppraisePagination = {
      currentPage: 1,
      pageSize: 15,
      total: 0
    };

    shopRowHandle = {
      remove: {
        text: '删除',
        type: 'text'
      }
    };

    pageChangeOfShopAppraise (page) {
      this.shopAppraisePagination.currentPage = page
      this.getShopAppraises()
    }

    // 清空
    clearShopCondition () {
      this.shopNameValue = ''
      this.buyerNameOfShopAppraise = ''
      this.dateOfShopAppraise = ''
      this.shopAppraiseStartDate = ''
      this.shopAppraiseEndDate = ''
      this.getShopAppraises()
    }

    // 删除
    async removeShopAppraise ({ index, row }, done) {
      await axios.delete(`/api/supervise/shopAppraises/${row.id}`)
      this.shopAppraisePagination.total -= 1
      setTimeout(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        done()
      }, 300)
    }

    convertDate () {
      if (this.dateOfShopAppraise) {
        for (let i = 0, len = this.dateOfShopAppraise.length; i < len; i++) {
          this.dateOfShopAppraise[i] = moment(this.dateOfShopAppraise[i]).format('YYYY-MM-DD')
        }
        this.shopAppraiseStartDate = this.dateOfShopAppraise[0] + ' 00:00:00'
        this.shopAppraiseEndDate = this.dateOfShopAppraise[1] + ' 23:59:59'
      }
    }

    // 搜索
    searchShopAppraise () {
      this.convertDate()
      this.getShopAppraises()
    }

    // 获取所有药店评价信息
    async getShopAppraises () {
      let params = {
        pageNum: this.shopAppraisePagination.currentPage,
        pageSize: this.shopAppraisePagination.pageSize,
        shopId: this.shopId,
        buyerName: this.buyerNameOfShopAppraise.trim(),
        startDate: this.shopAppraiseStartDate,
        endDate: this.shopAppraiseEndDate
      }

      let {data: shopRes} = await axios.get(`/api/supervise/shopAppraises`, {params})
      console.log(shopRes)

      this.shopAppraiseList = shopRes.list
      this.shopAppraisePagination.total = shopRes.total

      this.shopAppraiseList.forEach(item => {
        item.appraiseDate = moment(item.appraiseDate).format('YYYY-MM-DD HH:mm:ss')
      })
    }

    /**
     * 药品评价信息
     */

    shopIdOfDrugAppraise = ''
    buyerNameOfDrugAppraise = ''
    drugNameValue = ''
    dateOfDrugAppraise = ''
    drugAppraiseStartDate = ''
    drugAppraiseEndDate = ''

    drugAppraiseColumn = [
      {
        title: '药房名称',
        key: 'shopName',
        width: 200
      },
      {
        title: '药品名称',
        key: 'drugName',
        width: 200
      },
      {
        title: '药品规格',
        key: 'spec',
        width: 230
      },
      {
        title: '买家姓名',
        key: 'buyerName'
      },
      {
        title: '药品评分',
        key: 'score'
      },
      {
        title: '评价内容',
        key: 'content',
        width: 250
      },
      {
        title: '评论时间',
        key: 'appraiseDate',
        width: 200
      }
    ];

    drugAppraiseList = [];

    loading = false;
    drugAppraisePagination = {
      currentPage: 1,
      pageSize: 15,
      total: 0
    };

    drugRowHandle = {
      width: 180,
      custom: [
        {
          text: '查看详情',
          type: 'text',
          class: 'viewBtn',
          emit: 'viewDetail-emit'
        }
      ],
      remove: {
        text: '删除',
        type: 'text'
      }
    };

    pageChangeOfDrugAppraise (page) {
      this.drugAppraisePagination.currentPage = page
      this.getDrugAppraises()
    }

    // 清空
    clearDrugCondition () {
      this.shopIdOfDrugAppraise = ''
      this.buyerNameOfDrugAppraise = ''
      this.drugNameValue = ''
      this.dateOfDrugAppraise = ''
      this.drugAppraiseStartDate = ''
      this.drugAppraiseEndDate = ''
      this.shopNameValue2 = ''
      this.getDrugAppraises()
    }

    // 搜索
    searchDrugAppraise () {
      if (this.dateOfDrugAppraise) {
        for (let i = 0, len = this.dateOfDrugAppraise.length; i < len; i++) {
          this.dateOfDrugAppraise[i] = moment(this.dateOfDrugAppraise[i]).format('YYYY-MM-DD')
        }
        this.drugAppraiseStartDate = this.dateOfDrugAppraise[0] + ' 00:00:00'
        this.drugAppraiseEndDate = this.dateOfDrugAppraise[1] + ' 23:59:59'
      }
      this.getDrugAppraises()
    }

    // 删除
    async removeDrugAppraise ({ index, row }, done) {
      await axios.delete(`/api/supervise/drugAppraises/${row.id}`)
      this.drugAppraisePagination.total -= 1
      setTimeout(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        done()
      }, 300)
    }

    // 获取所有药品评价信息
    async getDrugAppraises () {
      let params = {
        pageNum: this.drugAppraisePagination.currentPage,
        pageSize: this.drugAppraisePagination.pageSize,
        shopId: this.shopId2,
        drugName: this.drugNameValue.trim(),
        buyerName: this.buyerNameOfDrugAppraise.trim(),
        startDate: this.drugAppraiseStartDate,
        endDate: this.drugAppraiseEndDate
      }

      let {data: drugRes} = await axios.get(`/api/supervise/drugAppraises`, {params})
      console.log(drugRes)

      this.drugAppraiseList = drugRes.list
      this.drugAppraisePagination.total = drugRes.total

      this.drugAppraiseList.forEach(item => {
        item.appraiseDate = moment(item.appraiseDate).format('YYYY-MM-DD HH:mm:ss')
      })
    }

    // 查看详情处理方法
    viewDetail ({row}) {
      this.$router.push({
        path: '/order/appraise/detail',
        query: {
          id: row.id
        }
      })
    }

    mounted () {
      this.getShopAppraises()
      this.getDrugAppraises()
    }
  }
</script>

<style lang="scss">
  .select-btn{
    text-align: left;
    font-size: 14px;
    width: 100%;
    height: 32px;
  }
  .appraise-wrap{
    padding: 0 10px;
    margin-bottom: 30px;

    .el-table {
      th {
        background-color: #F4F4F4;
        color: #555;
      }
    }

    .appraise{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .el-select{
        width: 100%;
      }

      .drug-appraise__list{
        .el-table__row{
          .el-table_2_column_14{
            .cell{
              width: 250px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .cell{
          button:last-child:before{
            content: '|';
            color: #EEE;
            position: relative;
            left: -6px;
            top: -1px;
          }
        }
      }
    }
  }
</style>
