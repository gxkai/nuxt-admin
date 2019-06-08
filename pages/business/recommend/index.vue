<template>
  <div class="recommend">
    <div class="recommend-wrap">
      <bread-crumb :path="$route.path"/>
      <div class="recommend-wrap__search">
        <el-input v-model="drugName" size="small" placeholder="药品名称" style="width: 200px;"></el-input>
        <!--选择厂商-->
        <el-button class="select-btn" v-if="originName" @click="originDialogVisible = true"size="small">{{ originName }}</el-button>
        <el-button class="select-btn" v-else @click="originDialogVisible = true" style="color: #C0C4CC;" size="small">请选择厂商</el-button>
        <!--当前状态-->
        <el-select v-model="stateValue" size="small" filterable placeholder="当前状态" style="width: 200px">
          <el-option
            v-for="(item, index) in currentStateList"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-date-picker
          size="small"
          :clearable="disClearable"
          style="width: 250px;margin:0 10px"
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="convertDate">
        </el-date-picker>
        <el-button type="primary" size="small" @click="search">搜索</el-button>
        <el-button size="small" @click="clear">清空</el-button>

        <el-button type="primary" size="small" style="background:#108EE9" @click="addRecommend">添加</el-button>
        <el-button type="primary" size="small" style="background:#108EE9" @click="dialogAddVisible = true">批量添加</el-button>
      </div>

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

      <div class="recommend-wrap__list">
        <el-table :data="perPageData" border style="width: 100%">
          <el-table-column width="50px" label="序号">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>

          <el-table-column prop="drugName" label="药品名称"></el-table-column>
          <el-table-column prop="specName" label="药品规格"></el-table-column>
          <el-table-column prop="originName" label="生产厂商"></el-table-column>
          <el-table-column width="50px" prop="sales" label="销量"></el-table-column>
          <el-table-column width="65px" prop="price" label="销售价"></el-table-column>
          <el-table-column prop="applyDate" label="申请日期"></el-table-column>
          <el-table-column prop="startDate" label="展示开始时间"></el-table-column>
          <el-table-column prop="endDate"label="展示结束时间"></el-table-column>

          <el-table-column label="当前状态" width="80px">
            <template slot-scope="scope">
              <span>{{ $t(scope.row.applyState) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button type="text" @click="viewDetail(scope.$index, scope.row)">查看</el-button>

              <el-button type="text" v-if="scope.row.applyState==='SUCCESS'" @click="moveShelf(scope.$index, scope.row)">提前下架</el-button>

              <el-button type="text" v-if="scope.row.applyState==='FAIL'" @click="failReason(scope.$index, scope.row.id)">查看原因</el-button>
              <el-button type="text" v-if="scope.row.applyState==='FAIL'" @click="reSubmit(scope.$index, scope.row)">再次提交</el-button>

              <el-button type="text" v-if="scope.row.applyState==='EXPIRY'" @click="deleteItem(scope.$index, scope.row.id)">删除</el-button>
              <el-button type="text" v-if="scope.row.applyState==='EXPIRY'" @click="reSubmit(scope.$index, scope.row)">再次提交</el-button>

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

      <!--批量添加-->
      <el-dialog title="批量添加" :visible.sync="dialogAddVisible">
        <div class="notice-txt">
          <p>批量添加，帮助您快速的批量完成药品推荐，但请您严格遵守EXCEL模板完善信息，谢谢！如果没有EXCEL模板，请<a href="#" download="filename">点击下载</a>。</p>
          <strong>注：点击下载excel表，excel表中增加一行事例数据，需要商家按照要求填写就可以实现批量添加，，，，，这部分可以暂时延缓一下</strong>
        </div>
        <div class="upload-btn">
          <el-button type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
        </div>
      </el-dialog>


      <!--查看不通过原因-->
      <el-dialog title="查看不通过原因" :visible.sync="dialogFormVisible">
        <el-input
          readonly
          type="textarea"
          :rows="6"
          placeholder="暂无"
          v-model="failTextarea">
        </el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">关 闭</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import axios from 'axios'
  import moment from 'moment'
  import Origin from '@/components/drugCheck/Origin'
  @Component({
    components: {
      BreadCrumb,
      'drug-origin': Origin
    }
  })
  export default class Recommend extends Vue {
    drugName = '' // 药品名称

    // 厂商
    originName = ''
    originId = ''
    isCloseOnClickModal = false
    originDialogVisible = false
    selectedInfo = '' // 子组件传过来的数据
    childData = [] // 暂存已选的数据

    // 状态
    stateValue = ''
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
        id: 'EXPIRY',
        name: '过期'
      },
      {
        id: 'PENDING',
        name: '待审核'
      }
    ]
    dateValue = '' // 日期区间
    startDate = '' // 起始日期
    endDate = '' // 截止日期

    disClearable = false

    // 查看不通过原因
    dialogFormVisible = false
    failTextarea = ''

    // 批量添加
    dialogAddVisible = false

    convertDate () {
      if (this.dateValue) {
        for (let i = 0, len = this.dateValue.length; i < len; i++) {
          this.dateValue[i] = moment(this.dateValue[i]).format('YYYY-MM-DD')
        }
        this.startDate = this.dateValue[0] + ' 00:00:00'
        this.endDate = this.dateValue[1] + ' 23:59:59'
      }
    }

    // 添加
    addRecommend () {
      this.$router.push('/business/recommend/create')
    }

    tableData = [] // 促销药品数据
    perPageData = [] // 存储每页显示的数据

    currentPage = 1 // 当前页
    pageSize = 15 // 每页显示条数
    totalPages = 0

    handleCurrentChange (page) {
      this.currentPage = page
      this.getRecommend()
    }

    beforeMount () {
      this.getRecommend()
    }

    // 获取每页数据
    getPerData () {
      this.perPageData = this.tableData
      this.perPageData = this.perPageData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }

    async getRecommend (startDate, endDate) {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        originName: this.originName,
        drugName: this.drugName.trim(),
        state: this.stateValue,
        startDate,
        endDate
      }
      let {data: Recommend} = await axios.get(`/api/shop/drugRecommendApplies`, {params})
      console.log(Recommend)
      this.tableData = Recommend.list
      this.totalPages = Recommend.total
      this.tableData.forEach((item) => {
        item.applyDate = moment(item.applyDate).format('YYYY-MM-DD hh:mm:ss')
        item.startDate = moment(item.startDate).format('YYYY-MM-DD hh:mm:ss')
        item.endDate = moment(item.endDate).format('YYYY-MM-DD hh:mm:ss')
      })
      this.getPerData()
    }

    search () {
      this.getRecommend(this.startDate, this.endDate)
    }

    // 查看
    viewDetail (index, row) {
      this.$router.push({
        path: '/business/recommend/detail',
        query: {
          id: row.id
        }
      })
    }

    // 提前下架
    async moveShelf (index, row) {
      console.log(row)
      let params = {
        shopDrugId: row.shopDrugId
      }
      let moveRes = await axios.post(`/api/shop/drugRecommendApplies/grounding?shopDrugId=${row.shopDrugId}`, params)
      if (moveRes) {
        this.$message({
          message: '下架成功！',
          type: 'success'
        })
      }
    }

    // 查看不通过的原因
    async failReason (index, id) {
      let reasonRes = await axios.get(`/api/shop/drugRecommendApplies/${id}/remark`)
      this.failTextarea = reasonRes.data
      this.dialogFormVisible = true
    }

    // 再次提交
    reSubmit (index, row) {
      this.$router.push({
        path: '/business/recommend/edit',
        query: {
          id: row.id,
          shopName: row.shopName
        }
      })
    }

    // 删除
    async deleteItem (index, id) {
      await axios.delete(`/api/shop/drugRecommendApplies/${id}`)
    }

    // 清空
    clear () {
      this.drugName = ''
      this.originName = ''
      this.stateValue = ''
      this.dateValue = ''
      this.startDate = ''
      this.endDate = ''
      this.getRecommend()
    }

    // 获取已选信息
    getSelectedInfo (data) {
      this.selectedInfo = data
    }
    // 选择厂商
    confirmSelectOrigin () {
      if (!this.selectedInfo) {
        this.originDialogVisible = false
        return
      }
      this.childData = this.selectedInfo
      this.originId = this.childData.id
      this.originName = this.childData.fullName
      this.originDialogVisible = false
    }
    //
  }
</script>

<style lang="scss" scoped>
  .notice-txt{
    font-size: 16px;
    line-height: 1.8;
    color: #333333;
    text-align: justify;
    margin: 0 25px;
    p{
      margin-bottom: 25px;
    }
  }
  .upload-btn{
    display: flex;
    justify-content: center;
    margin-top: 25px;
  }
  /deep/.recommend{
    padding: 0 10px;
    margin-bottom: 30px;
    &-wrap{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      &__search{
        display: flex;
        align-items: center;
        border-bottom: 1px solid #EEE;
        padding:0 15px 15px 15px;
        margin-bottom: 15px;
        .select-btn{
          min-width: 200px;
          text-align: left;
          margin:0 10px
        }
      }

      &__list{
        padding: 0 15px;
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

      .cell {
        .el-button {
          font-size: 13px;
        }
        button+button {
          &:before {
            content: '|';
            color: #EEE;
            position: relative;
            left: -6px;
            top: -1px;
          }
        }

        button:first-child {
          &:before {
            display: none;
          }
        }

        .el-dropdown {
          font-size: 12px;
          color: #409eff;

          &:before {
            content: '|';
            color: #EEE;
            position: relative;
            left: -4px;
            top: -1px;
          }

          &-link {
            cursor: pointer;
            font-size: 13px;
          }

          .el-icon--right {
            margin-left: 0;
            color: #409eff;
          }
        }
      }

    }
  }
</style>


