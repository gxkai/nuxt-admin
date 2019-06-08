<template>
  <div class="add-wrap">
    <div class="add-form">
      <bread-crumb :path="$route.path"/>
      <div class="pharm-create">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="药师头像：">
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :on-success="handleAvatarSuccess">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="用户名：" prop="username">
            <el-input v-model="form.username" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="药师名：" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="药师描述：" prop="introduce">
            <el-input v-model="form.introduce" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="药师类别：" prop="pharmacistType">
            <el-input v-model="form.pharmacistType" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="评分：">
            <el-rate
              v-model="form.score"
              class="rate-score"
            >
            </el-rate>
          </el-form-item>
        </el-form>
      </div>
      <div class="pharm-btn">
        <el-button @click="$router.go(-1)">返回</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
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
  export default class PharmacistCreate extends Vue {
    form = {
      name: '',
      username: '',
      introduce: '',
      pharmacistType: '',
      roleId: 'ROLE_ADMIN_PHARMACIST',
      score: 0
    }
    rules = {
      username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
      name: [{ required: true, message: '药师名不能为空', trigger: 'blur' }],
      introduce: [{ required: true, message: '药师描述不能为空', trigger: 'blur' }],
      pharmacistType: [{ required: true, message: '要是类别不能为空', trigger: 'blur' }]
    }

    imageUrl = ''
    filePath = {} // 存放file
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.filePath = file.raw
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
          console.log(error.response)
        }
      })

      this.form = Object.assign(this.form, {
        fileId: this.fileId
      })

      // console.log(this.form)

      const valid = this.$refs.form.validate()
      try {
        if (valid) {
          await axios.post(`/api/supervise/admins`, this.form)
          this.$message({
            message: '提交成功！',
            type: 'success'
          })
          setTimeout(() => {
            this.$router.push('/system/pharmacist')
          }, 1000)
        }
      } catch (e) {
        if (e.response) {
          console.log(e.response)
        }
      } finally {
      }
      //
    }
  }
</script>

<style scoped lang="scss">
  .add{
    &-wrap{
      padding: 0 10px;
      margin-bottom: 30px;
    }

    &-form{
      min-height: 850px;
      padding: 10px;
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .pharm-create{
        margin-top: 20px;
        margin-right: 100px;
        .el-form{
          /*display: grid;*/
          /*grid-template-columns: 1fr;*/
          /*grid-template-rows: 200px repeat(3, 50px) 50px;*/
          .el-form-item{
            .rate-score{
              margin-top: 10px;
            }
          }
        }
      }
      .pharm-btn{
        display: flex;
        justify-content: center;
        padding: 50px;
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
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  /deep/.avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
