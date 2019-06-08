<template>
  <div class="origin--content">
    <div class="origin--content__search">
      <el-input v-model="originSimpleNameValue" size="small" placeholder="请输入厂商简称" style="width: 200px;"></el-input>
      <el-input v-model="originFullNameValue" size="small" placeholder="请输入厂商全称" style="width: 200px;"></el-input>
      <el-button type="primary" size="small" @click="searchSpec">搜索</el-button>
      <el-button size="small" @click="clear">清空</el-button>
    </div>
    <div>
      <d2-crud
        ref="d2Crud"
        :columns="columns"
        :data="OriginList"
        :pagination="pagination"
        @pagination-current-change="paginationCurrentChange"
        :options="options"
        :rowHandle="rowHandle"
        @current-change="handleCurrentChange"
        @emit-select="handleCurrentChange"
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
  export default class Origin extends Vue {
    originSimpleNameValue = ''
    originFullNameValue = ''
    columns = [
      {
        title: '序号',
        key: 'index',
        width: 50,
        align: 'center'
      },
      {
        title: '厂商简称',
        key: 'name'
      },
      {
        title: '厂商全称',
        key: 'fullName'
      }
    ]
    OriginList = []
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
      this.originSimpleNameValue = ''
      this.originFullNameValue = ''
    }

    searchSpec () {
      this.getAllSpecs()
    }

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getAllSpecs()
    }

    handleCurrentChange (currentRow) {
      this.$emit('listenToChildEvent', currentRow)
    }

    async getAllSpecs () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        name: this.originSimpleNameValue.trim(),
        fullName: this.originFullNameValue.trim()
      }
      let {data: originData} = await axios.get(`/api/supervise/origins`, {params})
      this.OriginList = originData.list
      this.pagination.total = originData.total
      this.OriginList.forEach((item, index) => {
        item.index = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
      })
    }

    beforeMount () {
      this.getAllSpecs()
    }
  }
</script>

<style lang="scss" scoped>
  .origin--content{
    padding: 0 10px;
    max-height: 500px;
    overflow-y: scroll;
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
