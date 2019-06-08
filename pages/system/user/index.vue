<template>
  <div class="p10">
    <bread-crumb :path="$route.path"/>
    <d2-crud
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      :options="options"
      :rowHandle="rowHandle"
      @custom-emit-1="handleCustomEvent"
      class="drug-table"
    />
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'

  @Component({
    components: {
      BreadCrumb
    }
  })
  export default class User extends Vue {
    columns= [
      {
        title: '卡密',
        key: 'key'
      },
      {
        title: '面值',
        key: 'value'
      },
      {
        title: '管理员',
        key: 'admin'
      },
      {
        title: '创建时间',
        key: 'dateTimeCreat'
      },
      {
        title: '使用时间',
        key: 'dateTimeUse'
      }
    ];
    data= [
      {
        key: '1',
        value: '1',
        admin: '1',
        dateTimeCreat: '1',
        dateTimeUse: '1'
      }
    ]
    loading= false;
    pagination= {
      currentPage: 1,
      pageSize: 5,
      total: 0
    }
    options= {
      border: true
    }
    rowHandle= {
      custom: [
        {
          text: '自定义',
          type: 'text',
          emit: 'custom-emit-1'
        }
      ]
    }
    mounted () {
    }
    handleCustomEvent ({index, row}) {
      this.$message.success(index.toString())
      console.log(index)
      console.log(row)
    }
  }
</script>

<style scoped lang="scss">
  .p10{
    padding: 0 10px;
  }
  /deep/.drug-table{
    .d2-crud-body{
      padding: 0 !important;
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
