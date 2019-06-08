<template>
  <div class="rx-wrap">
    <div class="rx">
      <bread-crumb :path="$route.path"/>

      <div class="title">
        <h3>处方管理</h3>
      </div>

      <div class="list">
        <d2-crud
          :columns="rxColumns"
          :data="rxList"
          :loading="loading"
          :pagination="pagination"
          @pagination-current-change="paginationCurrentChange"
          :options="options"
          :rowHandle="rowHandle"
          @viewDetail-emit="viewDetail"
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
  import moment from 'moment'

  @Component({
    components: {
      BreadCrumb
    }
  })
  export default class Rx extends Vue {
    rxColumns = [
      {
        title: '处方医院',
        key: 'hospitalName'
      },
      {
        title: '病患姓名',
        key: 'accountName'
      },
      {
        title: '症状',
        key: 'illness'
      },
      {
        title: '处方医生',
        key: 'preDoctor'
      },
      {
        title: '处方科室',
        key: 'office'
      },
      {
        title: '更新时间',
        key: 'rxDate'
      },
      {
        title: '当前状态',
        key: 'state'
      }
    ];
    rxList = [];

    loading = false;
    pagination = {
      currentPage: 1,
      pageSize: 15,
      total: 0
    };
    options = {
      border: true
    };
    rowHandle= {
      custom: [
        {
          text: '查看',
          type: 'text',
          emit: 'viewDetail-emit'
        }
      ]
    };

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getRxs()
    }

    // 查看详情
    viewDetail ({row}) {
      this.$router.push({
        path: '/rx/rx/detail',
        query: {
          rxId: row.id
        }
      })
    }

    // 转换当前状态
    isAbled (state) {
      if (state === 'ENABLED') {
        return '可用'
      } else {
        return '不可用'
      }
    }

    async getRxs () {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      let {data: rxRes} = await axios.get(`/api/supervise/rxs`, {params})
      console.log(rxRes)
      this.rxList = rxRes.list
      this.pagination.total = rxRes.total

      this.rxList.forEach(item => {
        item.rxDate = moment(item.rxDate).format('YYYY-MM-DD HH:mm:ss')
        item.state = this.isAbled(item.state)
      })
    }

    mounted () {
      this.getRxs()
    }
  }
</script>

<style lang="scss">
  .rx-wrap{
    padding: 0 10px;
    margin-bottom: 30px;

    .rx{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .title{
        padding: 0 15px;
        border-bottom: 1px solid #E9E9E9;
      }

      .list {
        padding: 0 15px;

        .el-table{
          th{
            background-color: #F4F4F4;
            color: #555;
          }
          &__body {
            td{
              padding: 6px 0;
            }
          }
        }
      }
    }
  }
</style>
