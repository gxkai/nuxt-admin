<template>
  <div class="shop-edit">
    <div class="check-form">
      <bread-crumb :path="$route.path"/>
      <el-form ref="form" class="detail-form" :model="form" label-width="150px">
        <el-form-item label="药店名称：">
          <el-input v-model="form.shopName" disabled placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="店内电话：">
          <el-input v-model="form.shopPhone" disabled placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="法人姓名：">
          <el-input v-model="form.legalName" disabled placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="身份证：">
          <el-input v-model="form.idNumber" disabled placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="form.shopEmail" disabled placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="法人手机号：">
          <el-input v-model="form.legalPhone" disabled placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="税务登记号：">
          <el-input v-model="form.taxNumber" disabled placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="经营许可证号：">
          <el-input v-model="form.shopLicence" disabled placeholder="暂无"></el-input>
        </el-form-item>

        <el-form-item label="GSP证号：">
          <el-input v-model="form.gspCertificate" disabled placeholder="暂无"></el-input>
        </el-form-item>
        <!--<el-form-item label="RCB Key：">-->
        <!--<el-input v-model="shopForm.rcb" placeholder="请输入"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="营业执照：">
          <el-input v-model="form.license" disabled placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="经营地址：">
          <el-input v-model="form.address" disabled placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="营业开始时间：">
          <el-time-select
            disabled
            style="width:100%"
            v-model="form.openTime"
            placeholder="营业开始时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="营业结束时间：">
          <el-time-select
            disabled
            style="width:100%"
            v-model="form.closeTime"
            placeholder="营业结束时间">
          </el-time-select>
        </el-form-item>

        <el-form-item label="经度：">
          <el-input v-model="form.shopLng" disabled placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="纬度：">
          <el-input v-model="form.shopLat" disabled placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item-map">
          <baidu-map :center="center" :zoom="zoom" @ready="handler" class="bm-view">
            <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
            </bm-marker>
          </baidu-map>
        </el-form-item>
        <el-form-item label="是否支持医保：">
          <el-input v-model="form.orMedicine" disabled placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="是否支持统筹：">
          <el-input v-model="form.orOverall" disabled placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="是否配送：">
          <el-input v-model="form.orDelivery" disabled placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="配送距离：">
          <el-input v-model="form.delDistance" disabled placeholder="3公里"></el-input>
        </el-form-item>
        <el-form-item label="商家介绍：" class="el-form-item-textarea">
          <el-input
            disabled
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 8}"
            placeholder="暂无"
            v-model="form.shopIntroduce">
          </el-input>
        </el-form-item>
      </el-form>

      <div class="shop-check-img">
        <section>
          <strong>药品封面照</strong>
          <div><img :src="imageUrl"></div>
        </section>
        <section>
          <strong>店内照片</strong>
          <div>
            <span v-for="item in shopImg" :key="item.id">
              <img :src="item.imageUrl">
            </span>
          </div>
        </section>
        <section>
          <strong>上传证件资料</strong>
          <div>
            <span>
              <img :src="cardImage1">
              <i>经营许可证</i>
            </span>
            <span>
              <img :src="cardImage2">
              <i>营业执照</i>
            </span>
            <span>
              <img :src="cardImage3">
              <i>GSP证书</i>
            </span>
            <span>
              <img :src="cardImage4">
              <i>手持身份证照片</i>
            </span>
          </div>
        </section>
      </div>
      <div class="check-form-btn">
        <el-button @click="goback">返回</el-button>
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
  export default class ShopDetail extends Vue {
    form = {}
    center = {lng: 0, lat: 0}
    zoom = 3
    imageUrl = ''
    shopImg = []
    cardImage1 = ''
    cardImage2 = ''
    cardImage3 = ''
    cardImage4 = ''

    beforeMount () {
      this.getShopInfo()
    }
    async getShopInfo () {
      let id = this.$route.query.id
      let data = await axios.get(`/api/supervise/shops/${id}`)

      let params = {
        local: '',
        resolution: ''
      }
      // 药品封面照
      if (data.data.identityImg !== '') {
        let img1 = await axios.get(`/api/supervise/files/${data.data.identityImg}`, {params: params})
        this.imageUrl = img1.data.replace('redirect:', '')
      }
      // 店内照片
      data.data.innerImages.forEach((item, index) => {
        axios.get(`/api/supervise/files/${item}`, {params: params}).then(res => {
          this.shopImg.push({
            id: index,
            imageUrl: res.data.replace('redirect:', '')
          })
        })
      })
      if (data.data.licenseImg !== '') {
        let img2 = await axios.get(`/api/supervise/files/${data.data.licenseImg}`, {params: params})
        this.cardImage1 = img2.data.replace('redirect:', '')
      }
      if (data.data.certificateImg !== '') {
        let img3 = await axios.get(`/api/supervise/files/${data.data.certificateImg}`, {params: params})
        this.cardImage2 = img3.data.replace('redirect:', '')
      }
      if (data.data.gspImg !== '') {
        let img4 = await axios.get(`/api/supervise/files/${data.data.gspImg}`, {params: params})
        this.cardImage3 = img4.data.replace('redirect:', '')
      }
      if (data.data.identityImg !== '') {
        let img5 = await axios.get(`/api/supervise/files/${data.data.identityImg}`, {params: params})
        this.cardImage4 = img5.data.replace('redirect:', '')
      }

      if (data.data.medicaid.toString() === 'true') {
        data.data.medicaid = '是'
      } else {
        data.data.medicaid = '否'
      }
      if (data.data.gathered.toString() === 'true') {
        data.data.gathered = '是'
      } else {
        data.data.gathered = '否'
      }
      if (data.data.distribution.toString() === 'true') {
        data.data.distribution = '是'
      } else {
        data.data.distribution = '否'
      }

      this.form = data.data

      // this.form.shopName = data.data.shopName
      // this.form.shopPhone = data.data.phone
      // this.form.legalPhone = data.data.legalPhone
      // this.form.legalName = data.data.legal
      // this.form.idNumber = data.data.identityNumber
      // this.form.shopEmail = data.data.mail
      // this.form.taxNumber = data.data.taxCode
      // this.form.shopLicence = data.data.certificate
      // this.form.shopLng = data.data.lng
      // this.form.shopLat = data.data.lat
      // this.form.orMedicine = data.data.medicaid
      // this.form.orOverall = data.data.gathered
      // this.form.orDelivery = data.data.distribution
      // this.form.delDistance = data.data.distance
      // this.form.shopIntroduce = data.data.introduction
    }
    goback () {
      this.$router.go(-1)
    }
    async handler ({BMap, map}) {
      // console.log(BMap, map)
      await axios.get(`/api/supervise/shops/${this.$route.query.id}`).then(res => {
        console.log(res)
        this.center.lng = res.data.lng
        this.center.lat = res.data.lat
      })
      this.zoom = 15
    }
  }
</script>

<style scoped lang="scss">
.shop-edit{
  padding: 0 10px;
  margin-bottom: 30px;

  .check-form{
    min-height: 850px;
    background: #FFF;
    border-radius: 5px;
    border: 1px solid #E9E9E9;
    padding: 10px 100px 10px 10px;

    .el-form{
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: repeat(7, 55px) 280px repeat(2, 55px) 200px;
      padding-top: 20px;
      .el-form-item{
        &:nth-child(1),&:nth-child(3),&:nth-child(5),&:nth-child(7),
        &:nth-child(9),&:nth-child(11),&:nth-child(13){
          grid-column: 1 / 3;
        }
        &:nth-child(2),&:nth-child(4),&:nth-child(6),
        &:nth-child(8),&:nth-child(10),&:nth-child(12){
          grid-column: 3 / 5;
        }
        &.el-form-item-textarea{
          grid-column: 1 / 5;
        }
        &.el-form-item-map{
          grid-column: 1 / 5;
          .bm-view {
            width: 100%;
            height: 260px;
          }
        }
      }
    }
  }
  .shop-check-img{
    margin-left: 50px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 220px 220px;
    section{
      img{
        max-width: 100%;
        height: 160px;
      }
      strong{
        display: block;
        line-height: 3;
        font-size: 16px;
        text-indent: 50px;
      }
      &:nth-child(1){
         grid-column: 1 / 2;
        >div{
          text-align: center;
        }
       }
      &:nth-child(2){
        grid-column: 2 / 5;
        >div{
          display: flex;
          span{
            flex: 0 0 33.33%;
            text-align: center;
          }
        }
      }
      &:nth-child(3){
        grid-column: 1 / 5;
        >div{
          display: flex;
          span{
            position: relative;
            width: 25%;
            text-align: center;
            i{
              width: 100%;
              position: absolute;
              left: 0;
              bottom: 30%;
              z-index: 99;
              font-size: 16px;
              color: #333333;
              font-style: normal;
            }
          }
        }
      }
    }
  }
}

.check-form-btn{
  display: flex;
  justify-content: center;
  padding: 50px;
}

</style>
