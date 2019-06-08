<template>
  <div class="stock--wrap">
    <div class="stock--content">
      <bread-crumb :path="$route.path"/>
      <div class="stock--content__search">
        <div class="left">
          <el-input v-model="commonNameValue" size="small" placeholder="通用名称" style="width: 200px;"></el-input>
          <el-button class="select-btn value-btn" size="small" v-if="originNameValue" @click="originDialogVisible = true">{{ originNameValue }}</el-button>
          <el-button class="select-btn" size="small" v-else @click="originDialogVisible = true">厂商名称</el-button>
          <el-cascader
            size="small"
            placeholder="药品类型"
            expand-trigger="click"
            :options="compostList"
            :props="selectProps"
            v-model="selectedTypes"
            @change="getTypeCondition">
          </el-cascader>
          <el-button type="primary" size="small" icon="el-icon-refresh" @click="resetEs">重置ES</el-button>
          <el-button type="primary" size="small" @click="searchDrugs">搜索</el-button>
          <el-button size="small" @click="clearConditions">清空</el-button>
        </div>
        <div class="right">
          <el-button type="primary" @click="stockAdd" style="background: #169bd5;">新增</el-button>
        </div>
      </div>
      <d2-crud
        :columns="columns"
        :data="drugList"
        :loading="loading"
        :pagination="pagination"
        @pagination-current-change="paginationCurrentChange"
        :options="options"
        :rowHandle="rowHandle"
        @custom-edit="editDrugInfo"
        @custom-remove="removeDrug"
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
  export default class Stock extends Vue {
    commonNameValue = ''
    originNameValue = ''
    isCloseOnClickModal = false
    originDialogVisible = false

    columns= [
      {
        title: '药品名称',
        key: 'name'
      },
      {
        title: '通用名称',
        key: 'commonName'
      },
      {
        title: '规格',
        key: 'spec'
      },
      {
        title: '厂商简称',
        key: 'originName'
      },
      {
        title: '药品类型',
        key: 'drugTypeName'
      }
    ];
    drugList = []
    drugTypesList = [] // 药品类型
    compostList = [] // 组合类
    selectedTypes = [] // 所选药品类型
    selectedInfo = '' // 子组件传过来的数据
    childData = [] // 暂存已选的数据

    selectProps = {
      label: 'type',
      value: 'id',
      children: 'children'
    }

    loading = false;
    pagination = {
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
          text: '编辑',
          type: 'text',
          emit: 'custom-edit'
        },
        {
          text: '删除',
          type: 'text',
          emit: 'custom-remove'
        }
      ]
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
      this.originNameValue = this.childData.fullName
      this.originDialogVisible = false
    }

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getDrugs()
    }

    // 编辑
    editDrugInfo ({index, row}) {
      this.$router.push({
        path: '/drugCheck/stock/edit',
        query: {
          id: row.id
        }
      })
    }

    // 获取药品类型
    async getDrugTypes () {
      let {data: parentTypes} = await axios.get(`/api/supervise/drugTypes/father`)
      this.drugTypesList = parentTypes
      this.compostList = this.drugTypesList

      // 获取每个大类下的子类
      for (let i = 0, len = this.drugTypesList.length; i < len; i++) {
        let {data: childTypes} = await axios.get(`/api/supervise/drugTypes/${this.drugTypesList[i].id}/children`)
        this.compostList[i].children = childTypes
      }
    }

    // 获取药品类别条件
    getTypeCondition (data) {
      console.log(data)
      this.selectedTypes = data
    }

    // 删除
    async removeDrug ({ index, row }) {
      await axios.delete(`/api/supervise/drugs/${row.id}`)
      this.pagination.total -= 1
      this.$message({
        message: '删除成功',
        type: 'success'
      })
    }

    stockAdd () {
      this.$router.push('/drugCheck/stock/create')
    }

    async resetEs () {
      await axios.post(`/api/supervise/drugs/reset`)
      this.$message({
        message: '重置成功',
        type: 'success'
      })
    }

    clearConditions () {
      this.commonNameValue = ''
      this.originNameValue = ''
      this.selectedTypes = []
    }

    searchDrugs () {
      this.getDrugs()
    }

    async getDrugs () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        name: this.commonNameValue.trim(),
        originName: this.originNameValue.trim(),
        drugTypeParent: this.selectedTypes[0],
        drugType: this.selectedTypes[1]
      }
      let {data: drugRes} = await axios.get(`/api/supervise/drugs`, {params})
      console.log(drugRes)
      this.drugList = drugRes.list
      this.pagination.total = drugRes.total

      this.drugList.forEach(item => {
        let typeName = ''
        item.drugDrugTypeList.forEach(typeItem => {
          typeName += `${typeItem.type},`
        })
        item.drugTypeName = typeName.substring(0, typeName.length - 1)
      })
    }

    beforeMount () {
      this.getDrugs()
      this.getDrugTypes()
    }
  }
</script>

<style scoped lang="scss">
  .stock{
    &--wrap{
      padding: 0 10px;
      margin-bottom: 30px;
    }
    &--content{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      &__search{
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e9e9e9;
        padding-bottom: 15px;

        .select-btn{
          width: 200px;
          padding: 8px 15px 9px;
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

        .right{
          padding-right: 10px;
        }

        .el-input{
          margin: 0 10px;
        }
        .el-cascader{
          margin-right: 10px;
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
