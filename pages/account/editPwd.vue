<template>
  <div class="common-wrap">
    <div class="common-list">
      <bread-crumb :path="$route.path"/>
      <h3 class="h3-title">修改密码</h3>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
        <el-form-item label="当前密码" prop="currentPwd">
          <el-input
            v-model="ruleForm.currentPwd"
            minlength="6"
            maxlength="16"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="ruleForm.newPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="enterPwd">
          <el-input type="password"  v-model="ruleForm.enterPwd"></el-input>
        </el-form-item>
      </el-form>

      <br />

      <el-button type="primary" style="margin-left: 100px;" @click="submitForm('ruleForm')">确认修改</el-button>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import axios from 'axios'
  import {getToken} from '@/mixins'

  @Component({
    components: {
      BreadCrumb
    }
  })

  export default class editPwd extends Vue {
    rules = {
      currentPwd: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
      newPwd: [
        { required: true, message: '请输入新密码（6 到 16 个字符）', trigger: 'blur' },
        { min: 6, max: 16, message: '请输入新密码（6 到 16 个字符）', trigger: 'blur' }
      ],
      enterPwd: [
        { required: true, message: '请确认新密码（6 到 16 个字符）', trigger: 'blur' },
        { min: 6, max: 16, message: '请确认新密码（6 到 16 个字符）', trigger: 'blur' }
      ]
    }
    ruleForm = {
      currentPwd: '',
      newPwd: '',
      enterPwd: ''
    }

    userToken = ''

    async created () {
      this.userToken = await getToken()
    }

    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.newPwd !== this.ruleForm.enterPwd) {
            this.$message.warning('输入密码不一致')
            return false
          }
          let PassWordDTO = {
            newPassword: this.ruleForm.newPwd,
            rePassword: this.ruleForm.enterPwd
          }
          console.log(PassWordDTO)

          axios.put(`/api/supervise/admins/password?token=${this.userToken}`, PassWordDTO)
          this.$message({
            message: '修改成功,请重新登录！',
            type: 'success'
          })
          setTimeout(() => {
            this.$router.push('/login')
          }, 1000)
        } else {
          return false
        }
      })
    }
    //
  }
</script>

<style lang="scss" scoped>
  .common {
    &-wrap {
      padding: 0 10px;
      margin-bottom: 30px;
    }
    &-list {
      /*min-height: 800px;*/
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .h3-title {
        border-bottom: 1px solid #E9E9E9;
        padding: 0 15px 15px 15px;
        margin: 15px 0;
      }

      .ruleForm{
        width: 400px;
      }

    }
  }

</style>
