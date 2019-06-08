<template>
  <div class="drug--content">
    <div class="drug--content__search">
      <el-select size="small" v-model="shopValue" filterable placeholder="药房名称">
        <el-option
          v-for="(item, index) in shopNameList"
          :key="index"
          :label="item.shopName"
          :value="item">
        </el-option>
      </el-select>
      <el-input v-model="drugNameValue" size="small" placeholder="药品名称" style="width: 160px;"></el-input>
      <el-input v-model="companyNameValue" size="small" placeholder="厂商简称" style="width: 160px;"></el-input>
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
        :options="options"
        :columns="columns"
        :data="drugList"
        :loading="loading"
        :pagination="pagination"
        @pagination-current-change="paginationCurrentChange"
        selection-row
        :selection-row="selectionRow"
        @selection-change="handleSelectionChange"
        class="drug-table"
      />
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import axios from 'axios'

  @Component
  export default class Drug extends Vue {
    shopValue = ''
    drugNameValue = ''
    companyNameValue = ''
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
        key: 'spec',
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
    shopNameList = [] // 药店名称

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
    selectionRow = {
      align: 'center'
    }

    // 获取所有药店名称选项
    async getShopNames () {
      let {data: options} = await axios.get(`/api/supervise/shops`)
      this.shopNameList = options.list
    }

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getAllDrugs()
    }

    handleDetailEvent ({row}) {
      this.$router.push({
        path: '/drugCheck/drug/detail',
        query: {
          id: row.id
        }
      })
    }

    clear () {
      this.shopValue = ''
      this.drugNameValue = ''
      this.companyNameValue = ''
      this.drugState = ''
    }

    search () {
      this.getAllDrugs()
    }

    // 多选
    handleSelectionChange (selection) {
      if (selection.length > 10) {
        this.$alert('最多选择10种药品', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$emit('listenToChildEvent', selection)
    }

    async getAllDrugs () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        company: this.companyNameValue.trim(),
        grounding: this.drugState,
        shop: this.shopValue.shopName,
        shopId: this.shopValue.id,
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
      this.getShopNames()
    }
  }
</script>

<style scoped lang="scss">
  .drug--content{
    padding: 0 10px;
    &__search{
      display: flex;
      justify-content: Flex-start;
      align-items: center;
      .el-input{
        margin-right: 10px;
        width: 160px;
      }
      .el-select{
        margin-right: 10px;
        width: 160px;
      }
    }
  }
  /deep/.drug-table{
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
