<template>
  <div class="interface-wrap">
    <div class="interface-form">
      <bread-crumb :path="$route.path"/>
      <div class="file-search">
        <el-date-picker
          size="small"
          v-model="beginEndDate"
          :clearable="isClearAble"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" size="small" @click="searchInterface">搜索</el-button>
        <el-button size="small" @click="clear">清空</el-button>
      </div>
      <d2-crud
        :columns="columns"
        :data="interList"
        :loading="loading"
        :pagination="pagination"
        @pagination-current-change="paginationCurrentChange"
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
  export default class Interface extends Vue {
    isClearAble = false
    beginEndDate = ''
    startDate = '' // 起始日期
    endDate = '' // 结束日期
    columns = [
      {
        title: 'URL',
        key: 'uri'
      },
      {
        title: 'method',
        key: 'method'
      },
      {
        title: '次数',
        key: 'quantity'
      },
      {
        title: '日期',
        key: 'date'
      }
    ]
    interList = []
    loading = false
    pagination = {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options = {
      border: true
    }

    clear () {
      this.beginEndDate = ''
      this.startDate = ''
      this.endDate = ''
    }

    paginationCurrentChange (page) {
      this.pagination.currentPage = page
      this.getInterface(this.startDate, this.endDate)
    }

    searchInterface () {
      if (this.beginEndDate) {
        for (let i = 0, len = this.beginEndDate.length; i < len; i++) {
          this.beginEndDate[i] = moment(this.beginEndDate[i]).format('YYYY-MM-DD')
        }

        this.startDate = this.beginEndDate[0]
        this.endDate = this.beginEndDate[1]
      }

      this.getInterface(this.startDate, this.endDate)
    }

    async getInterface (start, end) {
      let params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        start,
        end
      }
      let {data: interData} = await axios.get(`/api/supervise/restStatistics/restStatistics`, {params})
      console.log(interData)

      this.interList = interData.list
      this.pagination.total = interData.total

      this.interList.forEach(item => {
        item.date = moment(item.date).format('YYYY-MM-DD HH:mm:ss')
      })
    }

    mounted () {
      this.getInterface()
    }
  }
</script>

<style scoped lang="scss">
  .interface {
    &-wrap {
      padding: 0 10px;
      margin-bottom: 30px;
    }

    &-form {
      min-height: 850px;
      padding: 10px;
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #E9E9E9;
    }
  }
  /deep/.file-search{
    display: flex;
    justify-content: Flex-start;
    align-items: center;
    border-bottom: 1px solid #e9e9e9;
    padding-bottom: 15px;
    margin-bottom: 15px;
    padding-left: 10px;

    .el-date-editor{
      margin-right: 10px;
    }
  }
  /deep/.drug-table{
    margin-top: 10px;
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
