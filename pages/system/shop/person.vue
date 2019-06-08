<template>
  <div class="shop-wrap">
    <div class="shop-list">
      <bread-crumb :path="$route.path"/>
      <div class="title">
        <h3>药店人员查看</h3>
      </div>

      <d2-crud
        :columns="columns"
        :data="shopData"
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
  import moment from 'moment'

  @Component({
    components: {
      BreadCrumb
    }
  })
  export default class DrugShopPerson extends Vue {
    columns = [
      {
        title: '序号',
        key: 'index',
        width: 60
      },
      {
        title: '用户名',
        key: 'username'
      },
      {
        title: '姓名',
        key: 'name'
      },
      {
        title: '手机',
        key: 'username'
      },
      {
        title: '类型',
        key: 'roleId'
      },
      {
        title: '状态',
        key: 'activated'
      },
      {
        title: '最后操作日期',
        key: 'lastModifiedDate'
      }
    ]
    shopData = []
    loading = false
    pagination = {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options = {
      border: true
    }
    beforeMount () {
      this.getShopPerson()
    }
    async getShopPerson () {
      let params = {
        activated: '',
        name: '',
        roleId: '',
        shopId: this.$route.query.id,
        pageNum: this.pagination.currentPage,
        pageSize: 15
      }
      let data = await axios.get(`/api/supervise/users`, {params: params})
      console.log(data)
      this.shopData = data.data.list
      this.pagination.total = data.data.total
      this.shopData.forEach((item, index) => {
        item.lastModifiedDate = moment(item.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')
        item.index = index + 1

        if (item.activated.toString() === 'true') {
          item.activated = '在职'
        } else {
          item.activated = '离职'
        }

        if (item.roleId === 'ROLE_CIRCULATE_SHOP') {
          item.roleId = '店长'
        } else if (item.roleId === 'ROLE_CIRCULATE_COURIER') {
          item.roleId = '配送员'
        }
        //
      })
    }
  }
</script>

<style scoped lang="scss">
  .shop{
    &-wrap {
      padding: 0 10px;
      margin-bottom: 30px;
    }
    &-list{
      min-height: 850px;
      padding: 10px;
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #E9E9E9;
      .title{
        border-bottom: 1px solid #e9e9e9;
        padding: 0 15px;
      }


    }
  }

  /deep/.drug-table{
    margin-top: 15px;
    .d2-crud-body{
      padding: 0  15px !important;
      .el-table{
        th{
          background-color: #F4F4F4 !important;
          color: #555 !important;
        }
      }
    }
  }

</style>
