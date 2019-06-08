<template>
  <div class="shop-edit">
    <bread-crumb :path="$route.path"/>
    <div class="check-form">
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="药店名称：">
          <el-input v-model="form.shopName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="店内电话：">
          <el-input v-model="form.shopPhone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="法人姓名：">
          <el-input v-model="form.legalName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="身份证：">
          <el-input v-model="form.idNumber" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="form.shopEmail" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="法人手机号：">
          <el-input v-model="form.legalPhone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="税务登记号：">
          <el-input v-model="form.taxNumber" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="经营许可证号：">
          <el-input v-model="form.shopLicence" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="经度：">
          <el-input v-model="form.shopLng" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="纬度：">
          <el-input v-model="form.shopLat" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="是否支持医保：">
          <el-input v-model="form.orMedicine" placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="是否支持统筹：">
          <el-input v-model="form.orOverall" placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="是否配送：">
          <el-input v-model="form.orDelivery" placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="配送距离：">
          <el-input v-model="form.delDistance" placeholder="3公里"></el-input>
        </el-form-item>
        <el-form-item label="商家介绍：" class="el-form-item-textarea">
          <el-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 8}"
            placeholder="请输入内容"
            v-model="form.shopIntroduce">
          </el-input>
        </el-form-item>
        <!--图片上传-->
        <el-form-item label="" class="el-form-item-upload">
          <div><strong>药品封面照</strong></div>
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="" class="el-form-item-upload2">
          <div><strong>店内照片</strong></div>
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :limit="3"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>

        <el-form-item label="" class="el-form-item-upload3">
          <div class="upload3-tit"><strong>上传证件资料</strong></div>
          <div style="display: flex;">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess2"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div class="uploade-text">经营许可证</div>
            </el-upload>
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess3"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl3" :src="imageUrl3" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div class="uploade-text">营业执照</div>
            </el-upload>
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess4"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl4" :src="imageUrl4" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div class="uploade-text">GSP证书</div>
            </el-upload>
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess5"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl5" :src="imageUrl5" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div class="uploade-text">手持身份证照片</div>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>

      <div class="check-form-btn">
        <el-button @click="submitFail">不通过</el-button>
        <el-button type="primary" @click="submitSuccess">通过</el-button>
      </div>

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
  export default class ShopCheck extends Vue {
    form = {
      shopName: '',
      shopPhone: '',
      legalName: '',
      idNumber: '',
      shopEmail: '',
      legalPhone: '',
      taxNumber: '',
      shopLicence: '',
      shopLng: '',
      shopLat: '',
      orMedicine: '',
      orOverall: '',
      orDelivery: '',
      delDistance: '',
      shopIntroduce: ''
    }
    imageUrl = ''
    imageUrl2 = ''
    imageUrl3 = ''
    imageUrl4 = ''
    imageUrl5 = ''
    dialogImageUrl = ''
    dialogVisible = false
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    }
    handleAvatarSuccess2 (res, file) {
      this.imageUrl2 = URL.createObjectURL(file.raw)
    }
    handleAvatarSuccess3 (res, file) {
      this.imageUrl3 = URL.createObjectURL(file.raw)
    }
    handleAvatarSuccess4 (res, file) {
      this.imageUrl4 = URL.createObjectURL(file.raw)
    }
    handleAvatarSuccess5 (res, file) {
      this.imageUrl5 = URL.createObjectURL(file.raw)
    }
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    }
    handleRemove (file, fileList) {
      console.log(file, fileList)
    }
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
    submitSuccess () {
      this.$router.push('/shopCheck/shop')
    }
    submitFail () {
      this.$alert('哎呦就是长得有点丑', '不通过原因', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
    }
  }
</script>


<style scoped lang="scss">
  .shop-edit{
    padding: 0 10px;
    .check-form{
      padding:0 100px 0 0;
      .el-form{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: repeat(7, 50px) 200px 200px 200px;
        .el-form-item{
          &:nth-child(2n-1){
            grid-column: 1 / 3;
          }
          &:nth-child(2n){
            grid-column: 3 / 5;
          }
          &.el-form-item-textarea{
            grid-column: 1 / 5;
          }
          &.el-form-item-upload{
            grid-column: 1 / 2;
          }
          &.el-form-item-upload2{
            grid-column: 2 / 5;
          }
          &.el-form-item-upload3{
            grid-column: 1 / 5;
          }
        }
      }
    }
  }
  .avatar-uploader{
    margin-right: 30px;
    position: relative;
    .uploade-text{
      position: absolute;
      width: 100%;
      text-align: center;
      left: 0;
      bottom: 10px;
      color: #666;
    }
  }
  .check-form-btn{
    display: flex;
    justify-content: center;
    padding: 50px;
  }
  /*
  element reset
   */
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
