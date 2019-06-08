<template>
  <div class="hospital-detail">
    <bread-crumb :path="$route.path"/>
    <div class="hospital-form">
      <el-form ref="addData" :model="addData" label-width="150px" :rules="rules" >
        <el-form-item label="医院编码：" prop="code">
          <el-input v-model="addData.code" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="医院组织机构号：" prop="code">
          <el-input v-model="addData.organizeCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="医院名称：" prop="name">
          <el-input v-model="addData.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="医院电话：" prop="phone">
          <el-input v-model="addData.phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="医院地址：" prop="address">
          <el-input v-model="addData.address" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="经度：" prop="lng">
          <el-input v-model="addData.lng" @change="handler" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="纬度：" prop="lat">
          <el-input v-model="addData.lat" @change="handler" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item-map">
          <baidu-map :center="center" :zoom="zoom" @ready="handler" @click="getPoint" class="bm-view" :scroll-wheel-zoom="true">
            <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
            <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
            <bm-local-search :keyword="addData.address" :auto-viewport="true" :zoom="zoom" style="display: none"></bm-local-search>
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          </baidu-map>
        </el-form-item>
        <el-form-item label="医院照片：" class="hospitalImg">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="hospitalImage" :src="hospitalImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="医院介绍：" class="hospitalIntro" prop="introduction">
          <el-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 8}"
            placeholder="请输入"
            v-model="addData.introduction">
          </el-input>
        </el-form-item>
      </el-form>
      <div class="submit-btn">
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
  export default class HospitalCreat extends Vue {
    show = true
    addData = {
      code: '',
      organizeCode: '',
      name: '',
      phone: '',
      address: '',
      lng: '',
      lat: '',
      introduction: ''
    }
    hospitalImage = ''
    // imageJudeg = ''
    imgJudge = ''
    center = {lng: 120.9909, lat: 31.403685}
    zoom = 3

    rules = {
      code: [{ required: true, message: '医院编码不能为空', trigger: 'blur' }],
      organizeCode: [{ required: true, message: '医院组织机构号不能为空', trigger: 'blur' }],
      name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
      phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
      address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
      lng: [{ required: true, message: '经度不能为空', trigger: 'blur' }],
      lat: [{ required: true, message: '纬度不能为空', trigger: 'blur' }],
      introduction: [{ required: true, message: '简介不能为空', trigger: 'blur' }]
    }

    filePath = {} // 存放file
    handleAvatarSuccess (res, file) {
      this.hospitalImage = URL.createObjectURL(file.raw)
      this.filePath = file.raw
    }

    handler ({BMap, map}) {
      // console.log(BMap, map)
      this.center.lng = this.addData.lng
      this.center.lat = this.addData.lat
      this.zoom = 15
    }

    getPoint (e) { // 点击地图获取一些信息，
      this.show = true
      this.center.lng = this.addData.lng
      this.center.lat = this.addData.lat
      // this.zoom = 15
      this.zoom = e.target.getZoom()
      /* global BMap */
      let geocoder = new BMap.Geocoder() // 创建地址解析器的实例
      geocoder.getLocation(e.point, rs => {
        // console.log(rs)
        this.addData.lng = e.point.lng
        this.addData.lat = e.point.lat
      })
    }

    infoWindowClose () {
      this.show = false
    }

    infoWindowOpen () {
      setInterval(() => {
        this.show = true
      }, 100)
    }

    fileId = ''
    async submit () {
      if (this.imgJudge !== this.hospitalImage) {
        let fileParams = new FormData()
        fileParams.append('file', this.filePath)
        fileParams.append('fileType', 'LOGO')
        let {data: fileID} = await axios.post(`/api/supervise/files`, fileParams)
        this.fileId = fileID
      }

      this.addData = Object.assign(this.addData, {
        file: '',
        fileId: this.fileId
      })

      const valid = this.$refs.addData.validate()
      try {
        if (valid) {
          if (this.hospitalImage === '') {
            this.$message.warning('请上传医院照片')
            return false
          }
          await axios.post(`/api/supervise/hospitals`, this.addData)
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          setTimeout(() => {
            this.$router.push({path: '/shopCheck/hospital'})
          }, 1000)
        }
      } catch (e) {
        if (e.response) {
          console.log(e.response)
        }
      } finally {
      }
    }
    //
  }
</script>


<style scoped lang="scss">
  .hospital-detail{
    padding: 0 10px;
    background: #FFF;

    .breadcrumb-wrap{
      padding-left: 15px;
    }

    .hospital-form{
      padding-right: 100px;
      padding-top: 20px;

      form.el-form{
        display: grid;
        grid-template-columns: 40% 60%;
        grid-template-rows: repeat(7, 60px) 300px 200px;
        .el-form-item{
          grid-column: 1 / 2;
          &.hospitalImg{
            grid-column: 2 / 3;
            grid-row: 1 / 8;
          }
          &.hospitalIntro{
            grid-column: 1 / 3;
          }
          &.el-form-item-map{
            grid-column: 1 / 3;
            .bm-view {
              width: 100%;
              height: 280px;
            }
          }
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
    width: 448px;
    height: 296px;
    line-height: 296px;
    text-align: center;
  }
  /deep/.avatar {
    width: 448px;
    height: 296px;
    display: block;
  }
  .submit-btn{
    display: flex;
    justify-content: center;
  }
</style>
