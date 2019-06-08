<template>
  <div>
    <div>
      <bread-crumb :path="$route.path"/>
      <d2-crud
        :columns="columns"
        :data="data"
        :loading="loading"
        :pagination="pagination"
        :options="options"
        :rowHandle="rowHandle"
        @custom-emit-1="handleCustomEvent"
       />
      <ve-pie :data="chartData"></ve-pie>
    </div>
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
  export default class Sale extends Vue {
    chartData= {
      columns: ['日期', '访问用户'],
      rows: [
        { '日期': '1/1', '访问用户': 1393 },
        { '日期': '1/2', '访问用户': 3530 },
        { '日期': '1/3', '访问用户': 2923 },
        { '日期': '1/4', '访问用户': 1723 },
        { '日期': '1/5', '访问用户': 3792 },
        { '日期': '1/6', '访问用户': 4593 }
      ]
    };
    columns= [
      {
        title: '卡密',
        key: 'key',
        width: 320
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
    ];
    loading= false;
    pagination= {
      currentPage: 1,
      pageSize: 5,
      total: 0
    };
    options= {
      border: true
    };
    rowHandle= {
      custom: [
        {
          text: '自定义按钮',
          type: 'warning',
          size: 'small',
          emit: 'custom-emit-1'
        }
      ]
    };
    mounted () {
    }
    handleCustomEvent ({index, row}) {
      this.$message.success(index.toString())
      console.log(index)
      console.log(row)
    }
  }
</script>
