<template>
  <div class="edit-wrap">
    <div class="main-con">
      <bread-crumb :path="$route.path"/>
      <div>
        <el-form ref="form" class="edit-form" :model="form" label-width="150px">
          <el-form-item label="LOGO">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess">
              <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="分类名称">
            <el-input v-model="form.typeName" placeholder="请输入分类名称"></el-input>
          </el-form-item>
          <el-form-item label="父类名称">
            <el-select v-model="form.fatherTypeName" placeholder="请选择父类名称" style="width:100%;" @change="getfatherPid">
              <el-option
                v-for="item in fatherType"
                :key="item.type"
                :label="item.type"
                :value="item.type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-select v-model="form.isShow" placeholder="请选择是否显示" style="width:100%;">
              <el-option
                v-for="item in selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="form.typeSort" placeholder="请输入排序"></el-input>
            <div>（序号越小，分类显示越靠前）</div>
          </el-form-item>
        </el-form>
        <div class="action-btn">
          <el-button @click="back()">返回</el-button>
          <el-button type="primary" @click="submit()">提交</el-button>
        </div>
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
  export default class TypeChildEdit extends Vue {
    form = {
      id: '',
      imageUrl: '',
      typeName: '',
      fatherPid: '',
      fatherTypeName: '',
      isShow: '',
      typeSort: ''
    }
    fatherType = []
    selectOptions = [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ]

    beforeMount () {
      this.initData()
      this.getFatherType()
    }

    getfatherPid () {
      this.fatherType.forEach(item => {
        if (this.form.fatherTypeName === item.type) {
          this.form.fatherPid = item.id
        }
      })
      // console.log(this.fatherType)
    }
    async getFatherType () {
      await axios.get(`/api/supervise/drugTypes/father`).then(res => {
        this.fatherType = res.data
      })
    }

    async initData () {
      let id = this.$route.query.id
      let pid = this.$route.query.pid
      let editData = await axios.get(`/api/supervise/drugTypes/${id}/child`)
      console.log(editData.data)
      this.form.typeName = editData.data.type
      this.form.fatherPid = editData.data.pid
      this.form.fatherTypeName = this.$route.query.ptype
      this.form.isShow = editData.data.showed
      this.form.typeSort = editData.data.sort

      // 获取图片
      let childImg = await axios.get(`/api/supervise/files/${editData.data.fileId}`, {params: {local: '', resolution: ''}})
      this.form.imageUrl = childImg.data.replace('redirect:', '')
    }

    filePath = {} // 存放文件
    handleAvatarSuccess (res, file) {
      this.form.imageUrl = URL.createObjectURL(file.raw)
      this.filePath = file.raw
    }

    fileId = ''
    async submit () {
      let fileParams = new FormData()
      fileParams.append('file', this.filePath)
      fileParams.append('fileType', 'LOGO')
      let imgres = await axios.post('/api/supervise/files', fileParams)
      this.fileId = imgres.data // 图片上传成功后更新fileId

      // 获取图片
      let img1 = await axios.get(`/api/supervise/files/${this.fileId}`, {params: {local: '', resolution: ''}})
      console.log(img1.data.replace('redirect:', ''))

      let id = this.$route.query.id

      let drugTypeChildADTO = {
        file: '',
        fileId: this.fileId,
        id: id,
        pid: this.form.fatherPid,
        ptype: this.form.fatherTypeName,
        showed: this.form.isShow,
        sort: this.form.typeSort,
        type: this.form.typeName
      }
      await axios.put(`/api/supervise/drugTypes/${id}/child`, drugTypeChildADTO)
      this.$router.push({path: '/drugCheck/type/typeChild', query: {id: this.form.fatherPid, type: this.form.fatherTypeName}})
    }
    back () {
      this.$router.go(-1)
    }
  }
</script>

<style lang="scss" scoped>
  .edit{
    &-wrap{
      padding:0 10px;
      margin-bottom: 30px;
      .main-con{
        min-height: 850px;
        background: #FFF;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #E9E9E9;

        &-form{
          padding-top: 20px;
          padding-right: 100px;
        }

        .action-btn{
          display: flex;
          justify-content: center;
        }
      }
    }
  }
  /deep/.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  /deep/.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  /deep/.avatar {
    width: 178px;
    height: 148px;
    display: block;
  }
  /deep/.type--create--form{
    margin-top: 10px;
    .el-form-item{
      &__label{
        padding-right: 30px;
      }
    }
  }

</style>
