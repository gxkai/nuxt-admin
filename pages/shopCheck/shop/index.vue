<template>
  <div class="shop-wrap">
    <div class="shop-list">
      <bread-crumb :path="$route.path"/>
      <div class="shop-search">
        <!--请选择药房名称-->
        <el-button class="select-btn" v-if="shopNameValue" size="small" @click="shopNameDialog = true">{{ shopNameValue }}</el-button>
        <el-button class="select-btn" v-else type="small" @click="shopNameDialog = true" style="color: #C0C4CC">药房名称</el-button>
        <!--请选择法人姓名-->
        <el-button class="select-btn" v-if="legalName" type="small" @click="legalNameDialog = true">{{ legalName }}</el-button>
        <el-button class="select-btn" v-else type="small" @click="legalNameDialog = true" style="color: #C0C4CC">法人姓名</el-button>
        <el-select size="small" v-model="drugState" placeholder="选择状态">
          <el-option
            v-for="item in stateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="small" @click="search">搜索</el-button>
        <el-button size="small" @click="clear">清空</el-button>
      </div>

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

      <!--选择法人姓名-->
      <el-dialog
        title="法人姓名"
        :close-on-click-modal='isCloseOnClickModal'
        :visible.sync="legalNameDialog"
        width="50%">
        <legalName v-on:listenToChildEvent="getSelectedInfo"></legalName>
        <span slot="footer" class="dialog-footer">
            <el-button @click="legalNameDialog = false">取 消</el-button>
            <el-button type="primary" @click="confirmSelectLegal">确 定</el-button>
          </span>
      </el-dialog>

      <d2-crud
        :columns="columns"
        :data="shopData"
        :loading="loading"
        :pagination="pagination"
        :options="options"
        :rowHandle="rowHandle"
        @emit-check="handleCheckEvent"
        @emit-detail="handleDetailEvent"
        @emit-run="handleRunEvent"
        @emit-stop="handleStopEvent"
        @pagination-current-change="paginationCurrentChange"
        class="drug-table"
       />

  </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import ShopName from '@/components/shop/ShopName'
  import LegalName from '@/components/shop/LegalName'
  import axios from 'axios'
  @Component({
    components: {
      BreadCrumb,
      ShopName,
      LegalName
    }
  })
  export default class Shop extends Vue {
    // 药房弹窗
    isCloseOnClickModal = false
    shopNameDialog = false
    shopNameValue = ''
    shopId = ''

    // 下拉弹框
    selectedInfo = '' // 子组件传过来的数据
    childData = [] // 暂存已选的数据
    // 法人
    legalName = ''
    legalNameDialog = false

    drugState = ''
    columns = [
      {
        title: '药房名称',
        key: 'shopName'
      },
      {
        title: '法人姓名',
        key: 'legal'
      },
      {
        title: '身份证号',
        key: 'identityNumber'
      },
      {
        title: '经营地址',
        key: 'address'
      },
      {
        title: '手机号码',
        key: 'username'
      },
      {
        title: '当前状态',
        key: 'state'
      }
    ]
    shopData = []
    // shopOptions = []
    // arr = []
    // legalOptions = []
    stateOptions = [
      {
        value: 'NORMAL',
        label: '正常'
      },
      {
        value: 'REST',
        label: '停业'
      },
      {
        value: 'TO_CHECK',
        label: '待审核'
      },
      {
        value: 'NO_PASS',
        label: '未通过'
      },
      {
        value: 'VIOLATION',
        label: '违规'
      }
    ]
    loading = false
    pagination= {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options = {
      border: true
    }
    rowHandle = {
      custom: [
        {
          text: '审核',
          type: 'text',
          emit: 'emit-check',
          show (index, row) {
            if (row.state === '待审核') {
              return true
            }
          }
        },
        {
          text: '查看',
          type: 'text',
          emit: 'emit-detail'
          // show (index, row) {
          //   if (row.state === '正常' || row.state === '未通过' || row.state === '待审核' || row.state === '停业' || row.state === '违规') {
          //     return true
          //   }
          // }
        },
        {
          text: '开业',
          type: 'text',
          emit: 'emit-run',
          show (index, row) {
            if (row.state === '停业') {
              return true
            }
          }
        },
        {
          text: '停业',
          type: 'text',
          emit: 'emit-stop',
          show (index, row) {
            if (row.state === '正常') {
              return true
            }
          }
        }
      ]
    }
    beforeMount () {
      this.getShopData()
    }
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getShopData()
      // this.search()
    }
    async getShopData () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        shopName: this.shopNameValue,
        legal: this.legalName,
        shopId: this.shopId,
        state: this.drugState
      }
      let data = await axios.get(`/api/supervise/shops`, {params: params})
      console.log(data)
      this.shopData = data.data.list
      this.pagination.total = data.data.total
      this.shopData.forEach((item) => {
        item.state = this.convertStatus(item.state)
      })
    }

    // 状态转换
    convertStatus (status) {
      switch (status) {
        case 'NORMAL':
          return '正常'
        case 'REST':
          return '停业'
        case 'VIOLATION':
          return '违规'
        case 'TO_CHECK':
          return '待审核'
        case 'NO_PASS':
          return '未通过'
      }
    }

    handleCheckEvent ({index, row}) {
      this.$router.push({
        path: '/shopCheck/shop/check',
        query: {
          id: row.id
        }
      })
    }

    // 获取已选信息
    getSelectedInfo (data) {
      this.selectedInfo = data
      console.log(this.selectedInfo)
    }
    // 获取药店名称
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
    // 获取法人姓名
    confirmSelectLegal () {
      if (!this.selectedInfo) {
        this.legalNameDialog = false
        return
      }
      this.childData = this.selectedInfo
      this.legalName = this.childData.name
      this.legalNameDialog = false
      this.selectedInfo = ''
    }

    async handleStopEvent ({index, row}) {
      await axios.post(`/api/supervise/shops/${row.id}/?state=REST`)
      this.getShopData()
    }
    async handleRunEvent ({index, row}) {
      await axios.post(`/api/supervise/shops/${row.id}/?state=NORMAL`)
      this.getShopData()
    }
    handleDetailEvent ({index, row}) {
      this.$router.push({
        path: '/shopCheck/shop/detail',
        query: {
          id: row.id
        }
      })
    }
    clear () {
      this.shopNameValue = ''
      this.legalName = ''
      this.drugState = ''
      this.getShopData()
    }
    async search () {
      this.getShopData()
    }
  }
</script>

<style lang="scss" scoped>

  .shop {
    &-wrap {
      padding: 0 10px;
      margin-bottom: 30px;
    }

    &-list {
      min-height: 850px;
      padding: 10px;
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #E9E9E9;
    }
  }

.select-btn{
  margin-right: 10px;
  margin-left: 0;
  text-align: left;
  font-size: 14px;
  width: 200px;
}
.shop-search{
  display: flex;
  justify-content: Flex-start;
  align-items: center;
  border-bottom: 1px solid #e9e9e9;
  padding-bottom: 15px;

  .el-input{
    margin-right: 10px;
    width: 160px;
  }
  .el-select{
    margin-right: 10px;
    width: 160px;
  }
}
/deep/.drug-table {
  margin-top: 15px;
  .d2-crud-body {
    padding: 0  10px!important;
    .el-table {
      th {
        background-color: #F4F4F4 !important;
        color: #555 !important;

        .shop--check__wrap {
          padding: 0 10px;
          margin-bottom: 30px;

          .main-wrap {
            min-height: 850px;
            background: #FFF;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #E9E9E9;

            .shop-search {
              display: flex;
              justify-content: Flex-start;
              align-items: center;
              border-bottom: 1px solid #e9e9e9;
              padding-bottom: 15px;
              padding-left: 10px;

              .el-input {
                margin-right: 10px;
                width: 160px;
              }
              .el-select {
                margin-right: 10px;
                width: 160px;
              }
            }
          }
        }
      }
    }
  }
  /*/deep/ .drug-table {*/
    /*margin-top: 15px;*/
    /*.d2-crud-body {*/
      /*padding: 0 10px !important;*/
      /*.el-table {*/
        /*th.is-leaf {*/
          /*background-color: #F4F4F4 !important;*/
          /*color: #555 !important;*/
        /*}*/
        /*td {*/
          /*.cell {*/
            /*/deep/ .el-button + .el-button {*/
              /*margin-left: 5px;*/
              /*&::before {*/
                /*content: '|';*/
                /*padding-right: 5px;*/
                /*color: #eee;*/
              /*}*/
            /*}*/
          /*}*/
        /*}*/
      /*}*/
    /*}*/
  /*}*/
}
</style>
