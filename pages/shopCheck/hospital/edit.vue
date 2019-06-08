<template>
  <div class="hospital-detail">
    <bread-crumb :path="$route.path"/>
    <div class="hospital-form">
      <el-form ref="form" :model="editData" label-width="150px">
        <el-form-item label="医院编码：">
          <el-input v-model="editData.code" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="医院组织机构号：">
          <el-input v-model="editData.organizeCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="医院名称：">
          <el-input v-model="editData.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="医院电话：">
          <el-input v-model="editData.phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="医院地址：">
          <el-input v-model="editData.address" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="经度：">
          <el-input v-model="editData.lng" @change="handler" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="纬度：">
          <el-input v-model="editData.lat" @change="handler" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item-map">
          <baidu-map :center="center" :zoom="zoom" @ready="handler" class="bm-view">
            <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
            <!--<bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>-->
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          </baidu-map>
        </el-form-item>
        <el-form-item label="医院照片：" class="hospitalImg">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-success="uploadSuccess"
            >
            <img v-if="hospitalImage" :src="hospitalImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="医院介绍：" class="hospitalIntro">
          <el-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 8}"
            placeholder="请输入"
            v-model="editData.introduction">
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
  export default class HospitalEdit extends Vue {
    editData = {}
    hospitalImage = ''
    hID = ''
    imgJudge = ''
    center = {lng: 0, lat: 0}
    zoom = 3

    handler ({BMap, map}) {
      // console.log(BMap, map)
      this.center.lng = this.editData.lng
      this.center.lat = this.editData.lat
      this.zoom = 15
    }

    uploadSuccess (res, file) {
      this.hospitalImage = URL.createObjectURL(file.raw)
      this.editData.editFile = file.raw
    }

    // 提交
    async submit () {
      if (this.imgJudge !== this.hospitalImage) {
        let fileParams = new FormData()
        fileParams.append('file', this.editData.editFile)
        fileParams.append('fileType', 'LOGO')
        let {data: fileID} = await axios.post(`/api/supervise/files`, fileParams)
        this.editData.fileId = fileID
      }

      await axios.put(`/api/supervise/hospitals/${this.hID}`, this.editData)
      this.$message({
        message: '修改成功！',
        type: 'success'
      })
      setTimeout(() => {
        this.$router.go(-1)
      }, 1000)
    }

    async getInfo (id) {
      let {data: detail} = await axios.get(`/api/supervise/hospitals/${id}`)
      console.log(detail)
      this.editData = detail

      // 获取医院图片
      let params = {
        resolution: 'LARGE_LOGO'
      }
      let {data: imgRes} = await axios.get(`/api/supervise/files/${this.editData.fileId}`, {params})
      let url = imgRes.replace('redirect:', '')
      if (url.substring(url.lastIndexOf('/') + 1, url.length) !== 'null') {
        this.hospitalImage = url
        this.imgJudge = this.hospitalImage
      }
    }

    mounted () {
      this.hID = this.$route.query.id
      this.getInfo(this.hID)
    }
  }
</script>

<style scoped lang="scss">
  .hospital-detail{
    padding: 10px;
    background: #FFF;

    .breadcrumb-wrap{
      padding-left: 15px;
    }

    .hospital-form{
      padding-right: 200px;
      padding-top: 20px;

      form.el-form{
        display: grid;
        grid-template-columns: 40% 60%;
        grid-template-rows: repeat(7, 50px) 200px;
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
            grid-row: 8 / 10;
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
