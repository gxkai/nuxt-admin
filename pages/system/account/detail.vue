<template>
  <div class="detail-wrap">
    <div class="detail-form">
      <bread-crumb :path="$route.path"/>
      <div class="account-detail">
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item label="手机号：">
            <el-input v-model="form.phone" disabled placeholder="暂无"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input v-model="form.name" disabled placeholder="暂无"></el-input>
          </el-form-item>
          <el-form-item label="性别：">
            <el-input v-model="form.sex" disabled placeholder="暂无"></el-input>
          </el-form-item>
          <el-form-item label="身份证：">
            <el-input v-model="form.idCard" disabled placeholder="暂无"></el-input>
          </el-form-item>
          <el-form-item label="医保卡：">
            <el-input v-model="form.medicareCard" disabled placeholder="暂无"></el-input>
          </el-form-item>
          <el-form-item label="最后登录时间：">
            <el-input v-model="form.lastLogin" disabled placeholder="暂无"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-input v-model="form.curState" disabled placeholder="暂无"></el-input>
          </el-form-item>
          <el-form-item label="头像：">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess">
              <img v-if="form.headPhone" :src="form.headPhone" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="account-detail-btn">
          <el-button @click="goBack">返回</el-button>
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
  import moment from 'moment'
  @Component({
    components: {
      BreadCrumb
    }
  })
  export default class AccountDetail extends Vue {
    form = {
      phone: '',
      name: '',
      sex: '',
      idCard: '',
      medicareCard: '',
      lastLogin: '',
      curState: '',
      headPhone: require(`~/assets/img/hospital/img1.png`)
    }
    async beforeMount () {
      let id = this.$route.query.id
      let getDetail = await axios.get(`/api/supervise/accounts/${id}`)
      console.log(getDetail)
      this.form.phone = getDetail.data.username
      this.form.name = getDetail.data.name
      // console.log(typeof getDetail.data.gender)
      if (getDetail.data.gender === 'MALE') {
        getDetail.data.gender = '男'
      } else {
        getDetail.data.gender = '女'
      }
      this.form.sex = getDetail.data.gender
      this.form.idCard = getDetail.data.identityNumber
      this.form.medicareCard = getDetail.data.medicaidNumber
      this.form.lastLogin = moment(getDetail.data.loginDate).format('YYYY-MM-DD HH:mm:ss')
      if (getDetail.data.activated.toString() === 'true') {
        getDetail.data.activated = '启用'
      } else {
        getDetail.data.activated = '停用'
      }
      this.form.curState = getDetail.data.activated
      // this.form.headPhone = getDetail.data.fileId
    }
    handleAvatarSuccess (res, file) {
      this.form.headPhone = URL.createObjectURL(file.raw)
    }
    goBack () {
      this.$router.go(-1)
    }
  }
</script>

<style scoped lang="scss">
  .detail-wrap{
    padding: 0 10px;
    margin-bottom: 30px;

    .detail-form{
      min-height: 850px;
      padding: 10px;
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .account-detail{
        padding-right: 100px;
        .el-form{
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: repeat(4, 50px) 200px;
          .el-form-item{
            &:nth-child(2n){
              grid-column: 1 / 2;
            }
            &:nth-child(2n-1){
              grid-column: 2 / 3;
            }
            &:nth-child(1){
              grid-column: 1 / 3;
            }
            &:last-child{
              grid-column: 1 / 3;
            }
          }
        }
        &-btn{
          display: flex;
          justify-content: center;
          padding: 50px;
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
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  /deep/.avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
</style>
