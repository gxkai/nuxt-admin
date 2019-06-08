<template>
  <div class="module-wrap">
    <div class="module">
      <bread-crumb :path="$route.path"/>

      <div class="title">
        <h3>板块区管理</h3>
        <el-button type="primary" @click="addRow" style="background: #169bd5;">新增</el-button>
      </div>

      <div class="list">
        <el-table
          :data="modulesList"
          border
          style="width: 100%">
          <el-table-column label="序号">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="模块">
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序">
          </el-table-column>
          <el-table-column
            prop="url"
            label="链接地址">
          </el-table-column>
          <el-table-column
            prop="imgURL"
            label="图片">

            <template slot-scope="scope">
              <img v-if="scope.row.imgURL" :src="scope.row.imgURL" style="width: 50px;">
              <img v-else :src="emptyImg" style="width: 50px;">
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="viewAdvert(scope.$index, scope.row)" type="text">查看</el-button>
              <el-button @click="editAdvert(scope.$index, scope.row)" type="text">编辑</el-button>
              <el-button @click="setDrug" type="text">设置药品</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--查看广告-->
      <el-dialog
        title="查看"
        :visible.sync="viewDialogVisible"
        width="30%"
        :close-on-click-modal='isClickModal'>
        <div class="main">
          <el-form :model="viewData" label-width="100px">
            <el-form-item label="序号">
              <el-input v-model="viewData.index" readonly placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="模块">
              <el-input v-model="viewData.name" readonly placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input v-model="viewData.sort" readonly placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="链接地址">
              <el-input v-model="viewData.url" readonly placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="图片">
              <img v-if="viewData.imgURL" :src="viewData.imgURL"/>
              <img v-else src="../../assets/img/hospital/img1.png" style="width: 100px"/>
            </el-form-item>
          </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="viewDialogVisible = false" type="primary">关 闭</el-button>
        </div>
      </el-dialog>

      <!--编辑广告-->
      <el-dialog
        title="编辑"
        :visible.sync="editDialogVisible"
        width="30%"
        :close-on-click-modal='isClickModal'>
        <div class="edit-con">
          <el-form :model="editData" label-width="100px">
            <el-form-item label="模块">
              <el-input v-model="editData.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input v-model="editData.sort" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="链接地址">
              <el-input v-model="editData.url" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="图片">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :on-success="editAvatarSuccess"
                :before-upload="editBeforeUpload">
                <img v-if="editData.imgURL" :src="editData.imgURL" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="confirmEdit" type="primary">确 定</el-button>
        </div>
      </el-dialog>

      <!--新增广告-->
      <el-dialog
        title="新增"
        :visible.sync="addDialogVisible"
        width="30%"
        :close-on-click-modal='isClickModal'>
        <div class="edit-con">
          <el-form :model="addData" label-width="100px">
            <el-form-item label="模块">
              <el-input v-model="addData.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input v-model="addData.sort" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="链接地址">
              <el-input v-model="addData.url" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="图片">
              <!--<el-input v-model="editData.fileId" placeholder="请输入"></el-input>-->
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :on-success="addAvatarSuccess"
                :before-upload="addBeforeUpload">
                <img v-if="addData.imgURL" :src="addData.imgURL" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addAdvert" type="primary">确 定</el-button>
        </div>
      </el-dialog>
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

  export default class Module extends Vue {
    modulesList = [];
    emptyImg = require('../../assets/img/hospital/img1.png')

    // 设置药品
    setDrug () {

    }

    // 新增广告
    addData = {}
    setAddData () {
      this.addData = {
        name: '',
        sort: '',
        url: '',
        fileId: '',
        imgURL: '',
        imgJudeg: ''
      }
    }
    addFile = {}
    addDialogVisible = false;

    // 新增图片上传
    addBeforeUpload (file) {
      // console.log(file)
      // const isJPG = file.type === 'image/jpeg'
      // const isLt2M = file.size / 1024 / 1024 < 2
      //
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!')
      // }
      // return isJPG && isLt2M
    }

    addAvatarSuccess (res, file) {
      this.addData.imgURL = URL.createObjectURL(file.raw)
      this.addFile = file.raw
    }

    addRow () {
      this.addDialogVisible = true
      this.setAddData()
    }

    async addAdvert () {
      if (this.addData.imgJudeg !== this.addData.imgURL) {
        let fileParams = new FormData()
        fileParams.append('file', this.addFile)
        fileParams.append('fileType', 'LOGO')
        let {data: fileID} = await axios.post(`/api/supervise/files`, fileParams)
        this.addData.fileId = fileID // 图片上传成功后更新fileId
      } else {
        this.$message({
          message: '内容不能为空',
          type: 'warning'
        })
        return
      }

      let params = this.addData
      await axios.post(`/api/supervise/modules`, params)
      this.$message({
        message: '添加成功',
        type: 'success'
      })
      this.addDialogVisible = false
      this.modulesList.push(this.addData)
      this.setAddData()
    }

    // 查看广告
    viewDialogVisible = false;
    isClickModal = false;
    viewData = {};

    viewAdvert (index, row) {
      this.viewDialogVisible = true
      this.viewData.index = index
      this.viewData.id = row.id
      this.viewData.name = row.name
      this.viewData.sort = row.sort
      this.viewData.url = row.url
      this.viewData.imgURL = row.imgURL
    }

    // 编辑广告
    editFile = {}
    editDialogVisible = false;
    editData = {
      name: '',
      sort: '',
      url: '',
      fileId: '',
      imgURL: '',
      imgJudeg: ''
    }

    editBeforeUpload (file) {
      // console.log(file)
      // const isJPG = file.type === 'image/jpeg'
      // const isLt2M = file.size / 1024 / 1024 < 2
      //
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!')
      // }
      // return isJPG && isLt2M
    }

    editAvatarSuccess (res, file) {
      this.editData.imgURL = URL.createObjectURL(file.raw)
      this.editFile = file.raw
    }

    editAdvert (index, row) {
      this.editDialogVisible = true
      this.editData.index = index
      this.editData.id = row.id
      this.editData.fileId = row.fileId
      this.editData.name = row.name
      this.editData.sort = row.sort
      this.editData.url = row.url
      this.editData.imgURL = row.imgURL
      this.editData.imgJudeg = row.imgJudeg
    }

    async confirmEdit () {
      if (this.editData.imgJudeg !== this.editData.imgURL) {
        let fileParams = new FormData()
        fileParams.append('file', this.editFile)
        fileParams.append('fileType', 'LOGO')
        let {data: fileID} = await axios.post(`/api/supervise/files`, fileParams)
        this.editData.fileId = fileID // 图片上传成功后更新fileId
      }

      let params = this.editData
      await axios.put(`/api/supervise/modules/${this.editData.id}`, params)
      this.$message({
        message: '编辑成功',
        type: 'success'
      })
      this.editDialogVisible = false
      this.$set(this.modulesList, this.editData.index, this.editData)
    }

    async getModules () {
      let {data: moduleData} = await axios.get(`/api/supervise/modules`)
      console.log(moduleData)

      this.modulesList = moduleData
      this.modulesList.forEach(item => {
        this.getImgURL(item.fileId, data => {
          if (data.substring(data.lastIndexOf('/') + 1, data.length) !== 'null') {
            item.imgURL = data
            item.imgJudeg = data
          }
        })
      })
    }

    // 获取图片路径
    async getImgURL (id, post) {
      let params = {
        resolution: 'SMALL_LOGO'
      }
      let {data: imgRes} = await axios.get(`/api/supervise/files/${id}`, {params})
      let url = imgRes.replace('redirect:', '')
      console.log(url)
      post(url)
    }

    mounted () {
      this.getModules()
    }
  }
</script>

<style lang="scss">
  .module-wrap{
    padding: 0 10px;
    margin-bottom: 30px;

    .module{
      min-height: 850px;
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .avatar-uploader{
        img{
          width: 100px;
        }
      }

      .el-dialog__body{
        padding: 20px;
        border:{
          top: 1px solid #e9e9e9;
          bottom: 1px solid #e9e9e9;
        }
      }

      .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        margin-bottom: 15px;
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

        .pagination{
          margin: 30px 0;
          .el-pagination__total{
            float: right;
          }
        }
      }

      .cell{
        .el-button+.el-button{
          &:before{
            content: '|';
            color: #EEE;
            position: relative;
            left: -6px;
            top: -1px;
          }
        }
      }
    }
  }
</style>
