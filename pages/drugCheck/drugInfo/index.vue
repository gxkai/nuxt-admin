<template>
  <div class="drugInfo-wrap">
    <div class="drugInfo-list">
      <bread-crumb :path="$route.path"/>
      <div class="drugInfo-search">
        <el-input v-model="drugNameValue" size="small" placeholder="请输入药品名称" style="width: 150px;"></el-input>
        <el-button class="select-btn value-btn" v-if="originNameValue" type="small" @click="originDialogVisible = true">{{ originNameValue }}</el-button>
        <el-button class="select-btn" v-else type="small" @click="originDialogVisible = true">厂商简称</el-button>
        <el-select size="small" v-model="drugState" placeholder="当前状态">
          <el-option
            v-for="item in stateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="small" @click="searchDrugInfo">搜索</el-button>
        <el-button size="small" @click="clear">清空</el-button>
      </div>
      <d2-crud
        :columns="columns"
        :data="drugInfoList"
        :loading="loading"
        :pagination="pagination"
        @pagination-current-change="paginationCurrentChange"
        :options="options"
        :rowHandle="rowHandle"
        @emit-detail="handleDetailEvent"
        @emit-check="handleCheckEvent"
        class="drug-table"
      />
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
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import Origin from '@/components/drugCheck/Origin'
  import axios from 'axios'

  @Component({
    components: {
      BreadCrumb,
      'drug-origin': Origin
    }
  })
  export default class DrugInfo extends Vue {
    drugNameValue = ''
    originNameValue = ''
    drugState = ''
    selectedInfo = '' // 子组件传过来的数据
    childData = [] // 暂存已选的数据
    isCloseOnClickModal = false
    originDialogVisible = false

    columns = [
      {
        title: '药品名称',
        key: 'drugName'
      },
      {
        title: '通用名称',
        key: 'commonName'
      },
      {
        title: '规格',
        key: 'specName'
      },
      {
        title: '厂商简称',
        key: 'originName'
      },
      {
        title: '批准文号',
        key: 'sfda'
      },
      {
        title: '当前状态',
        key: 'state'
      }
    ]
    drugInfoList = []
    loading= false;
    pagination= {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options= {
      border: true
    }
    rowHandle= {
      custom: [
        {
          text: '查看',
          type: 'text',
          emit: 'emit-detail'
        },
        {
          text: '审核',
          type: 'text',
          emit: 'emit-check',
          show (index, row) {
            if (row.curState === '待审核') {
              return true
            }
          }
        }
      ]
    }
    stateOptions = [
      {
        value: '待审核',
        label: '待审核'
      },
      {
        value: '审核通过',
        label: '审核通过'
      },
      {
        value: '审核不通过',
        label: '审核不通过'
      }
    ]

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
      this.originNameValue = this.childData.fullName
      this.originDialogVisible = false
    }

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getDrugInfo()
    }

    handleDetailEvent ({index, row}) {
      console.log(row)
      this.$router.push({
        path: '/drugCheck/drugInfo/detail',
        query: {
          id: row.id
        }
      })
    }

    handleCheckEvent () {
      this.$router.push('/drugCheck/drugInfo/check')
    }

    clear () {
      this.drugNameValue = ''
      this.originNameValue = ''
      this.drugState = ''
    }

    // 搜索
    searchDrugInfo () {
      this.getDrugInfo()
    }

    convertState (state) {
      switch (state) {
        case 'PENDING':
          return '待审核'
        case 'SUCCESS':
          return '审核通过'
        case 'FAIL':
          return '审核不通过'
      }
    }

    async getDrugInfo () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        originName: this.originNameValue.trim(),
        name: this.drugNameValue.trim(),
        state: this.drugState
      }
      let {data: drugInfo} = await axios.get(`/api/supervise/drugApplies`, {params})
      console.log(drugInfo)
      this.drugInfoList = drugInfo.list
      this.pagination.total = drugInfo.total

      this.drugInfoList.forEach(item => {
        item.state = this.convertState(item.state)
      })
    }

    mounted () {
      this.getDrugInfo()
    }
  }
</script>

<style scoped lang="scss">
  .drugInfo{
    &-wrap{
      padding: 0 10px;
      margin-bottom: 30px;
    }

    &-list{
      min-height: 850px;
      padding: 10px;
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #E9E9E9;
    }

    &-search{
      display: flex;
      justify-content: Flex-start;
      align-items: center;
      border-bottom: 1px solid #e9e9e9;
      padding-bottom: 15px;

      .select-btn{
        width: 150px;
        height: 32px;
        line-height: inherit;
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

      .el-input{
        margin: 0 5px;
      }
      .el-select{
        width: 150px;
        margin-left: 5px;
        margin-right: 10px;
      }
    }
  }

  /deep/.drug-table{
    margin-top: 15px;
    .d2-crud-body{
      padding: 0 10px !important;
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
  }
</style>
