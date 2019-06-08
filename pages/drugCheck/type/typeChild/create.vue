<template>
  <div class="type--create">
    <bread-crumb :path="$route.path"/>
    <div>
      <el-form label-width="150px">
        <el-form-item label="LOGO">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <el-form ref="form" class="type--create__form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="分类名称" prop="type">
          <el-input v-model="form.type" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父类名称" prop="ptype">
          <el-select v-model="form.ptype" placeholder="请选择父类名称" style="width:100%;" @change="getfatherPid">
            <el-option
              v-for="item in fatherType"
              :key="item.id"
              :label="item.type"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示" prop="showed">
          <el-select v-model="form.showed" placeholder="请选择是否显示" style="width:100%;">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort" >
          <el-input v-model="form.sort" placeholder="请输入排序"></el-input>
          <div>（序号越小，分类显示越靠前）</div>
        </el-form-item>
      </el-form>
      <div class="type-form-btn">
        <el-button size="small" @click="back()">返回</el-button>
        <el-button type="primary" size="small" @click="submit()">提交</el-button>
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
  export default class TypeChildCreate extends Vue {
    form = {
      id: '',
      type: '',
      pid: '',
      ptype: '',
      showed: '',
      sort: ''
    }
    rules = {
      type: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      ptype: [{ required: true, message: '请选择父类名称', trigger: 'change' }],
      showed: [{ required: true, message: '请选择是否显示', trigger: 'change' }],
      sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
    }
    imageUrl = ''

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
      this.getFatherType()
    }
    getfatherPid () {
      this.fatherType.forEach(item => {
        if (this.form.ptype === item.type) {
          this.form.pid = item.id
        }
      })
    }
    async getFatherType () {
      await axios.get(`/api/supervise/drugTypes/father`).then(res => {
        this.fatherType = res.data
      })
    }

    filePath = {} // 存放file
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.filePath = file.raw
    }

    beforeAvatarUpload (file) {
      // console.log(file)
    }

    fileId = ''
    async submit () {
      let fileParams = new FormData()
      fileParams.append('file', this.filePath)
      fileParams.append('fileType', 'LOGO')
      await axios.post('/api/supervise/files', fileParams).then(res => {
        console.log(res.data)
        this.fileId = res.data
      }).catch(error => {
        if (error.response) {
        }
      })

      // 获取图片文件
      // let params = {
      //   local: '',
      //   resolution: ''
      // }
      // await axios.get(`/api/supervise/files/${this.fileId}`, {params: params})
      //   .then(res => {
      //     console.log(res.data)
      //     this.imageUrl = res.data.replace('redirect:', '')
      //   }).catch(err => {
      //     console.log(1)
      //     console.log(err)
      //   })

      // 子类判重
      // let getName = await axios.post(`/api/supervise/drugTypes/${this.form.fatherPid}/children/exists`, {type: this.form.typeName})
      // console.log(getName)
      // if (getName.data >= 1) {
      //   this.$message({
      //     message: '子类名称已存在!',
      //     type: 'warning'
      //   })
      //   return false
      // }

      this.form = Object.assign(this.form, {
        file: '',
        fileId: this.fileId || ''
      })

      const valid = this.$refs.form.validate()
      if (valid) {
        await axios.post(`/api/supervise/drugTypes/child`, this.form)
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.$router.push({path: '/drugCheck/type/typeChild', query: {id: this.form.pid, type: this.form.ptype}})
      }
    }
    back () {
      this.$router.go(-1)
    }
  }
</script>

<style lang="scss" scoped>
.type--create{
  padding:0 10px;
  &__form{
    padding-right: 100px;
  }
  .type-form-btn{
    display: flex;
    justify-content: center;
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
