<template>
  <div class="drug-detail">
    <div class="drug-form">
      <bread-crumb :path="$route.path"/>
      <el-form ref="form" :model="detailForm" label-width="150px">
        <el-form-item label="药房名称">
          <el-input v-model="detailForm.shopName" readOnly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="药品名称">
          <el-input v-model="detailForm.drugName" readOnly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="通用名称">
          <el-input v-model="detailForm.commonName" readOnly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="批准文号">
          <el-input v-model="detailForm.sfda" readOnly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="厂商简称">
          <el-input v-model="detailForm.originName" readOnly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="otc非处方药">
          <el-input v-model="detailForm.otc ? '是' : '否'" readOnly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="药品大类">
          <el-input v-model="detailForm.typeParent" readOnly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="药品小类">
          <el-input v-model="detailForm.type" readOnly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="是否医保">
          <el-input v-model="detailForm.medicaided" readOnly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="适应性/功能主治">
          <el-input
            readOnly
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 10}"
            placeholder="暂无"
            v-model="detailForm.introduce">
          </el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="detailForm.price" readOnly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="detailForm.stock" readOnly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="库存预警量">
          <el-input v-model="detailForm.stockWarn" readOnly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="商品推荐">
          <el-input v-model="detailForm.recommend ? '是' : '否'" readOnly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="剂型">
          <el-input v-model="detailForm.formName" readOnly placeholder="暂无"></el-input>
        </el-form-item>
      </el-form>

      <div class="check-image">
        <section>
          <strong>药品封面照</strong>
          <div>
            <img v-if="coverURL" :src="coverURL">
            <img v-else :src="emptyUrl">
          </div>
        </section>
        <section>
          <strong>展示图</strong>
          <div>
            <span v-for="(item, index) in drugImgList" :key="index">
              <img v-if="item.imgURL !== 'null'" :src="item.imgURL">
              <img v-else :src="emptyUrl">
            </span>
          </div>
        </section>
      </div>
      <div class="back-btn">
        <el-button @click="goBack">返回</el-button>
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
  export default class DrugDetail extends Vue {
    detailForm = {}
    emptyUrl = require('../../../assets/img/hospital/img1.png')
    coverURL = ''
    drugImgList = [
      {
        imgURL: require('../../../assets/img/hospital/img1.png')
      },
      {
        imgURL: require('../../../assets/img/hospital/img1.png')
      },
      {
        imgURL: require('../../../assets/img/hospital/img1.png')
      }
    ]

    goBack () {
      this.$router.push('/drugCheck/drug')
    }

    async getDetailInfo () {
      let id = this.$route.query.id
      let {data: detail} = await axios.get(`/api/supervise/shopDrugs/${id}`)
      console.log('detail', detail)
      this.detailForm = detail
      if (this.detailForm.medicaided !== null) {
        if (this.detailForm.medicaided) {
          this.detailForm.medicaided = '否'
        } else {
          this.detailForm.medicaided = '是'
        }
      }

      let params = {
        resolution: 'LARGE_LOGO'
      }

      // 获取封面图片
      if (this.detailForm.fileId) {
        let {data: cover} = await axios.get(`/api/supervise/files/${this.detailForm.fileId}`, {params})
        let imgURL = cover.replace('redirect:', '')
        let nullURL = imgURL.substring(imgURL.lastIndexOf('/') + 1, imgURL.length)
        if (nullURL !== 'null') {
          this.coverURL = imgURL
        } else {
          this.coverURL = nullURL
        }
      }

      // 获取展示图
      if (this.detailForm.imgs) {
        this.drugImgList = []
        let childImgs = this.detailForm.imgs.split(',')
        for (let i = 0, len = childImgs.length; i < len; i++) {
          let {data: detailImg} = await axios.get(`/api/supervise/files/${childImgs[i]}`, {params})
          let url = detailImg.replace('redirect:', '')
          let empty = url.substring(url.lastIndexOf('/') + 1, url.length)
          if (empty !== 'null') {
            this.drugImgList.push({
              imgURL: url
            })
          } else {
            this.drugImgList.push({
              imgURL: empty
            })
          }
        }
      }
    }

    beforeMount () {
      let id = this.$route.query.id
      this.getDetailInfo(id)
    }
  }
</script>

<style scoped lang="scss">
  /deep/.drug{
    &-detail{
      padding: 0 10px;
      margin-bottom: 30px;

      .el-form{
        padding-top: 20px;
        margin-right: 100px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: repeat(4, 50px) 50px repeat(3, 50px);
        .el-form-item{
          &:nth-child(10){
            grid-row: 9 / 6;
            grid-column: 1 / 3;
          }
        }
      }
      .back-btn{
        text-align: center;
        margin: 30px auto;
      }
    }

    &-form{
      min-height: 850px;
      padding: 10px;
      background: #FFF;
      border-radius: 5px;
      border: 1px solid #E9E9E9;
    }
  }
  .check-image{
    margin: 20px 50px 0;
    display: grid;
    grid-template-columns: 25% 75%;
    grid-template-rows: 250px;
    section{
      img{
        max-width: 80%;
        height: auto;
      }
      strong{
        display: block;
        line-height: 3;
        font-size: 16px;
      }
      &:nth-child(2){
        >div{
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 200px;
        }
      }
    }
  }
</style>
