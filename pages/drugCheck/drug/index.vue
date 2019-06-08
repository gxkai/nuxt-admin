<template>
  <div class="drug--wrap">
    <div class="drug--content">
      <bread-crumb :path="$route.path"/>
      <div class="drug--content__search">
        <!--请选择药房名称-->
        <el-button class="select-btn value-btn" v-if="shopNameValue" type="small" @click="shopNameDialog = true">{{ shopNameValue }}</el-button>
        <el-button class="select-btn" v-else type="small" @click="shopNameDialog = true">药店名称</el-button>

        <el-input v-model="drugNameValue" size="small" placeholder="药品名称" style="width: 200px;"></el-input>
        <el-button class="select-btn value-btn" size="small" v-if="originNameValue" @click="originDialogVisible = true">{{ originNameValue }}</el-button>
        <el-button class="select-btn" size="small" v-else @click="originDialogVisible = true">厂商简称</el-button>
        <el-select size="small" v-model="drugState" placeholder="药品状态">
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
      <div>
        <d2-crud
          :columns="columns"
          :data="drugList"
          :loading="loading"
          :pagination="pagination"
          @pagination-current-change="paginationCurrentChange"
          :options="options"
          :rowHandle="rowHandle"
          @emit-detail="handleDetailEvent"
          class="drug-table"
        />
      </div>
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
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import ShopName from '@/components/shop/ShopName'
  import Origin from '@/components/drugCheck/Origin'
  import axios from 'axios'

  @Component({
    components: {
      BreadCrumb,
      ShopName,
      'drug-origin': Origin
    }
  })
  export default class Drug extends Vue {
    isCloseOnClickModal = false
    originDialogVisible = false
    shopNameDialog = false
    shopNameId = ''
    shopNameValue = '' // 药店信息
    drugNameValue = ''
    originNameValue = ''
    drugState = ''
    columns= [
      {
        title: '药店名称',
        key: 'shopName',
        width: '220'
      },
      {
        title: '药品名称',
        key: 'drugName',
        width: '220'
      },
      {
        title: '通用名称',
        key: 'commonName',
        width: '220'
      },
      {
        title: '规格',
        key: 'specName',
        width: '250'
      },
      {
        title: '厂商简称',
        key: 'originName',
        width: '250'
      },
      {
        title: '价格',
        key: 'price',
        width: '60'
      },
      {
        title: '库存',
        key: 'stock',
        width: '60'
      },
      {
        title: '药品状态',
        key: 'transGrounding',
        width: '100'
      }
    ]
    drugList = []
    selectedInfo = '' // 子组件传过来的数据
    childData = [] // 暂存已选的数据

    // 药品状态
    stateOptions = [
      {
        value: true,
        label: '上架'
      },
      {
        value: false,
        label: '下架'
      }
    ]

    loading= false;
    pagination= {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options= {
      border: true
    }
    rowHandle = {
      custom: [
        {
          text: '查看详情',
          type: 'text',
          emit: 'emit-detail'
        }
      ]
    }

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

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getAllDrugs()
    }

    handleDetailEvent ({row}) {
      console.log(row)
      this.$router.push({
        path: '/drugCheck/drug/detail',
        query: {
          id: row.shopDrugId
        }
      })
    }

    clear () {
      this.shopNameId = ''
      this.shopNameValue = '' // 药店信息
      this.drugNameValue = ''
      this.originNameValue = ''
      this.drugState = ''
    }

    search () {
      this.getAllDrugs()
    }

    async getAllDrugs () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        company: this.originNameValue.trim(),
        grounding: this.drugState,
        shop: this.shopNameValue,
        shopId: this.shopNameId,
        name: this.drugNameValue.trim()
      }

      let {data: drugData} = await axios.get(`/api/supervise/shopDrugs`, {params})
      console.log(drugData)
      this.drugList = drugData.list
      this.pagination.total = drugData.total

      this.drugList.forEach(item => {
        if (item.grounding) {
          item.transGrounding = '上架'
        } else {
          item.transGrounding = '下架'
        }
      })
    }

    beforeMount () {
      this.getAllDrugs()
    }
  }
</script>

<style scoped lang="scss">
  .drug{
    &--wrap{
      padding: 0 10px;
      margin-bottom: 30px;
    }
    &--content{
      min-height: 850px;
      padding: 10px;
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      &__search{
        display: flex;
        align-items: center;
        justify-content: Flex-start;
        border-bottom: 1px solid #e9e9e9;
        padding-bottom: 15px;
        padding-left: 10px;

        .select-btn{
          width: 200px;
          height: 32px;
          line-height: inherit;
          margin-right: 10px;
          color: #c0c4cc;
          text-align: left;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .value-btn{
          color: #606266;
        }

        .el-input{
          margin-right: 10px;
          width: 200px;
        }
        .el-select{
          margin-right: 10px;
          width: 200px;
        }
      }
    }
  }
  /deep/.drug-table{
    padding: 0 10px;
    .el-table{
      th{
        background-color: #F4F4F4 !important;
        color: #555 !important;
      }
      td{
        .cell{
          /deep/.el-button+.el-button{
            margin-left: 5px;
            &::before{
              content: '|';
              padding-right: 5px;
              color: #eee;
            }
          }
        }
      }
    }
  }
</style>
