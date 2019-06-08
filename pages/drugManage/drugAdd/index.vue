<template>
  <div class="add-wrap">
    <div class="add-form">
      <bread-crumb :path="$route.path"/>
      <div class="add-search">
        <h3>添加药品</h3>
        <div class="action">
          <!--选择药品-->
          <el-button class="select-btn value-btn" v-if="drugValue.name" size="small" @click="drugDialog = true">{{ drugValue.name }}</el-button>
          <el-button class="select-btn" v-else size="small" @click="drugDialog = true">请选择药品</el-button>
          <el-button type="primary" size="small" @click="getDrugInfo">确定</el-button>
        </div>
      </div>
      <el-form :model="drugInfoForm" label-width="150px">
        <el-form-item label="药品名称：">
          <el-input :value="drugInfoForm.name" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="通用名称：">
          <el-input :value="drugInfoForm.commonName" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="厂商简称：">
          <el-input :value="drugInfoForm.originName" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="批准文号：">
          <el-input :value="drugInfoForm.sfda" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="药品大类：">
          <el-input :value="parentTypeName" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="药品小类：">
          <el-input :value="childTypeName" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="药品类型：">
          <el-radio-group v-model="drugInfoForm.otc" disabled>
            <el-radio :label="false">处方药</el-radio>
            <el-radio :label="true">OTC</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规格：">
          <el-input :value="drugInfoForm.spec" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="剂型：">
          <el-input :value="drugInfoForm.form" readonly placeholder="暂无"></el-input>
        </el-form-item>
        <el-form-item label="是否医保：">
          <el-radio-group v-model="drugInfoForm.medicaid" disabled>
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="功能主治：" class="indication">
          <el-input
            type="textarea"
            readonly
            :rows="3"
            placeholder="暂无"
            v-model="drugInfoForm.introduce">
          </el-input>
        </el-form-item>
        <el-form-item label="条形码：">
          <el-input :value="drugInfoForm.barCode" readonly placeholder="暂无"></el-input>
        </el-form-item>
      </el-form>

      <el-form ref="params" :model="params" label-width="150px">
        <el-form-item label="进价：" prop="startPrice" :rules="[{ required: true, message: '请输入进价'}]">
          <el-input v-model="params.startPrice" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="销售价：" prop="price" :rules="[{ required: true, message: '请输入销售价'}]">
          <el-input v-model="params.price" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="当前库存："  prop="stock" :rules="[{ required: true, message: '请输入当前库存'}]">
          <el-input v-model="params.stock" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="预警库存："  prop="stockWarn" :rules="[{ required: true, message: '请输入预警库存'}]">
          <el-input v-model="params.stockWarn" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="是否推荐：">
          <el-radio-group v-model="params.recommend">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
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
      <div class="submit">
        <el-button type="primary" @click="submitAdd">提交</el-button>
      </div>
    </div>

    <!--选择药品-->
    <el-dialog
      title="药品列表"
      :close-on-click-modal='isCloseOnClickModal'
      :visible.sync="drugDialog"
      width="50%">
      <Drug v-on:listenToChildEvent="getSelectedInfo"></Drug>
      <span slot="footer" class="dialog-footer">
          <el-button @click="drugDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmSelect">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import BreadCrumb from '@/components/Breadcrumb'
  import Drug from '@/components/drugCheck/drugRadio/index'
  import axios from 'axios'

  @Component({
    components: {
      BreadCrumb,
      Drug
    }
  })
  export default class DrugDetail extends Vue {
    params = {
      startPrice: '',
      price: '',
      recommend: true,
      stock: '',
      stockWarn: '',
      grounding: true,
      drugId: ''
    }
    drugValue = {}
    drugInfoForm = {}
    selectedInfo = ''
    childData = ''
    isCloseOnClickModal = false
    drugDialog = false
    parentTypeName = ''
    childTypeName = ''

    startPrice = ''
    price = ''
    stock = ''
    stockWarn = ''
    recommend = true

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

    getSelectedInfo (data) {
      console.log(data)
      this.selectedInfo = data
    }

    confirmSelect () {
      if (!this.selectedInfo) {
        this.shopNameDialog = false
        return
      }
      this.childData = this.selectedInfo
      this.drugValue = this.childData
      this.drugDialog = false
    }

    // 获取药品信息
    async getDrugInfo () {
      this.parentTypeName = ''
      this.childTypeName = ''
      this.drugInfoForm = this.drugValue
      if (this.drugInfoForm.name === undefined) {
        this.$message({
          message: '请选择药品',
          type: 'warning'
        })
        return
      }

      // 药品大类
      if (this.drugInfoForm.drugDrugTypeParentList) {
        let parent = this.drugInfoForm.drugDrugTypeParentList
        parent.forEach(item => {
          this.parentTypeName += `${item.type},`
        })
        this.parentTypeName = this.parentTypeName.substring(0, this.parentTypeName.length - 1)
      }

      // 药品小类
      if (this.drugInfoForm.drugDrugTypeList) {
        let child = this.drugInfoForm.drugDrugTypeList
        child.forEach(item => {
          this.childTypeName += `${item.type},`
        })
        this.childTypeName = this.childTypeName.substring(0, this.childTypeName.length - 1)
      }

      if (this.drugInfoForm.medicaid !== null) {
        if (this.drugInfoForm.medicaid) {
          this.drugInfoForm.medicaid = '否'
        } else {
          this.drugInfoForm.medicaid = '是'
        }
      }

      let params = {
        resolution: 'LARGE_LOGO'
      }

      // 获取封面图片
      if (this.drugInfoForm.fileId) {
        let {data: cover} = await axios.get(`/api/shop/files/${this.drugInfoForm.fileId}`, {params})
        let imgURL = cover.replace('redirect:', '')
        let nullURL = imgURL.substring(imgURL.lastIndexOf('/') + 1, imgURL.length)
        if (nullURL !== 'null') {
          this.coverURL = imgURL
        } else {
          this.coverURL = nullURL
        }
      }

      // 获取展示图
      if (this.drugInfoForm.imgs) {
        this.drugImgList = []
        let childImgs = this.drugInfoForm.imgs.split(',')
        for (let i = 0, len = childImgs.length; i < len; i++) {
          let {data: detailImg} = await axios.get(`/api/shop/files/${childImgs[i]}`, {params})
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

    async submitAdd () {
      this.params = Object.assign(this.params, {
        drugId: this.drugInfoForm.id
      })
      const valid = this.$refs.params.validate()
      // console.log(valid)
      try {
        if (valid) {
          await axios.post('/api/shop/shopDrugs', this.params)
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        }
      } catch (e) {
        if (e.response) {
          console.log(e.response)
        }
        // this.$message.warning(e.message)
      } finally {
      }
    }

    beforeMount () {
    }
  }
</script>

<style scoped lang="scss">
  /deep/.add{
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

      .el-form{
        display: grid;
        grid-template-columns: 1fr 1fr;
        margin-right: 100px;

        .indication{
          grid-row: 6 / 8;
          grid-column: 1 / 3;

          textarea{
            resize: none;
          }
        }

        .el-form-item{
          .select-btn{
            width: 100%;
            color: #606266;
            text-align: left;
            padding-left: 15px;
            border-color: #DCDFE6;
            background-color: #FFF;

            &:hover{
              border-color: #C0C4CC;
            }
          }

          .el-select{
            width: 100%;
          }
        }
      }
    }

    &-search{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      margin-bottom: 15px;
      border-bottom: 1px solid #E9E9E9;

      .select-btn{
        width: 200px;
        height: 32px;
        line-height: inherit;
        margin-right: 10px;
        color: #c0c4cc;
        text-align: left;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .value-btn{
        color: #606266;
      }
    }
  }
  .check-image{
    margin: 20px 50px 0;
    display: grid;
    grid-template-columns: 25% 75%;
    grid-template-rows: 250px;
    section{
      img{
        max-width: 70%;
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

  .submit{
    text-align: center;
    margin: 30px auto;
  }
</style>

<style lang="scss">
  .child-type{
    height: 40px;
    span {
      width: 40%;
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      position: absolute;
      top: 13px;
    }
  }
</style>
