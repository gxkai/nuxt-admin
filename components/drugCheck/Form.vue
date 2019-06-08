<template>
  <div class="common--content">
    <div class="common--content__search">
      <el-input v-model="formNameValue" size="small" placeholder="请输入药剂名称" style="width: 200px;"></el-input>
      <el-button type="primary" size="small" @click="searchDosageForm">搜索</el-button>
      <el-button size="small" @click="clear">清空</el-button>
    </div>
    <div>
      <d2-crud
        ref="d2Crud"
        :columns="dosageFormColumns"
        :data="dosageFormList"
        :pagination="pagination"
        @pagination-current-change="paginationCurrentChange"
        :options="options"
        :rowHandle="rowHandle"
        @emit-select="handleCurrentChange"
        @current-change="handleCurrentChange"
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
  export default class Form extends Vue {
    formNameValue = ''
    dosageFormColumns = [
      {
        title: '序号',
        key: 'index',
        width: 50,
        align: 'center'
      },
      {
        title: '编码',
        key: 'code'
      },
      {
        title: '剂型名称',
        key: 'name'
      }
    ]
    dosageFormList = []
    pagination = {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options = {
      border: true,
      highlightCurrentRow: true
    }
    rowHandle = {
      width: 50,
      align: 'center',
      columnHeader: '选择',
      custom: [
        {
          icon: 'el-icon-check',
          emit: 'emit-select'
        }
      ]
    }

    clear () {
      this.formNameValue = ''
    }

    handleCurrentChange (currentRow) {
      this.$emit('listenToChildEvent', currentRow)
    }

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getAllForms()
    }

    // 搜索
    searchDosageForm () {
      this.getAllForms()
    }

    async getAllForms () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        name: this.formNameValue.trim()
      }
      let {data: formData} = await axios.get(`/api/supervise/forms`, {params})
      console.log(formData)

      this.dosageFormList = formData.list
      this.pagination.total = formData.total
      this.dosageFormList.forEach((item, index) => {
        item.index = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
      })
    }

    beforeMount () {
      this.getAllForms()
    }
  }
</script>

<style lang="scss" scoped>
  .common--content{
    padding: 0 10px;
    margin-bottom: 30px;
    &__search{
      display: flex;
      justify-content: Flex-start;
      align-items: center;
      .el-input{
        margin: 0 10px;
      }
    }
  }
  /deep/.drug-table{
    .el-table{
      .el-button{
        width: 15px;
        height: 15px;
        line-height: initial;
        padding: 0;
        color: #FFF;
        font-size: 12px;
        border-radius: 2px;

        &:hover, &:focus{
          border-color: #409EFF;
          background-color: #FFF;
        }
      }

      .current-row .el-button{
        background: #409EFF;
        border-color: #409EFF;
      }
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
