<template>
  <div class="file-wrap">
    <div class="file-list">
      <bread-crumb :path="$route.path"/>
      <div class="file-search">
        <el-select v-model="fileType" placeholder="文件类型" size="small">
          <el-option
            v-for="item in fileOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input-number size="small" v-model="fileNum" controls-position="right" @change="handleChange" :min="0" :max="100"></el-input-number>
        <el-button type="primary" size="small" @click="search">搜索</el-button>
        <el-button size="small" @click="clear">清空</el-button>
      </div>
      <d2-crud
        :columns="columns"
        :data="fileData"
        :loading="loading"
        :pagination="pagination"
        :options="options"
        :rowHandle="rowHandle"
        @emit-download="handleDownload"
        @row-remove="handleRowRemove"
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
  export default class File extends Vue {
    fileType = ''
    fileNum = 0
    columns= [
      {
        title: '名称',
        key: 'name',
        width: 320
      },
      {
        title: '类型',
        key: 'fileType'
      },
      {
        title: '拓展名',
        key: 'extension'
      },
      {
        title: '大小',
        key: 'size'
      },
      {
        title: '浏览次数',
        key: 'read'
      }
    ]
    fileData = []
    loading= false;
    pagination= {
      currentPage: 1,
      pageSize: 15,
      total: 0
    }
    options= {
      border: true
    }
    rowHandle= {
      custom: [
        {
          text: '下载',
          type: 'text',
          emit: 'emit-download'
        }
      ],
      remove: {
        type: 'text',
        confirm: true
      }
    }
    fileOptions = [
      {
        value: 'LOGO',
        label: 'LOGO'
      },
      {
        value: 'PIC',
        label: 'PIC'
      },
      {
        value: 'ADVERT',
        label: 'ADVERT'
      },
      {
        value: 'FILE',
        label: 'FILE'
      }
    ]
    beforeMount () {
      this.initData()
    }
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.initData()
    }
    async initData () {
      let params = {
        endRead: '',
        fileType: '',
        startRead: '',
        pageNum: this.pagination.currentPage,
        pageSize: 15
      }
      let data = await axios.get(`/api/supervise/files`, {params: params})
      // console.log(data)
      this.fileData = data.data.list
      this.pagination.total = data.data.total
    }
    handleChange (value) {
      // console.log(value)
    }
    async handleDownload ({index, row}) {
      let params = {
        local: '',
        resolution: ''
      }
      let data = await axios.get(`/api/supervise/files/${row.id}`, {params: params})
      console.log(data)
      console.log(data.data.replace('redirect:', ''))
      // this.downloadImgByBlob(data.data.replace('redirect:', ''))
      // var x = new XMLHttpRequest()
      // x.open('GET', data.data.replace('redirect:', ''), true)
      // x.responseType = 'blob'
      // x.onload = function (e) {
      //   var url = window.URL.createObjectURL(x.response)
      //   var a = document.createElement('a')
      //   a.href = url
      //   a.download = ''
      //   a.click()
      // }
      // x.send()
      let a = document.createElement('a')
      a.href = row.name
      a.download = data.data.replace('redirect:', '')
      a.click()

    // console.log(a)
    // this.downloadIamge(data.data.replace(/redirect:/, ''), 'pic')
    }
    // downloadImgByBlob (url) {
    //   var img = new Image()
    //   img.setAttribute('crossOrigin', 'Anonymous')
    //   img.onload = function () {
    //     var canvas = document.createElement('canvas')
    //     canvas.width = img.width
    //     canvas.height = img.height
    //     var ctx = canvas.getContext('2d')
    //     // 将img中的内容画到画布上
    //     ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    //   }
    //   img.src = url
    //   // 必须设置，否则canvas中的内容无法转换为blob
    // }

    clear () {
      this.fileType = ''
      this.fileNum = 0
    }
    async search () {
      let params = {
        fileType: this.fileType,
        startRead: this.fileNum,
        endRead: this.fileNum,
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      await axios.get(`/api/supervise/files`, {params: params}).then(res => {
        this.fileData = res.data.list
      })
    }
    async handleRowRemove ({ index, row }, done) {
      await axios.post(`/api/supervise/api/files/${row.id}`)
      setTimeout(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        done()
      }, 300)
    }
  }
</script>

<style scoped lang="scss">
  .file {
    &-wrap {
      padding: 0 10px;
      margin-bottom: 30px;
    }

    &-list {
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

    .el-select{
      width: 150px;
      margin-right: 10px;
    }
    .el-input-number{
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
