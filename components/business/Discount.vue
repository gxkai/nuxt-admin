<template>
  <div class="discount-wrap">
    <div class="discount">
      <bread-crumb :path="$route.path"/>

      <div class="filter">
        <el-row :gutter="20" class="filter-top">
          <el-col :span="8">
            <span class="tit">药店名称：</span>
            <!--请选择药房名称-->
            <el-button class="select-btn value-btn" v-if="shopNameValue" type="small" @click="shopNameDialog = true">{{ shopNameValue }}</el-button>
            <el-button class="select-btn" v-else type="small" @click="shopNameDialog = true">药店名称</el-button>
          </el-col>
          <el-col :span="8">
            <span class="tit">药品名称：</span>
            <el-input
              size="small"
              style="width: 250px"
              placeholder="请输入"
              v-model="drugName">
            </el-input>
          </el-col>
          <el-col :span="8" class="produce-col">
            <span class="tit">生产厂商：</span>
            <el-button class="select-btn value-btn" v-if="originNameValue" type="small" @click="originDialogVisible = true">{{ originNameValue }}</el-button>
            <el-button class="select-btn" v-else type="small" @click="originDialogVisible = true">生产厂商</el-button>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="filter-bottom">
          <el-col :span="8" class="status-col">
            <span class="tit">当前状态：</span>
            <el-select v-model="stateValue" size="small" filterable placeholder="请选择" style="width: 250px">
              <el-option
                v-for="(item, index) in currentStateList"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <span class="tit">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;时间：</span>
            <el-date-picker
              size="small"
              :clearable="disClearable"
              style="width: 250px"
              v-model="dateValue"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="convertDate">
            </el-date-picker>
          </el-col>
          <el-col :span="5" class="action-col">
            <el-button size="small" @click="clearConditions">清空</el-button>
            <el-button type="primary" size="small" @click="searchDiscountDrugs">搜索</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="list">
        <el-table
          :data="perPageData"
          border
          style="width: 100%">
          <el-table-column
            width="50px"
            label="序号">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            width="200px"
            prop="shopName"
            label="药店名称">
          </el-table-column>
          <el-table-column
            width="200px"
            prop="drugName"
            label="药品名称">
          </el-table-column>
          <el-table-column
            width="220px"
            prop="specName"
            label="药品规格">
          </el-table-column>
          <el-table-column
            width="220px"
            prop="originName"
            label="生产厂商">
          </el-table-column>
          <el-table-column
            width="50px"
            prop="sales"
            label="销量">
          </el-table-column>
          <el-table-column
            width="80px"
            prop="price"
            label="销售价">
          </el-table-column>
          <el-table-column
            width="170px"
            prop="applyDate"
            label="申请日期">
          </el-table-column>
          <el-table-column
            width="170px"
            prop="startDate"
            label="展示开始时间">
          </el-table-column>
          <el-table-column
            width="170px"
            prop="endDate"
            label="展示结束时间">
          </el-table-column>
          <el-table-column label="当前状态">
            <template slot-scope="scope">
              <span>{{ $t(scope.row.applyState) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button @click="viewDetail(scope.$index, scope.row)" type="text">查看</el-button>

              <el-dropdown trigger="click"  v-if="scope.row.applyState==='PENDING'">
                <span class="el-dropdown-link">
                  更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button type="text" @click="passAction(scope.$index, scope.row.id)">通过</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button type="text" @click="failAction(scope.$index, scope.row.id)">不通过</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <el-button type="text" v-show="!scope.row.deleted" @click="obtained(scope.row)" v-if="scope.row.applyState==='SUCCESS'">下架</el-button>
              <el-button type="text" v-show="scope.row.deleted" v-if="scope.row.applyState==='SUCCESS'" style="color: #999;">已下架</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper, total"
            :total="totalPages">
          </el-pagination>
        </div>
      </div>

      <!-- 查看模态框 -->
      <el-dialog
        title="查看"
        :visible.sync="viewDialogVisible"
        width="30%"
        :close-on-click-modal = 'isClickModal'>
        <div class="main">
          <el-form :model="viewData" label-width="100px">
            <el-form-item label="序号">
              <el-input :value="viewData.index" placeholder="暂无"></el-input>
            </el-form-item>
            <el-form-item label="药店名称">
              <el-input :value="viewData.shopName" placeholder="暂无"></el-input>
            </el-form-item>
            <el-form-item label="药品规格">
              <el-input :value="viewData.specName" placeholder="暂无"></el-input>
            </el-form-item>
            <el-form-item label="生产厂商">
              <el-input :value="viewData.originName" placeholder="暂无"></el-input>
            </el-form-item>
            <el-form-item label="销量">
              <el-input :value="viewData.sales" placeholder="暂无"></el-input>
            </el-form-item>
            <el-form-item label="销售价">
              <el-input :value="viewData.price" placeholder="暂无"></el-input>
            </el-form-item>
            <el-form-item label="申请日期">
              <el-input :value="viewData.applyDate" placeholder="暂无"></el-input>
            </el-form-item>
            <el-form-item label="展示开始时间">
              <el-input :value="viewData.startDate" placeholder="暂无"></el-input>
            </el-form-item>
            <el-form-item label="展示结束时间">
              <el-input :value="viewData.endDate" placeholder="暂无"></el-input>
            </el-form-item>
            <el-form-item label="当前状态">
              <el-input :value="$t(viewData.applyState)" placeholder="暂无"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="viewDialogVisible = false" type="primary">关 闭</el-button>
        </div>
      </el-dialog>

      <!--不通过原因-->
      <el-dialog
        title="不通过原因"
        :visible.sync="failDialogVisible"
        width="30%"
        :close-on-click-modal='isClickModal'>
        <div class="reason">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入不通过原因"
            v-model="failReason">
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="failCancel">取 消</el-button>
          <el-button type="primary" @click="failConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <!--选择药房名称-->
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

      <!--选择厂商-->
      <el-dialog
        title="厂商"
        :close-on-click-modal='isCloseOnClickModal'
        :visible.sync="originDialogVisible"
        width="50%">
        <drug-origin v-on:listenToChildEvent="getSelectedInfo"></drug-origin>
        <span slot="footer" class="dialog-footer">
          <el-button @click="originDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmSelectOrigin">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import ShopName from '@/components/shop/ShopName'
  import Origin from '@/components/drugCheck/Origin'
  import axios from 'axios'
  import moment from 'moment'

  @Component({
    components: {
      BreadCrumb,
      ShopName,
      'drug-origin': Origin
    }
  })
  export default class Discount extends Vue {
    // 弹窗
    selectedInfo = '' // 子组件传过来的数据
    childData = [] // 暂存已选的数据
    // 药房
    isCloseOnClickModal = false
    shopNameDialog = false
    shopNameId = ''
    shopNameValue = '' // 药店信息
    originDialogVisible = false

    disClearable = false
    drugName = ''; // 药品名称
    originNameValue = ''; // 生产厂商
    stateValue = '' // 状态值
    dateValue = ''; // 日期区间
    startDate = '' // 起始日期
    endDate = '' // 截止日期

    currentStateList = [
      {
        id: 'SUCCESS',
        name: '通过'
      },
      {
        id: 'FAIL',
        name: '不通过'
      },
      {
        id: 'PENDING',
        name: '待审核'
      }
    ]

    tableData = []; // 促销药品数据
    perPageData = []; // 存储每页显示的数据

    currentPage = 1; // 当前页
    pageSize = 15; // 每页显示条数
    totalPages = 0

    // 获取已选信息
    getSelectedInfo (data) {
      this.selectedInfo = data
    }

    // 获取药店名称
    confirmSelect () {
      if (!this.selectedInfo) {
        this.shopNameDialog = false
        return
      }
      this.childData = this.selectedInfo
      this.shopNameId = this.childData.id
      this.shopNameValue = this.childData.shopName
      this.shopNameDialog = false
    }

    // 选择厂商
    confirmSelectOrigin () {
      if (!this.selectedInfo) {
        this.originDialogVisible = false
        return
      }
      this.childData = this.selectedInfo
      this.originNameValue = this.childData.fullName
      this.originDialogVisible = false
    }

    // 清空
    clearConditions () {
      this.shopNameID = ''
      this.shopNameValue = ''
      this.drugName = ''
      this.produceValue = ''
      this.stateValue = ''
      this.dateValue = ''
      this.startDate = ''
      this.endDate = ''
    }

    // 下架
    async obtained (row) {
      console.log(row)
      let params = {
        shopDrugId: row.shopDrugId,
        deleted: row.deleted
      }
      let moveRes = await axios.post(`/api/supervise/drugDiscountApplies/grounding?shopDrugId=${row.shopDrugId}`, params)
      if (moveRes) {
        this.$message({
          message: '该药品下架成功！',
          type: 'success'
        })
      }
      this.getDiscounts()
    }

    // 查看
    viewDialogVisible = false;
    isClickModal = false
    viewData = {};

    viewDetail (index, row) {
      this.viewDialogVisible = true
      this.viewData.index = index + 1
      this.viewData.shopName = row.shopName
      this.viewData.drugName = row.drugName
      this.viewData.specName = row.specName
      this.viewData.originName = row.originName
      this.viewData.sales = row.sales
      this.viewData.price = row.price
      this.viewData.applyDate = row.applyDate
      this.viewData.startDate = row.startDate
      this.viewData.endDate = row.endDate
      this.viewData.applyState = row.applyState
    }

    // 通过
    async passAction (index, id) {
      let applyState = 'SUCCESS'
      await axios.put(`/api/supervise/drugDiscountApplies/${id}?applyState=${applyState}`)
      this.perPageData[index].applyState = applyState
      this.$message({
        message: '审核通过',
        type: 'success'
      })
    }

    // 不通过原因
    failReason = '';
    failDialogVisible = false;
    failIndex = ''
    failId = ''
    failAction (index, id) {
      this.failDialogVisible = true
      this.failIndex = index
      this.failId = id
    }

    failCancel () {
      this.failReason = ''
      this.failDialogVisible = false
    }

    async failConfirm () {
      let applyState = 'FAIL'

      if (!this.failReason) {
        this.$message({
          message: '请填写不通过原因',
          type: 'warning'
        })
        return
      }
      let params = {
        remark: this.failReason
      }
      await axios.put(`/api/supervise/drugDiscountApplies/${this.failId}?applyState=${applyState}`, params)
      this.perPageData[this.failIndex].applyState = applyState
      this.$message({
        message: '审核不通过',
        type: 'success'
      })
      this.failReason = ''
      this.failDialogVisible = false
    }

    handleCurrentChange (page) {
      this.currentPage = page
      this.getDiscounts()
    }

    // 获取每页数据
    getPerData () {
      this.perPageData = this.tableData
      this.perPageData = this.perPageData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }

    convertDate () {
      if (this.dateValue) {
        for (let i = 0, len = this.dateValue.length; i < len; i++) {
          this.dateValue[i] = moment(this.dateValue[i]).format('YYYY-MM-DD')
        }
        this.startDate = this.dateValue[0] + ' 00:00:00'
        this.endDate = this.dateValue[1] + ' 23:59:59'
      }
    }

    // 搜索
    searchDiscountDrugs () {
      this.getDiscounts()
    }

    async getDiscounts () {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        shopId: this.shopNameID,
        shopName: this.shopNameValue,
        originName: this.originNameValue,
        drugName: this.drugName.trim(),
        state: this.stateValue,
        startDate: this.startDate,
        endDate: this.endDate
      }
      let {data: res} = await axios.get(`/api/supervise/drugDiscountApplies`, {params})
      // console.log(res)
      this.tableData = res.list
      this.totalPages = res.total

      this.tableData.forEach((item, index) => {
        item.applyDate = moment(item.applyDate).format('YYYY-MM-DD HH:mm:ss')
        item.startDate = moment(item.startDate).format('YYYY-MM-DD HH:mm:ss')
        item.endDate = moment(item.endDate).format('YYYY-MM-DD HH:mm:ss')
      })

      this.getPerData()
    }

    beforeMount () {
      this.getDiscounts()
    }
  }
</script>

<style lang="scss">
  .discount-wrap{
    padding: 0 10px;
    margin-bottom: 30px;

    .discount{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .select-btn{
        width: 250px;
        color: #C0C4CC;
        text-align: left;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .value-btn{
        color: #606266;
      }

      .el-dialog__body{
        padding: 20px;
        border:{
          top: 1px solid #e9e9e9;
          bottom: 1px solid #e9e9e9;
        }
      }

      textarea{
        border: none;
        outline: none;
        resize: none;
        font-size: 15px;
        color: #949494;
      }

      .filter{
        padding: 0 20px 20px;
        margin-bottom: 15px;
        text-align: center;
        border-bottom: 1px solid #E9E9E9;

        span.tit{
          font-size: 15px;
        }

        &-top{
          margin: 20px 0;
        }
      }

      .list {
        padding: 0 10px;

        .el-table{
          th{
            background-color: #F4F4F4;
            color: #555;
          }
          &__body {
            td{
              padding: 6px 0;
            }
          }
        }

        .pagination{
          margin: 30px 0;
          .el-pagination__total{
            float: right;
          }
        }
      }

      .cell{
        .el-button{
          font-size: 13px;
          &+.el-button{
            &:before{
              /*content: '|';*/
              /*color: #EEE;*/
            }
          }
        }

        .el-dropdown{
          font-size: 12px;
          color: #409eff;

          &:before{
            content: '|';
            color: #EEE;
            position: relative;
            left: -4px;
            top: -1px;
          }

          &-link{
            cursor: pointer;
            font-size: 13px;
          }

          .el-icon--right{
            margin-left: 0;
            color: #409eff;
          }
        }

        .show{
          display: inline-block !important;
        }
      }
    }
  }



  .el-dropdown-menu {
    overflow: hidden;
    &__item {
      text-align: center;
      .el-button--text {
        color: #606266;
        font-size: 13px;
      }
    }
  }
</style>
