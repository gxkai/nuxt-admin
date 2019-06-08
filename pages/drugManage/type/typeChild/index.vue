<template>
  <div class="common-wrap">
    <div class="common-list">
      <bread-crumb :path="$route.path"/>
      <div class="title">
        <h3>药品子类</h3>
      </div>
      <d2-crud
        ref="d2Crud"
        :columns="columns"
        :data="typeChildData"
        :loading="loading"
        :pagination="pagination"
        :options="options"
        class="drug-table"
      />

    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import axios from 'axios'
  @Component({
    components: {
      BreadCrumb
    }
  })
  export default class TypeChild extends Vue {
    columns = [
      {
        title: '序号',
        key: 'index',
        width: 100,
        align: 'center'
      },
      {
        title: '类型名称',
        key: 'type'
      },
      {
        title: '父类名称',
        key: 'pname'
      },
      {
        title: '排序',
        key: 'sort'
      },
      {
        title: '是否显示',
        key: 'showed'
      }
    ]
    typeChildData = []
    loading = false;
    pagination = {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options = {
      border: true
    }

    beforeMount () {
      this.getChildData()
    }
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.getChildData()
    }
    async getChildData (type) {
      let id = this.$route.query.id
      let pname = this.$route.query.type
      const params = {
        type,
        pname: pname,
        pageNum: this.pagination.currentPage,
        pageSize: 15
      }
      let data = await axios.get(`/api/shop/drugTypes/${id}/children`, {params: params})
      console.log(data)
      this.typeChildData = data.data
      this.typeChildData.forEach((item, index) => {
        item.index = index + 1
        if (item.showed.toString() === 'true') {
          item.showed = '是'
        } else {
          item.showed = '否'
        }
      })
      this.pagination.total = data.data.length
      this.tableData = data.data.map(i => {
        this.$set(i, 'pname', pname)
        return i
      })
    }
  }
</script>

<style lang="scss" scoped>
  .common{
    &-wrap{
      padding: 0 10px;
      margin-bottom: 30px;
    }

    &-list{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;
      .title{
        padding: 0 15px;
        border-bottom: 1px solid #E9E9E9;
      }
    }

    &-search {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e9e9e9;
      padding-bottom: 15px;

      .right{
        padding-right: 10px;
      }

      .el-input {
        margin: 0 10px;
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
