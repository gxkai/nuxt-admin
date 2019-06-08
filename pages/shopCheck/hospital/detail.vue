<template>
  <div class="hospital-detail">
    <div class="hospital-form">
      <bread-crumb :path="$route.path"/>
      <el-form ref="detailForm" :model="detailForm" label-width="150px">
        <el-form-item label="医院编码：">
          <el-input v-model="detailForm.code" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="医院组织机构号：">
          <el-input v-model="detailForm.organizeCode" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="医院名称：">
          <el-input v-model="detailForm.name" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="医院电话：">
          <el-input v-model="detailForm.phone" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="医院地址：">
          <el-input v-model="detailForm.address" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="经度：">
          <el-input v-model="detailForm.lng" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="纬度：">
          <el-input v-model="detailForm.lat" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item-map">
          <baidu-map :center="center" :zoom="zoom" @ready="handler" class="bm-view">
            <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
            <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          </baidu-map>
        </el-form-item>
        <el-form-item label="医院照片：" class="hospitalImg">
          <el-upload
            disabled
            class="avatar-uploader"
            action=""
            :show-file-list="false">
            <img v-if="hospitalImage" :src="hospitalImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="医院介绍：" class="hospitalIntro">
          <el-input
            readonly
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 8}"
            placeholder="暂无介绍"
            v-model="detailForm.introduction">
          </el-input>
        </el-form-item>
      </el-form>
      <div class="submit-btn">
        <el-button @click="$router.go(-1)">返回</el-button>
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
  export default class HospitalDetail extends Vue {
    detailForm = {}
    center = {lng: 0, lat: 0}
    zoom = 3
    hospitalImage = ''

    handler ({BMap, map}) {
      // console.log(BMap, map)
      this.center.lng = this.detailForm.lng
      this.center.lat = this.detailForm.lat
      this.zoom = 15
    }

    async getHospitalDetail (id) {
      let {data: detail} = await axios.get(`/api/supervise/hospitals/${id}`)
      console.log(detail)
      this.detailForm = detail

      // 获取医院图片
      let params = {
        resolution: 'MIDDLE_LOGO'
      }
      let {data: imgRes} = await axios.get(`/api/supervise/files/${this.detailForm.fileId}`, {params})
      console.log(imgRes)
      let url = imgRes.replace('redirect:', '')
      if (url.substring(url.lastIndexOf('/') + 1, url.length) !== 'null') {
        this.hospitalImage = url
      }
    }

    mounted () {
      let id = this.$route.query.id
      this.getHospitalDetail(id)
    }
  }
</script>

<style scoped lang="scss">
.hospital-detail{
  padding: 0 10px;
  margin-bottom: 30px;

  .hospital-form{
    min-height: 850px;
    background: #FFF;
    border-radius: 5px;
    border: 1px solid #E9E9E9;
    padding: 10px 200px 10px 10px;

    form.el-form{
      display: grid;
      grid-template-columns: 40% 60%;
      grid-template-rows: repeat(7, 50px) 300px 200px;
      margin-top: 20px;

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
    margin: 15px 0;
  }
</style>
