<template>
  <div class="common-wrap">
    <div class="common-list">
      <bread-crumb :path="$route.path"/>
      <h3 class="h3-title">基本信息</h3>

      <div class="check-form">
        <el-form ref="form" :model="shopForm" label-width="150px" :rules="rules">
          <el-form-item label="药店名称：" prop="name">
            <el-input v-model="shopForm.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="店内电话：">
            <el-input v-model="shopForm.phone" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="法人姓名：">
            <el-input v-model="shopForm.legal" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="身份证：">
            <el-input v-model="shopForm.identityNumber" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：">
            <el-input v-model="shopForm.mail" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="法人手机号：">
            <el-input v-model="shopForm.legalPhone" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="税务登记号：">
            <el-input v-model="shopForm.taxCode" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="经营许可证号：">
            <el-input v-model="shopForm.certificate" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="GSP证号：">
            <el-input v-model="shopForm.gspCertificate" placeholder="请输入"></el-input>
          </el-form-item>
          <!--<el-form-item label="RCB Key：">-->
            <!--<el-input v-model="shopForm.rcb" placeholder="请输入"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="营业执照：">
            <el-input v-model="shopForm.license" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="经营地址：">
            <el-input v-model="shopForm.address" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="营业开始时间：">
            <el-time-select
              style="width:100%"
              v-model="shopForm.openTime"
              :picker-options="{
                start: '06:00',
                step: '00:30',
                end: '12:00'
              }"
              placeholder="营业开始时间">
            </el-time-select>
          </el-form-item>
          <el-form-item label="营业结束时间：">
            <el-time-select
              style="width:100%"
              v-model="shopForm.closeTime"
              :picker-options="{
                start: '12:00',
                step: '00:30',
                end: '22:00'
              }"
              placeholder="营业结束时间">
            </el-time-select>
          </el-form-item>
          <el-form-item label="经度：">
            <el-button class="select-btn" v-if="shopForm.lng" @click="dialogMapVisible = true" size="middle">{{
              this.shopForm.lng }}
            </el-button>
            <el-button class="select-btn" v-else @click="dialogMapVisible = true" style="color: #C0C4CC;" size="middle">
              请输入
            </el-button>
          </el-form-item>
          <el-form-item label="纬度：">
            <el-button class="select-btn" v-if="shopForm.lat" @click="dialogMapVisible = true" size="middle">{{
              this.shopForm.lat }}
            </el-button>
            <el-button class="select-btn" v-else @click="dialogMapVisible = true" style="color: #C0C4CC;" size="middle">
              请输入
            </el-button>
          </el-form-item>
          <el-form-item label="是否支持医保：">
            <el-select v-model="shopForm.medicaid" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否支持统筹：">
            <el-select v-model="shopForm.gathered" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否配送：">
            <el-select v-model="shopForm.distribution" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配送距离：">
            <el-input v-model="shopForm.distance" placeholder="3公里"></el-input>
          </el-form-item>
          <el-form-item label="商家介绍：" class="el-form-item-textarea">
            <el-input
              type="textarea"
              :autosize="{ minRows: 8, maxRows: 8}"
              placeholder="请输入内容"
              v-model="shopForm.introduction">
            </el-input>
          </el-form-item>
        </el-form>
        <!--图片上传-->
        <div class="div-upload">
          <div class="div-upload-item1">
            <div class="img-title">药店封面照</div>
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :on-success="handleAvatarSuccess">
              <img v-if="shopLogo" :src="shopLogo" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>

          <div class="div-upload-item2">
            <div class="img-title">店内照片</div>
            <el-upload
              action=""
              list-type="picture-card"
              :limit="3"
              :file-list="innerFileImg"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="childUploadSuccess">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="innerImg" alt="">
            </el-dialog>
          </div>

          <div class="div-upload-item3">
            <div class="img-title">上传证件资料</div>
            <div style="display: flex;">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :on-success="handleAvatarSuccess2">
                <img v-if="certificateImg" :src="certificateImg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div class="uploade-text">经营许可证</div>
              </el-upload>
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :on-success="handleAvatarSuccess3">
                <img v-if="licenseImg" :src="licenseImg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div class="uploade-text">营业执照</div>
              </el-upload>
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :on-success="handleAvatarSuccess4">
                <img v-if="gspImg" :src="gspImg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div class="uploade-text">GSP证书</div>
              </el-upload>
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :on-success="handleAvatarSuccess5">
                <img v-if="idnumberImg" :src="idnumberImg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div class="uploade-text">手持身份证照片</div>
              </el-upload>

            </div>
          </div>

        </div>

        <!--获取经纬度弹窗-->
        <el-dialog title="获取经纬度" :visible.sync="dialogMapVisible">
          <div class="map-search">
            <el-input v-model="addKeyword" placeholder="请输入地址" size="small" style="min-width: 250px;"></el-input>
            经度：
            <el-input v-model="getLng" placeholder="经度" size="small"></el-input>
            纬度：
            <el-input v-model="getLat" placeholder="纬度" size="small"></el-input>
          </div>
          <baidu-map :center="center" :zoom="zoom" @ready="handler" @click="getPoint" class="bm-view" :scroll-wheel-zoom="true">
            <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
            <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
                         anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
            <bm-local-search :keyword="addKeyword" :auto-viewport="true" :zoom="zoom"
                             style="display: none"></bm-local-search>
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          </baidu-map>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogMapVisible = false">取 消</el-button>
            <el-button type="primary" @click="getLngLat">确 定</el-button>
          </div>
        </el-dialog>

        <div class="check-form-btn">
          <el-button>返回</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </div>

      </div>
      <!--check-form end-->

    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import axios from 'axios'
  import localForage from 'localforage'

  @Component({
    components: {
      BreadCrumb
    }
  })
  export default class SetUpShop extends Vue {
    shopForm = {
      name: '',
      phone: '',
      legal: '',
      identityNumber: '',
      mail: '',
      legalPhone: '',
      taxCode: '',
      gspCertificate: '',
      rcb: '',
      openTime: '',
      closeTime: '',
      certificate: '',
      license: '',
      address: '',
      lng: '',
      lat: '',
      medicaid: '',
      gathered: '',
      distribution: '',
      distance: '',
      introduction: '',
      fileId: '', // 药店LOGO图片ID
      shopInnerFileId: [], // 最多4张店内照片ID
      licenseFileId: '', // 营业执照图片ID
      certificateFileId: '', // 经营许可证图片ID
      gspFileId: '', // gsp图片ID
      identityNumberFileId: '' // 身份证图片ID
    };
    options = [
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ];

    rules = {
      name: [{ required: true, message: '请输入药店名称', trigger: 'blur' }]
    }

    shopLogo = ''; // 药店封面照
    shopLogoFile = {}; // 药店LOGO存放
    handleAvatarSuccess (res, file) {
      this.shopLogo = URL.createObjectURL(file.raw)
      this.shopLogoFile = file.raw
    }

    // 店内照片
    shopInnerFileIdList = [];
    dialogVisible = false;

    innerImg = ''

    innerFileImg = [];
    innerFileId = '';

    handleRemove (file, fileList) {
      console.log(file, fileList)
    }

    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }

    // 店内照片上传
    childUploadSuccess (res, file, fileList) {
      this.innerFileImg = fileList
    }

    licenseImg = '' // 营业执照
    licenseImgFile = {}

    certificateImg = '' // 经营许可证
    certificateImgFile = {}

    gspImg = '' // GSP证书
    gspImgFile = {}

    idnumberImg = '' // 手持身份证照片
    idnumberImgFile = {}

    beforeMount () {
      // console.log(localForage)
      localForage.getItem('circulate-token').then(token => {
        // console.log(token)
        axios.get(`/api/shop/shops/${token}`).then(res => {
          console.log(res.data)
          if (res.data !== null) {
            this.shopForm.name = res.data.name
            this.shopForm.legal = res.data.legal
            this.shopForm.identityNumber = res.data.identityNumber
            this.shopForm.legalPhone = res.data.legalPhone
            this.shopForm.mail = res.data.mail
            this.shopForm.taxCode = res.data.taxCode
            this.shopForm.license = res.data.license
            this.shopForm.certificate = res.data.certificate
            this.shopForm.gspCertificate = res.data.gspCertificate
            this.shopForm.phone = res.data.phone
            this.shopForm.address = res.data.address
            this.shopForm.introduction = res.data.introduction
            this.shopForm.openTime = res.data.openTime
            this.shopForm.closeTime = res.data.closeTime
            this.shopForm.gathered = res.data.gathered
            this.shopForm.medicaid = res.data.medicaid
            this.shopForm.distance = res.data.distance
            this.shopForm.lat = res.data.lat
            this.shopForm.lng = res.data.lng
            this.shopForm.rcb = res.data.rcbKey
            this.shopForm.distribution = res.data.distribution

            this.shopForm.fileId = res.data.fileId // 药店LOGO图片ID
            this.innerFileId = res.data.shopInnerFileIdList // 最多4张店内照片ID
            this.shopForm.licenseFileId = res.data.licenseFileId // 营业执照图片ID
            this.shopForm.certificateFileId = res.data.certificateFileId // 经营许可证图片ID
            this.shopForm.gspFileId = res.data.gspFileId // gsp图片ID
            this.shopForm.identityNumberFileId = res.data.identityNumberFileId // 身份证图片ID

            // console.log(res.data.shopInnerFileIdList)

            // 照片
            let params = {
              resolution: 'SMALL_LOGO'
            }
            // 封面照
            let shopImg = res.data.fileId
            if (shopImg !== null) {
              axios.get(`/api/shop/files/${shopImg}`, {params: params}).then(res => {
                this.shopLogo = res.data.replace('redirect:', '')
              })
            } else {
              this.shopLogo = ''
            }
            // 店内照片
            let shopInner = res.data.shopInnerFileIdList
            if (shopInner !== null) {
              shopInner.forEach((item) => {
                axios.get(`/api/shop/files/${item}`, {params: params}).then(res => {
                  this.innerImg = res.data.replace('redirect:', '')
                  console.log(this.innerImg)
                })
              })
            }

            // 经营许可证
            let shopImg2 = res.data.certificateFileId
            if (shopImg2 !== '') {
              axios.get(`/api/shop/files/${shopImg2}`, {params: params}).then(res => {
                this.certificateImg = res.data.replace('redirect:', '')
              })
            }
            // 营业执照
            let shopImg3 = res.data.licenseFileId
            if (shopImg3 !== '') {
              axios.get(`/api/shop/files/${shopImg3}`, {params: params}).then(res => {
                // console.log(res)
                this.licenseImg = res.data.replace('redirect:', '')
              })
            }
            // GSP证书 gspImg
            let shopImg4 = res.data.gspFileId
            if (shopImg4 !== '') {
              axios.get(`/api/shop/files/${shopImg4}`, {params: params}).then(res => {
                this.gspImg = res.data.replace('redirect:', '')
              })
            }
            // 手持身份证照片
            let shopImg5 = res.data.identityNumberFileId
            if (shopImg5 !== '') {
              axios.get(`/api/shop/files/${shopImg5}`, {params: params}).then(res => {
                this.idnumberImg = res.data.replace('redirect:', '')
              })
            }
            //
          }
        })
      })
    }

    handleAvatarSuccess2 (res, file) {
      this.certificateImg = URL.createObjectURL(file.raw)
      this.certificateImgFile = file.raw
    }

    handleAvatarSuccess3 (res, file) {
      this.licenseImg = URL.createObjectURL(file.raw)
      this.licenseImgFile = file.raw
    }

    handleAvatarSuccess4 (res, file) {
      this.gspImg = URL.createObjectURL(file.raw)
      this.gspImgFile = file.raw
    }

    handleAvatarSuccess5 (res, file) {
      this.idnumberImg = URL.createObjectURL(file.raw)
      this.idnumberImgFile = file.raw
    }

    // 获取上传文件
    getFileParams (file) {
      let fileParams = new FormData()
      fileParams.append('file', file)
      fileParams.append('fileType', 'LOGO')
      return fileParams
    }

    async submit () {
      console.log(this.shopForm.fileId)
      console.log(this.innerFileId)
      console.log(this.shopForm.licenseFileId)
      console.log(this.shopForm.certificateFileId)
      console.log(this.shopForm.gspFileId)
      console.log(this.shopForm.identityNumberFileId)
  
      await axios.post(`/api/shop/files`, this.getFileParams(this.shopLogoFile)).then(res => {
        console.log('logoFileID', res.data)
        if (this.shopForm.fileId !== res.data) {
          this.shopForm.fileId = res.data
        }
      }).catch(error => {
        if (error.response) {
          if (error.response.status === 400) {
            this.$message({
              message: '请上传logo图片!',
              type: 'warning'
            })
            this.$router.push('/shop/setup')
          }
        }
      })

      // 店内图片上传
      if (this.innerFileImg.length > 0) {
        let fid = []
        for (let i = 0; i < this.innerFileImg.length; i++) {
          let innerImgParams = new FormData()
          innerImgParams.append('file', this.innerFileImg[i].raw)
          innerImgParams.append('fileType', 'LOGO')
          let { data: innerImgData } = await axios.post('/api/shop/files', innerImgParams)
          fid.push(innerImgData)
        }
        this.innerFileId = fid
        console.log(this.innerFileId)
      }

      // 上传经营许可证
      let { data: certificateID } = await axios.post(`/api/shop/files`, this.getFileParams(this.certificateImgFile))
      this.shopForm.certificateFileId = certificateID
      console.log(certificateID)

      // 上传营业执照
      let { data: licenseID } = await axios.post(`/api/shop/files`, this.getFileParams(this.licenseImgFile))
      this.shopForm.licenseFileId = licenseID
      console.log(licenseID)

      // GSP证书
      let { data: gspID } = await axios.post(`/api/shop/files`, this.getFileParams(this.gspImgFile))
      this.shopForm.gspFileId = gspID
      console.log(gspID)

      // 手持身份证
      let { data: idnumberID } = await axios.post(`/api/shop/files`, this.getFileParams(this.idnumberImgFile))
      this.shopForm.identityNumberFileId = idnumberID
      console.log(idnumberID)

      const valid = this.$refs.form.validate()
      try {
        if (valid) {
          let shopCreateDTO = {
            id: '',
            name: this.shopForm.name,
            legal: this.shopForm.legal,
            identityNumber: this.shopForm.identityNumber,
            legalPhone: this.shopForm.legalPhone,
            mail: this.shopForm.mail,
            taxCode: this.shopForm.taxCode,
            license: this.shopForm.license,
            certificate: this.shopForm.certificate,
            gspCertificate: this.shopForm.gspCertificate,
            phone: this.shopForm.phone,
            address: this.shopForm.address,
            introduction: this.shopForm.introduction,
            openTime: this.shopForm.openTime,
            closeTime: this.shopForm.closeTime,
            state: 'TO_CHECK',
            fileId: this.shopForm.fileId, // 药店LOGO图片ID
            shopInnerFileId: this.innerFileId, // 最多4张店内照片ID
            licenseFileId: this.shopForm.licenseFileId, // 营业执照图片ID
            certificateFileId: this.shopForm.certificateFileId, // 经营许可证图片ID
            gspFileId: this.shopForm.gspFileId, // gsp图片ID
            identityNumberFileId: this.shopForm.identityNumberFileId, // 身份证图片ID
            gathered: this.shopForm.gathered,
            medicaid: this.shopForm.medicaid,
            distance: this.shopForm.distance,
            lat: this.shopForm.lat,
            lng: this.shopForm.lng,
            rcbKey: this.shopForm.rcb,
            distribution: this.shopForm.distribution
          }
          let addShop = await axios.post(`/api/shop/shops`, shopCreateDTO)
          console.log(addShop)
          if (addShop) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          }
        }
      } catch (e) {
        this.$message.warning(e.message)
      } finally {
        this.$router.push('/shop/setup')
      }
    }

    // 获取经纬度弹框
    dialogMapVisible = false;
    center = { lng: 120.9909, lat: 31.398754 };
    zoom = 10;
    addKeyword = ''; // 输入地址
    getLng = ''; // 获取经度
    getLat = ''; // 获取纬度

    // 初始化地图
    handler ({ BMap, map }) {
      console.log(BMap, map)
    }

    // 点击获取地图信息
    getPoint (e) {
      console.log(e)
      this.getLng = e.point.lng
      this.getLat = e.point.lat
      this.zoom = e.target.getZoom()
    }

    getLngLat () {
      this.shopForm.lng = this.center.lng = this.getLng
      this.shopForm.lat = this.center.lat = this.getLat
      this.dialogMapVisible = false
    }

    //
  }
</script>

<style lang="scss" scoped>
  .select-btn {
    width: 100%;
    text-align: left;
    font-size: 14px;
  }

  .bm-view {
    width: 100%;
    height: 280px;
  }

  .map-search {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    .el-input {
      width: 100px;
      margin-right: 30px;
    }
  }

  /deep/ .common {
    &-wrap {
      padding: 0 10px;
      margin-bottom: 30px;
    }
    &-list {
      /*min-height: 850px;*/
      background: #FFF;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #E9E9E9;

      .h3-title {
        border-bottom: 1px solid #E9E9E9;
        padding: 0 15px 15px 15px;
        margin: 15px 0;
      }

      .check-form {
        padding-right: 100px;
        .el-form {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          grid-template-rows: repeat(10, 60px) 200px;
          .el-form-item {
            &:nth-child(2n-1) {
              grid-column: 1 / 3;
            }
            &:nth-child(2n) {
              grid-column: 3 / 5;
            }
            &.el-form-item-textarea {
              grid-column: 1 / 5;
            }
          }

        }

        .div-upload {
          margin-left: 150px;
          clear: both;
          zoom: 1;
          overflow: hidden;

          .img-title {
            font-size: 14px;
            line-height: 3;
          }

          &-item1 {
            float: left;
          }
          &-item2 {
            width: 70%;
            float: left;
          }
          &-item3 {
            width: 100%;
            float: left;
          }

        }

        /*图片上传*/
        .avatar-uploader {
          margin-right: 30px;
          position: relative;
          .uploade-text {
            position: absolute;
            width: 100%;
            text-align: center;
            left: 0;
            bottom: 10px;
            color: #666;
            font-size: 14px;
          }
        }
        .avatar-uploader .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
          border-color: #409EFF;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 148px;
          height: 148px;
          line-height: 148px;
          text-align: center;
        }
        .avatar {
          width: 148px;
          height: 148px;
          display: block;
        }

        .check-form-btn {
          display: flex;
          justify-content: center;
          padding: 50px;
        }

      }
    }

  }
</style>
