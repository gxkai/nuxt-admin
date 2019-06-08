<template>
  <div class="type-wrap">
    <div class="type-list">
      <bread-crumb :path="$route.path"/>
      <div class="title">
        <h3>药品类型</h3>
      </div>
      <div>
        <d2-crud
          ref="d2Crud"
          :columns="columns"
          :data="typeData"
          :loading="loading"
          :options="options"
          :rowHandle="rowHandle"
          @type-child-emit="handleChild"
          class="drug-table"
        />
      </div>
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
  export default class TypeDrugs extends Vue {
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
        title: '排序',
        key: 'sort'
      }
    ]
    typeData = []
    loading = false;
    options = {
      border: true
    }
    rowHandle = {
      columnHeader: '操作',
      custom: [
        {
          text: '下级',
          type: 'text',
          emit: 'type-child-emit'
        }
      ]
    }
    beforeMount () {
      this.initData()
    }
    async initData () {
      await axios.get(`/api/shop/drugTypes/father`).then(res => {
        console.log(res)
        this.typeData = res.data
        this.typeData.forEach((item, index) => {
          item.index = index + 1
        })
      })
    }
    handleChild ({index, row}) {
      this.$router.push({path: '/drugManage/type/typeChild', query: {id: row.id, type: row.type}})
    }
  }
</script>

<style lang="scss" scoped>
  .type{
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

    &-add {
      text-align: right;
      padding-right: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e9e9e9;
    }
  }
  /deep/.drug-table{
    padding: 0 15px;
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
